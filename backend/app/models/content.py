import uuid
from datetime import datetime

from sqlalchemy import BigInteger, DateTime, Float, ForeignKey, JSON, String, Text, UniqueConstraint, Uuid, Integer, Boolean
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base, IdMixin, TimestampMixin


class Circular(Base, IdMixin, TimestampMixin):
    __tablename__ = "circulars"
    institution_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("institutions.id", ondelete="CASCADE"), index=True)
    department_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("departments.id", ondelete="CASCADE"), index=True)
    uploaded_by: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id", ondelete="RESTRICT"))
    storage_key: Mapped[str] = mapped_column(String(512), nullable=False)  # private storage path, never public
    original_filename: Mapped[str] = mapped_column(String(255), nullable=False)
    mime_type: Mapped[str] = mapped_column(String(100), nullable=False)
    size_bytes: Mapped[int] = mapped_column(BigInteger, nullable=False)
    sha256: Mapped[str] = mapped_column(String(64), nullable=False, index=True)
    status: Mapped[str] = mapped_column(String(20), default="uploaded", nullable=False)  # uploaded|scanned|extracted|failed


class CircularExtraction(Base, IdMixin, TimestampMixin):
    """raw_output = untouched AI output; approved_output = faculty-approved version (kept separately)."""
    __tablename__ = "circular_extractions"
    circular_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("circulars.id", ondelete="CASCADE"), index=True)
    model_name: Mapped[str | None] = mapped_column(String(100))
    raw_output: Mapped[dict | None] = mapped_column(JSON)
    approved_output: Mapped[dict | None] = mapped_column(JSON)
    status: Mapped[str] = mapped_column(String(20), default="pending", nullable=False)  # pending|needs_review|approved|rejected
    approved_by: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("users.id", ondelete="SET NULL"))
    approved_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))


class Announcement(Base, IdMixin, TimestampMixin):
    __tablename__ = "announcements"
    institution_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("institutions.id", ondelete="CASCADE"), index=True)
    department_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("departments.id", ondelete="CASCADE"), index=True)
    circular_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("circulars.id", ondelete="SET NULL"))
    created_by: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id", ondelete="RESTRICT"))
    title: Mapped[str] = mapped_column(String(300), nullable=False)
    category: Mapped[str | None] = mapped_column(String(64))
    description: Mapped[str | None] = mapped_column(Text)
    priority: Mapped[str] = mapped_column(String(16), default="low", nullable=False)  # low|medium|high|critical
    status: Mapped[str] = mapped_column(String(20), default="draft", nullable=False)  # draft|published|archived


class EligibilityRule(Base, IdMixin, TimestampMixin):
    __tablename__ = "eligibility_rules"
    announcement_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("announcements.id", ondelete="CASCADE"), index=True)
    conditions: Mapped[dict] = mapped_column(JSON, nullable=False)  # e.g. {"year": 3, "cgpa": {"op": ">", "value": 7.5}}
    status: Mapped[str] = mapped_column(String(20), default="proposed", nullable=False)  # proposed|approved
    approved_by: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("users.id", ondelete="SET NULL"))
    approved_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))


class Event(Base, IdMixin, TimestampMixin):
    __tablename__ = "events"
    announcement_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("announcements.id", ondelete="CASCADE"), unique=True
    )
    venue: Mapped[str | None] = mapped_column(String(255))
    starts_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    registration_deadline: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    capacity: Mapped[int | None] = mapped_column(Integer)
    external_registration_url: Mapped[str | None] = mapped_column(String(1000))


class Registration(Base, IdMixin, TimestampMixin):
    __tablename__ = "registrations"
    __table_args__ = (UniqueConstraint("event_id", "student_id", name="uq_registration_event_student"),)
    event_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("events.id", ondelete="CASCADE"), index=True)
    student_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("students.id", ondelete="CASCADE"), index=True)
    status: Mapped[str] = mapped_column(String(20), default="registered", nullable=False)  # registered|cancelled
    cancelled_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
