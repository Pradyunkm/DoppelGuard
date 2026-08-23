"""
Database Abstraction & ORM Engine Layer for DoppelGuard.

Supports seamless switching between SQLite (local development / prototyping)
and PostgreSQL (production enterprise scaling) via DATABASE_URL.
Configures connection pooling and pre-ping health checks.
"""

import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./doppelguard.db")

# Configure database engine options based on dialect
if DATABASE_URL.startswith("sqlite"):
    engine_kwargs = {
        "connect_args": {"check_same_thread": False},
        "echo": False
    }
else:
    # Production RDBMS (PostgreSQL / MySQL) connection pool configuration
    engine_kwargs = {
        "pool_size": int(os.getenv("DB_POOL_SIZE", "10")),
        "max_overflow": int(os.getenv("DB_MAX_OVERFLOW", "20")),
        "pool_timeout": 30,
        "pool_pre_ping": True,
        "echo": False
    }

engine = create_engine(DATABASE_URL, **engine_kwargs)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    """FastAPI Dependency for database session management."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def init_db():
    """Initializes the database tables."""
    Base.metadata.create_all(bind=engine)
