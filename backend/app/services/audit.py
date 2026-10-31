from sqlalchemy.orm import Session

from app.models import AuditLog


def record(db: Session, *, institution_id, actor_user_id, action: str,
           entity_type: str | None = None, entity_id=None, meta: dict | None = None) -> None:
    db.add(AuditLog(
        institution_id=institution_id, actor_user_id=actor_user_id, action=action,
        entity_type=entity_type, entity_id=str(entity_id) if entity_id else None, meta=meta or {},
    ))
