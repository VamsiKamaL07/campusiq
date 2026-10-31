import uuid
from pydantic import BaseModel, ConfigDict, EmailStr

from app.models import Role


class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: uuid.UUID
    email: str
    full_name: str
    role: Role
    institution_id: uuid.UUID


class FacultyCreate(BaseModel):
    email: EmailStr
    full_name: str
    department_ids: list[uuid.UUID]
    can_approve: bool = False
