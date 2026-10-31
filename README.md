# CampusIQ — AI-Powered College Communication & Circular Intelligence Platform

> Modern, multi-role campus intelligence platform for intelligent circular generation, student targeting, multi-channel dispatch, and automated academic workflows.

---

## 🚀 Live Demo & Deployment

- **Live Demo (Vercel)**: [https://fleet-oasis-nezu3rc.tmp.now](https://fleet-oasis-nezu3rc.tmp.now)
- **Claim Deployment to Your Vercel Account**: [Claim on Vercel](https://vercel.com/claim-deployment?code=2a2ae967-4324-4104-abc4-6c1981e7974c)
- **GitHub Repository**: [https://github.com/VamsiKamaL07/campusiq](https://github.com/VamsiKamaL07/campusiq)

---

## ⚡ Quick Demo Logins

The application includes interactive demo profiles pre-configured with realistic campus data:

| Role | Email | Password | What You Can Access |
|---|---|---|---|
| **Faculty** | `faculty@demo.edu` | *(any)* | AI Circular Studio, Targeting Engine, Campaign Builder, Analytics, Registrations |
| **Student** | `student@demo.edu` | *(any)* | Notification Center, Announcements, Events Feed, Event Registrations |
| **Super Admin** | `admin@demo.edu` | *(any)* | Faculty Directory, Student Imports, Multi-Tenant Departments, Audit Logs |

*(Quick-fill buttons are available right on the `/login` screen for one-click access!)*

---

## 🌟 Key Features

### 1. 🎓 Faculty Portal
- **AI Circular Studio**: Transform rough notes or bullet points into structured, official institutional circulars with category tagging, urgency indicators, and event dates.
- **Precision Targeting Engine**: Filter recipients by department, year of study, section, and CGPA thresholds.
- **Campaign & Broadcast Builder**: Schedule multi-channel announcements (Email, WhatsApp, Push Notifications).
- **Engagement & Delivery Analytics**: Real-time read rates, acknowledgment tracking, and RSVP metrics.
- **Student Event Registrations**: Track and export attendee lists with registration caps.

### 2. 📱 Student Experience
- **Personalized Stream**: Filter announcements by urgency (Urgent, High, General) and category (Exams, Placement Drives, Hackathons, Scholarships).
- **One-Click Event RSVP**: Register for on-campus placement drives and workshops with real-time seat tracking.
- **Acknowledge Receipts**: Instant read-receipts for mandatory institutional circulars.

### 3. 🛡️ Institutional Admin Center
- **Student & Faculty Management**: Directory management with role-based access control.
- **Data Imports**: Batch import student rosters with CSV/Excel verification.
- **Department Isolation**: Multi-department support with secure organizational boundaries.
- **Audit Trails**: Complete logging of all institutional dispatches, logins, and permission changes.

---

## 💻 Local Development

### Prerequisites
- Node.js 18+ (tested on Node 20 / 22)
- Python 3.10+ (for FastAPI backend)

### 1. Frontend (Vite + React + Tailwind + TypeScript)
```bash
cd frontend
npm install
npm run dev
```
Visit `http://localhost:5173`.

### 2. Backend (FastAPI + SQLAlchemy + Alembic)
```bash
cd backend
python -m venv .venv
# On Windows: .venv\Scripts\activate
# On Linux/macOS: source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```
API Documentation will be live at `http://localhost:8000/docs`.

---

## 🚢 Deploying to Vercel

1. Import the repository `https://github.com/VamsiKamaL07/campusiq` into [Vercel](https://vercel.com/new).
2. Set the **Root Directory** to `frontend`.
3. The included `vercel.json` will automatically configure SPA client routing for all subroutes.
