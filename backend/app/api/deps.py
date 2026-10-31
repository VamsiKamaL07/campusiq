import uuid

from fastapi import Depends, Header, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.db import get_db
from app.core.security import verify_token
from app.models import FacultyPermission, Role, User
from app.services.auth_service import resolve_user


def get_current_user(authorization: str | None = Header(default=None), db: Session = Depends(get_db)) -> User:
    if not authorization or not authorization.lower().startswith("bearer "):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Missing bearer token")
    return resolve_user(db, verify_token(authorization[7:].strip()))


def require_roles(*roles: Role):
    def checker(user: User = Depends(get_current_user)) -> User:
        if user.role not in roles:
            raise HTTPException(status.HTTP_403_FORBIDDEN, "Insufficient permissions")
        return user
    return checker


def faculty_department_ids(db: Session, user: User) -> set[uuid.UUID]:
    """Department isolation: every faculty query must be constrained to this set."""
    rows = db.scalars(select(FacultyPermission.department_id).where(FacultyPermission.user_id == user.id))
    return set(rows)


def assert_department_access(db: Session, user: User, department_id: uuid.UUID) -> None:
    if user.role == Role.SUPER_ADMIN:
        return
    if department_id not in faculty_department_ids(db, user):
        raise HTTPException(status.HTTP_403_FORBIDDEN, "No access to this department")
