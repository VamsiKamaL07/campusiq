from tests.conftest import auth


def test_missing_token_rejected(client, seed):
    assert client.get("/api/v1/auth/me").status_code == 401


def test_unknown_email_rejected(client, seed):
    assert client.get("/api/v1/auth/me", headers=auth("stranger@test.edu")).status_code == 403


def test_student_self_registration_links_verified_record(client, seed):
    r = client.get("/api/v1/auth/me", headers=auth("s1@test.edu"))
    assert r.status_code == 200 and r.json()["role"] == "student"


def test_student_cannot_reach_faculty_dashboard(client, seed):
    assert client.get("/api/v1/dashboard/faculty", headers=auth("s1@test.edu")).status_code == 403


def test_faculty_sees_only_own_department_students(client, seed):
    r = client.get("/api/v1/dashboard/faculty", headers=auth("fac@test.edu"))
    assert r.status_code == 200
    assert r.json()["total_students"] == 1  # the CSE student is not counted


def test_faculty_cannot_provision_faculty(client, seed):
    body = {"email": "x@test.edu", "full_name": "X", "department_ids": [str(seed["ds"].id)]}
    assert client.post("/api/v1/admin/faculty", json=body, headers=auth("fac@test.edu")).status_code == 403


def test_admin_provisions_faculty_and_rejects_foreign_department(client, seed):
    body = {"email": "new@test.edu", "full_name": "New", "department_ids": [str(seed["cs"].id)]}
    assert client.post("/api/v1/admin/faculty", json=body, headers=auth("admin@test.edu")).status_code == 201
    bad = {**body, "email": "n2@test.edu", "department_ids": ["00000000-0000-0000-0000-000000000000"]}
    assert client.post("/api/v1/admin/faculty", json=bad, headers=auth("admin@test.edu")).status_code == 422


def test_dev_auth_refused_in_production(monkeypatch):
    import pytest
    from app.core.config import Settings
    with pytest.raises(RuntimeError):
        Settings(environment="production", auth_mode="dev").validate_for_runtime()
