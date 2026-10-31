import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { UserRole } from "../types";

interface Props {
  role: UserRole;
}

export default function ProtectedRoute({ role }: Props) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-muted dark:bg-navy-950">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-500 text-sm">Loading your workspace…</p>
        </div>
      </div>
    );
  }

  if (!user || !user.role) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== role) {
    // Redirect to the correct dashboard
    const dashboardMap: Record<UserRole, string> = {
      faculty: "/faculty/dashboard",
      student: "/student/dashboard",
      super_admin: "/admin/dashboard",
    };
    return <Navigate to={dashboardMap[user.role]} replace />;
  }

  return <Outlet />;
}
