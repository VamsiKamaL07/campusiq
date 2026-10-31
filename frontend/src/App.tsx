import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";
import DashboardLayout from "./components/layout/DashboardLayout";
import Landing from "./pages/Landing";
import Login from "./pages/auth/Login";
import ComingSoon from "./pages/ComingSoon";

// Faculty pages
import FacultyDashboard from "./pages/faculty/FacultyDashboard";
import CircularStudio from "./pages/faculty/CircularStudio";
import StudentTargeting from "./pages/faculty/StudentTargeting";
import CampaignBuilder from "./pages/faculty/CampaignBuilder";
import Analytics from "./pages/faculty/Analytics";
import Reminders from "./pages/faculty/Reminders";
import FacultyAnnouncements from "./pages/faculty/FacultyAnnouncements";
import FacultyRegistrations from "./pages/faculty/FacultyRegistrations";
import FacultySettings from "./pages/faculty/FacultySettings";

// Student pages
import StudentDashboard from "./pages/student/StudentDashboard";
import NotificationCenter from "./pages/student/NotificationCenter";
import AllAnnouncements from "./pages/student/AllAnnouncements";
import EventsPage from "./pages/student/EventsPage";
import RegistrationsPage from "./pages/student/RegistrationsPage";
import StudentSettings from "./pages/student/StudentSettings";

// Admin pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import StudentsPage from "./pages/admin/StudentsPage";
import FacultyManagement from "./pages/admin/FacultyManagement";
import DepartmentsPage from "./pages/admin/DepartmentsPage";
import ImportsPage from "./pages/admin/ImportsPage";
import ProvidersPage from "./pages/admin/ProvidersPage";
import AuditLogsPage from "./pages/admin/AuditLogsPage";
import PlatformSettings from "./pages/admin/PlatformSettings";

// ─── Loading Fallback ─────────────────────────────────────────────────────────
function PageLoader() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

// ─── Demo Mode Banner ─────────────────────────────────────────────────────────
function DemoBanner() {
  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] bg-amber-500 text-white text-center text-xs font-semibold py-1 pointer-events-none">
      🧪 Demo Mode — Sample data only. No real notifications will be sent.
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <DemoBanner />
        {/* Push content down for demo banner */}
        <div className="pt-6">
          <Routes>
            {/* ─── Public ─── */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/features" element={<Navigate to="/#features" replace />} />
            <Route path="/how-it-works" element={<Navigate to="/#how-it-works" replace />} />
            <Route path="/about" element={<Navigate to="/" replace />} />

            {/* ─── Faculty ─── */}
            <Route path="/faculty" element={<ProtectedRoute role="faculty" />}>
              <Route element={<DashboardLayout />}>
                <Route index element={<Navigate to="/faculty/dashboard" replace />} />
                <Route path="dashboard" element={<FacultyDashboard />} />
                <Route path="circular-studio" element={<CircularStudio />} />
                <Route path="announcements" element={<FacultyAnnouncements />} />
                <Route path="targeting" element={<StudentTargeting />} />
                <Route path="campaigns" element={<CampaignBuilder />} />
                <Route path="reminders" element={<Reminders />} />
                <Route path="analytics" element={<Analytics />} />
                <Route path="registrations" element={<FacultyRegistrations />} />
                <Route path="settings" element={<FacultySettings />} />
              </Route>
            </Route>

            {/* ─── Student ─── */}
            <Route path="/student" element={<ProtectedRoute role="student" />}>
              <Route element={<DashboardLayout />}>
                <Route index element={<Navigate to="/student/dashboard" replace />} />
                <Route path="dashboard" element={<StudentDashboard />} />
                <Route path="announcements" element={<AllAnnouncements />} />
                <Route path="events" element={<EventsPage />} />
                <Route path="registrations" element={<RegistrationsPage />} />
                <Route path="notifications" element={<NotificationCenter />} />
                <Route path="settings" element={<StudentSettings />} />
              </Route>
            </Route>

            {/* ─── Admin ─── */}
            <Route path="/admin" element={<ProtectedRoute role="super_admin" />}>
              <Route element={<DashboardLayout />}>
                <Route index element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="students" element={<StudentsPage />} />
                <Route path="faculty" element={<FacultyManagement />} />
                <Route path="departments" element={<DepartmentsPage />} />
                <Route path="imports" element={<ImportsPage />} />
                <Route path="providers" element={<ProvidersPage />} />
                <Route path="audit-logs" element={<AuditLogsPage />} />
                <Route path="settings" element={<PlatformSettings />} />
              </Route>
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
