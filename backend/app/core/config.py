from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    environment: str = "development"
    database_url: str = "sqlite:///./dev.db"
    cors_origins: str = "http://localhost:5173"
    auth_mode: str = "dev"  # "dev" | "firebase"
    firebase_project_id: str = ""
    bootstrap_admin_email: str = ""

    @property
    def cors_origin_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]

    def validate_for_runtime(self) -> None:
        if self.environment == "production" and self.auth_mode != "firebase":
            raise RuntimeError("AUTH_MODE=dev is forbidden when ENVIRONMENT=production")


@lru_cache
def get_settings() -> Settings:
    return Settings()
