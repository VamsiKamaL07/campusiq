from fastapi import APIRouter, Depends
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.api.deps import faculty_department_ids, require_roles
from app.core.db import get_db
from app.models import Announcement, Campaign, Department, Notification, Role, Student, User

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("/faculty")
def faculty_dashboard(user: User = Depends(require_roles(Role.FACULTY)), db: Session = Depends(get_db)):
    dept_ids = faculty_department_ids(db, user)
    if not dept_ids:
        return {"departments": [], "total_students": 0, "active_announcements": 0, "pending_approvals": 0,
                "scheduled_notifications": 0}
    students = db.scalar(select(func.count()).select_from(Student).where(Student.department_id.in_(dept_ids))) or 0
    active = db.scalar(select(func.count()).select_from(Announcement).where(
        Announcement.department_id.in_(dept_ids), Announcement.status == "published")) or 0
    pending = db.scalar(select(func.count()).select_from(Announcement).where(
        Announcement.department_id.in_(dept_ids), Announcement.status == "draft")) or 0
    names = db.scalars(select(Department.name).where(Department.id.in_(dept_ids))).all()
    return {"departments": list(names), "total_students": students, "active_announcements": active,
            "pending_approvals": pending, "scheduled_notifications": 0}


@router.get("/student")
def student_dashboard(user: User = Depends(require_roles(Role.STUDENT)), db: Session = Depends(get_db)):
    student = db.scalar(select(Student).where(Student.user_id == user.id))
    if student is None:
        return {"unread": 0, "total": 0}
    base = select(func.count()).select_from(Notification).where(Notification.student_id == student.id)
    return {"total": db.scalar(base) or 0, "unread": db.scalar(base.where(Notification.status == "unread")) or 0}


@router.get("/admin")
def admin_dashboard(user: User = Depends(require_roles(Role.SUPER_ADMIN)), db: Session = Depends(get_db)):
    inst = user.institution_id
    count = lambda m: db.scalar(select(func.count()).select_from(m).where(m.institution_id == inst)) or 0  # noqa: E731
    return {"departments": count(Department), "students": count(Student), "users": count(User),
            "campaigns": count(Campaign)}
