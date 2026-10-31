"""Identity verification. Returns verified identity claims only; authorization is always DB-backed."""
from dataclasses import dataclass

from fastapi import HTTPException, status

from app.core.config import get_settings


@dataclass(frozen=True)
class Identity:
    uid: str
    email: str
    email_verified: bool
    name: str | None = None


def _unauthorized(detail: str = "Invalid or missing credentials") -> HTTPException:
    return HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=detail)


def verify_token(token: str) -> Identity:
    settings = get_settings()
    settings.validate_for_runtime()
    if settings.auth_mode == "dev":
        # DEVELOPMENT ONLY adapter: token looks like "dev:alice@college.edu". Refused in production.
        if not token.startswith("dev:") or "@" not in token:
            raise _unauthorized()
        email = token[4:].strip().lower()
        return Identity(uid=f"dev-{email}", email=email, email_verified=True, name=email.split("@")[0])

    try:
        import firebase_admin
        from firebase_admin import auth as fb_auth

        if not firebase_admin._apps:
            firebase_admin.initialize_app(options={"projectId": settings.firebase_project_id} or None)
        decoded = fb_auth.verify_id_token(token, check_revoked=True)
    except Exception:  # noqa: BLE001 - never leak verifier internals to clients
        raise _unauthorized() from None
    email = (decoded.get("email") or "").lower()
    if not email:
        raise _unauthorized("Token has no email")
    return Identity(
        uid=decoded["uid"], email=email,
        email_verified=bool(decoded.get("email_verified")), name=decoded.get("name"),
    )
