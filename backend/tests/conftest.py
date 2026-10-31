import os

os.environ["DATABASE_URL"] = "sqlite://"
os.environ["AUTH_MODE"] = "dev"
os.environ["ENVIRONMENT"] = "development"

import pytest
from fastapi.testclient import TestClient
from sqlalchemy.pool import StaticPool
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.core import db as dbmod
from app.core.db import Base, get_db
from app.main import app
from app.models import Department, FacultyPermission, Institution, Role, Student, User


@pytest.fixture()
def db():
    engine = create_engine("sqlite://", connect_args={"check_same_thread": False}, poolclass=StaticPool)
    Base.metadata.create_all(engine)
    Session = sessionmaker(bind=engine, autoflush=False, expire_on_commit=False)
    with Session() as s:
        yield s


@pytest.fixture()
def client(db):
    app.dependency_overrides[get_db] = lambda: db
    yield TestClient(app)
    app.dependency_overrides.clear()


@pytest.fixture()
def seed(db):
    """Fictional data only."""
    inst = Institution(name="Test College", student_email_domains=["test.edu"])
    db.add(inst); db.flush()
    ds = Department(institution_id=inst.id, name="AI & DS", code="AIDS")
    cs = Department(institution_id=inst.id, name="CSE", code="CSE")
    db.add_all([ds, cs]); db.flush()
    admin = User(institution_id=inst.id, email="admin@test.edu", full_name="Admin", role=Role.SUPER_ADMIN)
    fac = User(institution_id=inst.id, email="fac@test.edu", full_name="Fac", role=Role.FACULTY)
    db.add_all([admin, fac]); db.flush()
    db.add(FacultyPermission(user_id=fac.id, department_id=ds.id))
    db.add_all([
        Student(institution_id=inst.id, department_id=ds.id, student_code="S1", full_name="Stu One", email="s1@test.edu", academic_year=3, cgpa=8.0),
        Student(institution_id=inst.id, department_id=cs.id, student_code="S2", full_name="Stu Two", email="s2@test.edu", academic_year=3, cgpa=8.0),
    ])
    db.commit()
    return {"inst": inst, "ds": ds, "cs": cs}


def auth(email: str) -> dict:
    return {"Authorization": f"Bearer dev:{email}"}
