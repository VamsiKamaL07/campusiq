import uuid
from datetime import datetime

from sqlalchemy import Boolean, DateTime, Float, ForeignKey, Index, Integer, JSON, String, UniqueConstraint
from sqlalchemy import Enum as SAEnum
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base, IdMixin, TimestampMixin, Channel, utcnow


class Campaign(Base, IdMixin, TimestampMixin):
    __tablename__ = "campaigns"
    institution_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("institutions.id", ondelete="CASCADE"), index=True)
    announcement_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("announcements.id", ondelete="CASCADE"), index=True)
    status: Mapped[str] = mapped_column(String(20), default="draft", nullable=False)  # draft|approved|sending|completed|cancelled
    channels: Mapped[list] = mapped_column(JSON, default=list, nullable=False)
    estimated_cost: Mapped[float | None] = mapped_column(Float)
    approved_by: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("users.id", ondelete="SET NULL"))
    approved_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    rule_snapshot: Mapped[dict | None] = mapped_column(JSON)  # rule + counts frozen at approval, for audit
    idempotency_key: Mapped[str] = mapped_column(String(128), unique=True, nullable=False)


class CampaignRecipient(Base, IdMixin, TimestampMixin):
    __tablename__ = "campaign_recipients"
    __table_args__ = (UniqueConstraint("campaign_id", "student_id", name="uq_campaign_student"),)
    campaign_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("campaigns.id", ondelete="CASCADE"), index=True)
    student_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("students.id", ondelete="CASCADE"), index=True)
    eligibility_status: Mapped[str] = mapped_column(String(20), nullable=False)  # eligible|ineligible|manual_review
    snapshot: Mapped[dict | None] = mapped_column(JSON)


class Notification(Base, IdMixin, TimestampMixin):
    __tablename__ = "notifications"
    __table_args__ = (
        UniqueConstraint("campaign_id", "student_id", name="uq_notification_campaign_student"),
        Index("ix_notifications_student_status", "student_id", "status"),
    )
    institution_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("institutions.id", ondelete="CASCADE"), index=True)
    student_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("students.id", ondelete="CASCADE"))
    announcement_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("announcements.id", ondelete="CASCADE"))
    campaign_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("campaigns.id", ondelete="CASCADE"))
    status: Mapped[str] = mapped_column(String(16), default="unread", nullable=False)  # unread|read|acknowledged|archived
    read_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    acknowledged_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))


class NotificationDelivery(Base, IdMixin, TimestampMixin):
    """One row per channel attempt chain. 'accepted' != 'delivered'; delivered_at is set only from provider evidence."""
    __tablename__ = "notification_deliveries"
    notification_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("notifications.id", ondelete="CASCADE"), index=True)
    channel: Mapped[Channel] = mapped_column(SAEnum(Channel, native_enum=False, length=20), nullable=False)
    status: Mapped[str] = mapped_column(String(20), default="queued", nullable=False)  # queued|accepted|delivered|failed|retrying
    provider_message_id: Mapped[str | None] = mapped_column(String(255), index=True)
    idempotency_key: Mapped[str] = mapped_column(String(128), unique=True, nullable=False)
    attempts: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    error_code: Mapped[str | None] = mapped_column(String(64))
    accepted_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    delivered_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    cost: Mapped[float | None] = mapped_column(Float)


class DeviceToken(Base, IdMixin, TimestampMixin):
    __tablename__ = "device_tokens"
    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    token: Mapped[str] = mapped_column(String(512), unique=True, nullable=False)
    platform: Mapped[str] = mapped_column(String(20), default="web", nullable=False)
    last_seen_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    revoked_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))


class NotificationPreference(Base, IdMixin, TimestampMixin):
    __tablename__ = "notification_preferences"
    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), unique=True)
    in_app: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    push: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    email: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    whatsapp: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)  # opt-in only


class CommunicationConsent(Base, IdMixin, TimestampMixin):
    __tablename__ = "communication_consents"
    __table_args__ = (UniqueConstraint("user_id", "channel", name="uq_consent_user_channel"),)
    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    channel: Mapped[Channel] = mapped_column(SAEnum(Channel, native_enum=False, length=20), nullable=False)
    status: Mapped[str] = mapped_column(String(16), default="withdrawn", nullable=False)  # granted|withdrawn
    granted_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    withdrawn_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    source: Mapped[str | None] = mapped_column(String(64))


class ScheduledReminder(Base, IdMixin, TimestampMixin):
    __tablename__ = "scheduled_reminders"
    campaign_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("campaigns.id", ondelete="CASCADE"), index=True)
    run_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, index=True)
    kind: Mapped[str] = mapped_column(String(32), nullable=False)  # initial|reminder|final
    status: Mapped[str] = mapped_column(String(16), default="scheduled", nullable=False)  # scheduled|paused|cancelled|done


class AuditLog(Base, IdMixin):
    __tablename__ = "audit_logs"
    __table_args__ = (Index("ix_audit_inst_created", "institution_id", "created_at"),)
    institution_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("institutions.id", ondelete="SET NULL"))
    actor_user_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("users.id", ondelete="SET NULL"))
    action: Mapped[str] = mapped_column(String(100), nullable=False)
    entity_type: Mapped[str | None] = mapped_column(String(64))
    entity_id: Mapped[str | None] = mapped_column(String(64))
    meta: Mapped[dict | None] = mapped_column(JSON)  # never store tokens or unnecessary PII
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow, nullable=False)


class ProviderConfiguration(Base, IdMixin, TimestampMixin):
    """Non-secret provider settings only. API keys live in environment variables."""
    __tablename__ = "provider_configurations"
    __table_args__ = (UniqueConstraint("institution_id", "provider", name="uq_provider_inst"),)
    institution_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("institutions.id", ondelete="CASCADE"), index=True)
    provider: Mapped[str] = mapped_column(String(32), nullable=False)  # fcm|resend|whatsapp
    enabled: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    unit_cost: Mapped[float | None] = mapped_column(Float)  # configurable, never assumed accurate
    monthly_budget: Mapped[float | None] = mapped_column(Float)
    settings: Mapped[dict | None] = mapped_column(JSON)
