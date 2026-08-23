"""
Authentication API Endpoints.
"""

from fastapi import APIRouter, Depends
from auth import (
    UserCreate,
    UserLogin,
    UserResponse,
    TokenResponse,
    register_user,
    authenticate_user,
    get_current_user_required
)

router = APIRouter(prefix="/auth", tags=["Authentication & Access Control"])

@router.post("/register", response_model=UserResponse)
def register(payload: UserCreate):
    """Registers a new user account with role assignment."""
    return register_user(payload)

@router.post("/login", response_model=TokenResponse)
def login(payload: UserLogin):
    """Authenticates user and returns JWT bearer token."""
    return authenticate_user(payload)

@router.get("/me", response_model=UserResponse)
def get_me(current_user: dict = Depends(get_current_user_required)):
    """Returns profile metadata of currently authenticated user."""
    return UserResponse(
        id=current_user["id"],
        username=current_user["username"],
        email=current_user["email"],
        role=current_user["role"],
        created_at=current_user["created_at"]
    )
