"""One-time bootstrap: creates the first institution, department and super admin (claimed on first login).
Usage: BOOTSTRAP_ADMIN_EMAIL=you@college.edu python -m app.scripts.bootstrap "Institution" "college.edu" "AI & DS" "AIDS"
"""
import sys

from sqlalchemy import select

from app.core.config import get_settings
from app.core.db import SessionLocal
from app.models import Department, Institution, Role, User


def main() -> None:
    if len(sys.argv) != 5:
        sys.exit(__doc__)
    inst_name, domain, dept_name, dept_code = sys.argv[1:]
    email = get_settings().bootstrap_admin_email.lower()
    if not email:
        sys.exit("Set BOOTSTRAP_ADMIN_EMAIL")
    with SessionLocal() as db:
        if db.scalar(select(User).where(User.role == Role.SUPER_ADMIN)):
            sys.exit("A super admin already exists; refusing to bootstrap again.")
        inst = Institution(name=inst_name, student_email_domains=[domain.lower()])
        db.add(inst)
        db.flush()
        db.add(Department(institution_id=inst.id, name=dept_name, code=dept_code))
        db.add(User(institution_id=inst.id, email=email, full_name="Administrator", role=Role.SUPER_ADMIN))
        db.commit()
        print("Bootstrapped. Sign in with that email to claim the admin account.")


if __name__ == "__main__":
    main()
