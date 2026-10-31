# Milestone 1 - Project foundation

## Written (NOT yet executed - the build sandbox had no network, so dependencies could not be installed)
- Monorepo layout, `.env.example`, `.gitignore`
- SQLAlchemy models for all 21 required entities (constraints, indexes, FKs, timestamps)
- Alembic configured (`env.py`); initial migration must be generated with `--autogenerate` against your DB
- Firebase token verification + dev adapter (refused in production), DB-backed authorization
- RBAC dependencies, department isolation helper, audit log helper
- Endpoints: `GET /auth/me`, `POST /admin/faculty`, `GET /dashboard/{faculty,student,admin}`, `GET /healthz`
- Bootstrap script for first institution/admin
- 8 pytest tests (auth, RBAC, department isolation, dev-auth production guard)
- Frontend: landing page, login, protected routes, role layouts, dashboards wired to the API

## Verified
- Python syntax compiles (`compileall`). Nothing else.

## Not verified / unresolved
- pytest, alembic, uvicorn, the frontend build and Firebase auth have not been run.
- Sidebar pages other than dashboards are labelled placeholders for later milestones.
- Rate limiting, file upload, Celery/Redis not started (later milestones).

## Next: Milestone 2 - student management (profiles, CSV/Excel import with preview, verification)
