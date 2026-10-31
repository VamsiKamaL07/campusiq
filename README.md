# CampusIQ

AI-powered college communication platform. **Status: Milestone 1 (foundation) written, not yet run.**
See `docs/MILESTONES.md` for what is and is not done.

## Run locally (development)
Prerequisites: Python 3.11+, Node 20+, PostgreSQL 15+ (SQLite works for quick tests).

```bash
cp .env.example .env            # edit DATABASE_URL; keep AUTH_MODE=dev for local work

# Backend
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
alembic revision --autogenerate -m "initial schema"   # generates the first migration from app/models
alembic upgrade head
BOOTSTRAP_ADMIN_EMAIL=you@college.edu python -m app.scripts.bootstrap "My College" "college.edu" "AI & DS" "AIDS"
uvicorn app.main:app --reload                          # http://localhost:8000/docs
pytest

# Frontend (new terminal)
cd frontend && npm install && npm run dev              # http://localhost:5173
```
Log in with the bootstrap email (dev mode accepts any provisioned email, no password).

## Auth model
- Firebase proves *who you are*; the database decides *what you can do*. Roles are never read from the client.
- Faculty/admin accounts exist only if a super admin provisions them (`POST /api/v1/admin/faculty`).
- Students are linked only if their verified email matches an imported institutional record.
- `AUTH_MODE=dev` is a labelled development adapter; the backend refuses to start with it in production.

## Going to real Firebase
Create a Firebase project, enable Google sign-in, set `AUTH_MODE=firebase`, `FIREBASE_PROJECT_ID`, a service-account JSON via `GOOGLE_APPLICATION_CREDENTIALS`, and the `VITE_FIREBASE_*` values. This path is **untested**.
