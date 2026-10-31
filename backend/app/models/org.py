import uuid
from datetime import datetime

from sqlalchemy import Boolean, DateTime, Float, ForeignKey, Integer, JSON, String, UniqueConstraint, Index, Uuid
from sqlalchemy import Enum as SAEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, IdMixin, TimestampMixin, Role


class Institution(Base, IdMixin, TimestampMixin):
    __tablename__ = "institutions"
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    # Email domains whose holders may self-register as students (e.g. ["college.edu"]).
    student_email_domains: Mapped[list] = mapped_column(JSON, default=list, nullable=False)
    retention_days: Mapped[int] = mapped_column(Integer, default=365, nullable=False)


class Department(Base, IdMixin, TimestampMixin):
    __tablename__ = "departments"
    __table_args__ = (UniqueConstraint("institution_id", "code", name="uq_department_code"),)
    institution_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("institutions.id", ondelete="CASCADE"), index=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    code: Mapped[str] = mapped_column(String(32), nullable=False)


class User(Base, IdMixin, TimestampMixin):
    __tablename__ = "users"
    __table_args__ = (
        UniqueConstraint("institution_id", "email", name="uq_user_inst_email"),
        Index("ix_users_firebase_uid", "firebase_uid", unique=True),
    )
    institution_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("institutions.id", ondelete="CASCADE"), index=True)
    firebase_uid: Mapped[str | None] = mapped_column(String(128), nullable=True)
    email: Mapped[str] = mapped_column(String(320), nullable=False)
    full_name: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[Role] = mapped_column(SAEnum(Role, native_enum=False, length=20), nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    last_login_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))


class Student(Base, IdMixin, TimestampMixin):
    """Verified institutional record. Academic fields are written only by import/admin flows."""
    __tablename__ = "students"
    __table_args__ = (
        UniqueConstraint("institution_id", "student_code", name="uq_student_inst_code"),
        UniqueConstraint("institution_id", "email", name="uq_student_inst_email"),
        Index("ix_students_dept_year", "department_id", "academic_year"),
    )
    institution_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("institutions.id", ondelete="CASCADE"), index=True)
    department_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("departments.id", ondelete="RESTRICT"))
    user_id: Mapped[uuid.UUID | None] = mapped_column(
        ForeignKey("users.id", ondelete="SET NULL"), unique=True, nullable=True
    )
    student_code: Mapped[str] = mapped_column(String(64), nullable=False)
    full_name: Mapped[str] = mapped_column(String(255), nullable=False)
    email: Mapped[str] = mapped_column(String(320), nullable=False)
    phone: Mapped[str | None] = mapped_column(String(32))
    academic_year: Mapped[int | None] = mapped_column(Integer)
    section: Mapped[str | None] = mapped_column(String(16))
    cgpa: Mapped[float | None] = mapped_column(Float)
    skills: Mapped[list] = mapped_column(JSON, default=list, nullable=False)
    placement_eligible: Mapped[bool | None] = mapped_column(Boolean)
    enrollment_status: Mapped[str] = mapped_column(String(20), default="active", nullable=False)
    # NULL means the academic data was never verified -> eligibility engine routes to "manual review".
    record_verified_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))


class FacultyPermission(Base, IdMixin, TimestampMixin):
    __tablename__ = "faculty_permissions"
    __table_args__ = (UniqueConstraint("user_id", "department_id", name="uq_faculty_dept"),)
    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    department_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("departments.id", ondelete="CASCADE"), index=True)
    can_upload: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    can_approve: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    can_view_students: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
