"""
DoppelGuard Enterprise Authentication & Role-Based Access Control (RBAC) Module.

Implements PBKDF2-HMAC-SHA256 password hashing, JWT token issue & validation,
role-based authorization (ADMIN, ANALYST, USER), and security dependencies.
"""

import os
import secrets
import hashlib
import datetime
from typing import Optional, Dict, Any, List
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, Field
import jwt

SECRET_KEY = os.getenv("JWT_SECRET_KEY", "doppelguard_production_sec_jwt_secret_key_2026_x89f")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 24 hours

security = HTTPBearer(auto_error=False)

# Roles
class Role:
    ADMIN = "ADMIN"
    ANALYST = "ANALYST"
    USER = "USER"
    GUEST = "GUEST"

# Pydantic Auth Models
class UserCreate(BaseModel):
    email: str
    username: str
    password: str
    role: Optional[str] = Role.ANALYST

class UserLogin(BaseModel):
    username_or_email: str
    password: str

class UserResponse(BaseModel):
    id: str
    username: str
    email: str
    role: str
    created_at: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int
    user: UserResponse

# Hash Password with PBKDF2
def hash_password(password: str) -> str:
    salt = secrets.token_hex(16)
    key = hashlib.pbkdf2_hmac(
        'sha256',
        password.encode('utf-8'),
        salt.encode('utf-8'),
        100000
    )
    return f"{salt}${key.hex()}"

def verify_password(stored_password_hash: str, provided_password: str) -> bool:
    try:
        salt, key_hex = stored_password_hash.split("$")
        key = hashlib.pbkdf2_hmac(
            'sha256',
            provided_password.encode('utf-8'),
            salt.encode('utf-8'),
            100000
        )
        return secrets.compare_digest(key.hex(), key_hex)
    except Exception:
        return False

# In-memory User DB with pre-seeded enterprise accounts
_USERS_DB: Dict[str, Dict[str, Any]] = {
    "admin": {
        "id": "usr-admin-101",
        "username": "admin",
        "email": "admin@doppelguard.sec",
        "password_hash": hash_password("AdminPass123!"),
        "role": Role.ADMIN,
        "created_at": datetime.datetime.utcnow().isoformat()
    },
    "analyst": {
        "id": "usr-analyst-102",
        "username": "analyst",
        "email": "analyst@doppelguard.sec",
        "password_hash": hash_password("AnalystPass123!"),
        "role": Role.ANALYST,
        "created_at": datetime.datetime.utcnow().isoformat()
    },
    "demo_user": {
        "id": "usr-user-103",
        "username": "demo_user",
        "email": "demo@doppelguard.sec",
        "password_hash": hash_password("UserPass123!"),
        "role": Role.USER,
        "created_at": datetime.datetime.utcnow().isoformat()
    }
}

def create_access_token(data: dict, expires_delta: Optional[datetime.timedelta] = None) -> str:
    to_encode = data.copy()
    now = datetime.datetime.utcnow()
    expire = now + (expires_delta or datetime.timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"iat": now, "exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def decode_access_token(token: str) -> Optional[dict]:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except Exception:
        return None

def get_user_by_username_or_email(identifier: str) -> Optional[dict]:
    clean = identifier.lower().strip()
    for user in _USERS_DB.values():
        if user["username"].lower() == clean or user["email"].lower() == clean:
            return user
    return None

def register_user(user_in: UserCreate) -> UserResponse:
    if get_user_by_username_or_email(user_in.username):
        raise HTTPException(status_code=400, detail="Username already registered.")
    if get_user_by_username_or_email(user_in.email):
        raise HTTPException(status_code=400, detail="Email address already registered.")

    user_id = f"usr-{secrets.token_hex(4)}"
    new_user = {
        "id": user_id,
        "username": user_in.username.strip(),
        "email": user_in.email.strip(),
        "password_hash": hash_password(user_in.password),
        "role": user_in.role.upper() if user_in.role and user_in.role.upper() in [Role.ADMIN, Role.ANALYST, Role.USER] else Role.USER,
        "created_at": datetime.datetime.utcnow().isoformat()
    }
    _USERS_DB[user_in.username.lower()] = new_user

    return UserResponse(
        id=new_user["id"],
        username=new_user["username"],
        email=new_user["email"],
        role=new_user["role"],
        created_at=new_user["created_at"]
    )

def authenticate_user(login_in: UserLogin) -> TokenResponse:
    user = get_user_by_username_or_email(login_in.username_or_email)
    if not user or not verify_password(user["password_hash"], login_in.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username/email or password.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user_resp = UserResponse(
        id=user["id"],
        username=user["username"],
        email=user["email"],
        role=user["role"],
        created_at=user["created_at"]
    )

    token = create_access_token({"sub": user["id"], "username": user["username"], "role": user["role"]})
    return TokenResponse(
        access_token=token,
        expires_in=ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        user=user_resp
    )

# Auth Security Dependencies
def get_current_user_optional(credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)) -> Optional[dict]:
    if not credentials:
        return None
    payload = decode_access_token(credentials.credentials)
    if not payload:
        return None
    user_id = payload.get("sub")
    for user in _USERS_DB.values():
        if user["id"] == user_id:
            return user
    return None

def get_current_user_required(credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)) -> dict:
    if not credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication token required. Please log in.",
            headers={"WWW-Authenticate": "Bearer"}
        )
    user = get_current_user_optional(credentials)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired authentication token.",
            headers={"WWW-Authenticate": "Bearer"}
        )
    return user

def require_roles(allowed_roles: List[str]):
    def role_checker(current_user: dict = Depends(get_current_user_required)):
        if current_user["role"] not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access denied: Requires one of roles {allowed_roles}. Current role: {current_user['role']}"
            )
        return current_user
    return role_checker
