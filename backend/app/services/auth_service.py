"""Resolves a verified identity to a database user. Roles are NEVER taken from the client."""
from fastapi import HTTPException, status
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.core.security import Identity
from app.models import Institution, Role, Student, User
from app.models.base import utcnow
from app.services import audit


def _forbidden(detail: str) -> HTTPException:
    return HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=detail)


def resolve_user(db: Session, ident: Identity) -> User:
    if not ident.email_verified:
        raise _forbidden("Email address is not verified")

    # 1) Known firebase uid.
    user = db.scalar(select(User).where(User.firebase_uid == ident.uid))
    # 2) Pre-provisioned account (admin-created faculty/admin, or imported student) claimed on first login.
    if user is None:
        candidates = db.scalars(select(User).where(func.lower(User.email) == ident.email)).all()
        if len(candidates) == 1:
            user = candidates[0]
            if user.firebase_uid and user.firebase_uid != ident.uid:
                raise _forbidden("Account is linked to a different identity")
            user.firebase_uid = ident.uid
    # 3) Student self-registration: only if an institutional record with this email exists and is unclaimed.
    if user is None:
        student = db.scalar(select(Student).where(func.lower(Student.email) == ident.email, Student.user_id.is_(None)))
        if student is None:
            raise _forbidden("No institutional record matches this account. Contact your administrator.")
        institution = db.get(Institution, student.institution_id)
        domain = ident.email.rsplit("@", 1)[-1]
        allowed = [d.lower() for d in (institution.student_email_domains or [])]
        if allowed and domain not in allowed:
            raise _forbidden("Email domain is not allowed for student registration")
        user = User(institution_id=student.institution_id, firebase_uid=ident.uid, email=ident.email,
                    full_name=student.full_name, role=Role.STUDENT)
        db.add(user)
        db.flush()
        student.user_id = user.id
        audit.record(db, institution_id=user.institution_id, actor_user_id=user.id,
                     action="student.account_linked", entity_type="student", entity_id=student.id)

    if not user.is_active:
        raise _forbidden("Account is disabled")
    user.last_login_at = utcnow()
    db.commit()
    return user
