from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.deps import require_roles
from app.core.db import get_db
from app.models import Department, FacultyPermission, Role, User
from app.schemas.auth import FacultyCreate, UserOut
from app.services import audit

router = APIRouter(prefix="/admin", tags=["admin"])


@router.post("/faculty", response_model=UserOut, status_code=201)
def provision_faculty(body: FacultyCreate, admin: User = Depends(require_roles(Role.SUPER_ADMIN)),
                      db: Session = Depends(get_db)):
    """The only way faculty accounts come into existence. Account is claimed on the person's first verified login."""
    email = body.email.lower()
    if db.scalar(select(User).where(User.institution_id == admin.institution_id, User.email == email)):
        raise HTTPException(status.HTTP_409_CONFLICT, "User already exists")
    depts = db.scalars(select(Department).where(Department.id.in_(body.department_ids),
                                                Department.institution_id == admin.institution_id)).all()
    if len(depts) != len(set(body.department_ids)):
        raise HTTPException(status.HTTP_422_UNPROCESSABLE_ENTITY, "Unknown department for this institution")
    user = User(institution_id=admin.institution_id, email=email, full_name=body.full_name, role=Role.FACULTY)
    db.add(user)
    db.flush()
    for d in depts:
        db.add(FacultyPermission(user_id=user.id, department_id=d.id, can_approve=body.can_approve))
    audit.record(db, institution_id=admin.institution_id, actor_user_id=admin.id, action="faculty.provisioned",
                 entity_type="user", entity_id=user.id, meta={"departments": [str(d.id) for d in depts]})
    db.commit()
    return user
