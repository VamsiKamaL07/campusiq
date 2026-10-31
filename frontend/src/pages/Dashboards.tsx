import StatCard from "../components/StatCard";
import { useApi } from "../hooks/useApi";

function Shell({ title, loading, error, children }: { title: string; loading: boolean; error: string | null; children: React.ReactNode }) {
  return (
    <div>
      <h1 className="font-display text-3xl font-bold">{title}</h1>
      {loading && <p className="mt-6 text-slate-500" role="status">Loading…</p>}
      {error && <p className="mt-6 rounded-xl bg-red-50 p-4 text-red-700" role="alert">{error}</p>}
      {!loading && !error && <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{children}</div>}
    </div>
  );
}

export function FacultyDashboard() {
  const { data, loading, error } = useApi<{ departments: string[]; total_students: number; active_announcements: number; pending_approvals: number; scheduled_notifications: number }>("/dashboard/faculty");
  return (
    <Shell title="Faculty dashboard" loading={loading} error={error}>
      <StatCard label="Authorized students" value={data?.total_students ?? 0} hint={data?.departments.join(", ") || "No department assigned yet"} />
      <StatCard label="Active announcements" value={data?.active_announcements ?? 0} />
      <StatCard label="Pending approvals" value={data?.pending_approvals ?? 0} />
      <StatCard label="Scheduled notifications" value={data?.scheduled_notifications ?? 0} />
    </Shell>
  );
}

export function StudentDashboard() {
  const { data, loading, error } = useApi<{ total: number; unread: number }>("/dashboard/student");
  return (
    <Shell title="Your announcements" loading={loading} error={error}>
      <StatCard label="Unread" value={data?.unread ?? 0} />
      <StatCard label="Total received" value={data?.total ?? 0} />
    </Shell>
  );
}

export function AdminDashboard() {
  const { data, loading, error } = useApi<{ departments: number; students: number; users: number; campaigns: number }>("/dashboard/admin");
  return (
    <Shell title="Administration" loading={loading} error={error}>
      <StatCard label="Departments" value={data?.departments ?? 0} />
      <StatCard label="Students on record" value={data?.students ?? 0} />
      <StatCard label="User accounts" value={data?.users ?? 0} />
      <StatCard label="Campaigns" value={data?.campaigns ?? 0} />
    </Shell>
  );
}
