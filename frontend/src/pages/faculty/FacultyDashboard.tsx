import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import {
  Users,
  Megaphone,
  Clock,
  Bell,
  ArrowRight,
  TrendingUp,
  Zap,
  CheckCircle2,
  AlertCircle,
  Circle,
  Plus,
  ExternalLink,
  Brain,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import {
  demoNotificationActivity,
  demoAnnouncements,
  demoFacultyStats,
} from "../../lib/demoData";
import { cn } from "../../lib/utils";

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({
  icon: Icon,
  label,
  value,
  trend,
  color,
  delay,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  trend?: string;
  color: string;
  delay: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay }}
      className="card p-5"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", color)}>
          <Icon size={18} className="text-white" />
        </div>
        {trend && (
          <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
            <TrendingUp size={12} />
            {trend}
          </div>
        )}
      </div>
      <p className="font-display text-2xl font-bold text-navy-900 dark:text-white">
        {typeof value === "number" ? value.toLocaleString() : value}
      </p>
      <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{label}</p>
    </motion.div>
  );
}

// ─── AI Activity Panel ────────────────────────────────────────────────────────
function AIActivityPanel() {
  const agentSteps = [
    { label: "Circular text extracted", status: "done" },
    { label: "Event details identified", status: "done" },
    { label: "Eligibility rules proposed", status: "done" },
    { label: "Announcement draft prepared", status: "done" },
    { label: "Awaiting faculty approval", status: "active" },
  ];

  return (
    <div className="card p-5 h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center">
            <Brain size={14} className="text-white" />
          </div>
          <p className="font-display font-semibold text-navy-900 dark:text-white text-sm">AI Agent Activity</p>
        </div>
        <span className="badge-blue text-[10px] animate-pulse">
          <Zap size={9} />
          Live
        </span>
      </div>
      <div className="space-y-3">
        {agentSteps.map((step) => (
          <div key={step.label} className="flex items-center gap-2.5">
            <div className="flex-shrink-0">
              {step.status === "done" ? (
                <CheckCircle2 size={16} className="text-emerald-500" />
              ) : step.status === "active" ? (
                <Circle size={16} className="text-primary-500 animate-pulse" />
              ) : (
                <Circle size={16} className="text-slate-300 dark:text-slate-600" />
              )}
            </div>
            <span
              className={cn(
                "text-sm",
                step.status === "done"
                  ? "text-slate-600 dark:text-slate-400"
                  : step.status === "active"
                  ? "text-primary-600 dark:text-primary-400 font-medium"
                  : "text-slate-400"
              )}
            >
              {step.label}
            </span>
          </div>
        ))}
      </div>
      <Link
        to="/faculty/circular-studio"
        className="mt-4 flex items-center gap-1.5 text-xs text-primary-600 dark:text-primary-400 font-semibold hover:underline"
      >
        Open AI Circular Studio
        <ExternalLink size={11} />
      </Link>
    </div>
  );
}

// ─── Announcement Row ─────────────────────────────────────────────────────────
function AnnouncementRow({ announcement }: { announcement: (typeof demoAnnouncements)[0] }) {
  const statusColors: Record<string, string> = {
    live: "badge-green",
    pending_approval: "badge-amber",
    draft: "badge-blue",
    expired: "badge-red",
  };
  const priorityColors: Record<string, string> = {
    urgent: "text-red-500",
    high: "text-amber-500",
    medium: "text-primary-500",
    low: "text-slate-400",
  };

  return (
    <div className="flex items-center gap-4 py-3 border-b border-slate-100 dark:border-slate-800 last:border-0 group">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-navy-900 dark:text-white truncate group-hover:text-primary-600 transition-colors">
          {announcement.title}
        </p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs text-slate-400 capitalize">{announcement.category}</span>
          {announcement.eventDate && (
            <>
              <span className="text-slate-300 dark:text-slate-600">·</span>
              <span className="text-xs text-slate-400">{new Date(announcement.eventDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>
            </>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        {announcement.recipientCount !== undefined && announcement.recipientCount > 0 && (
          <span className="text-xs text-slate-400">{announcement.recipientCount} students</span>
        )}
        <AlertCircle size={12} className={priorityColors[announcement.priority]} />
        <span className={cn("badge text-[10px]", statusColors[announcement.status] ?? "badge-blue")}>
          {announcement.status.replace("_", " ")}
        </span>
      </div>
    </div>
  );
}

// ─── Faculty Dashboard ────────────────────────────────────────────────────────
export default function FacultyDashboard() {
  const { user } = useAuth();
  const firstName = user?.displayName?.split(" ")[1] ?? user?.displayName ?? "Faculty";

  const statCards = [
    {
      icon: Users,
      label: "Total Students",
      value: demoFacultyStats.totalStudents,
      trend: "+12 this month",
      color: "bg-gradient-to-br from-primary-500 to-primary-600",
      delay: 0,
    },
    {
      icon: Megaphone,
      label: "Active Announcements",
      value: demoFacultyStats.activeAnnouncements,
      trend: undefined,
      color: "bg-gradient-to-br from-cyan-500 to-cyan-600",
      delay: 0.05,
    },
    {
      icon: Clock,
      label: "Pending Approvals",
      value: demoFacultyStats.pendingApprovals,
      trend: undefined,
      color: "bg-gradient-to-br from-amber-500 to-orange-500",
      delay: 0.1,
    },
    {
      icon: Bell,
      label: "Notifications Sent",
      value: demoFacultyStats.notificationsSent,
      trend: "+340 this week",
      color: "bg-gradient-to-br from-emerald-500 to-green-600",
      delay: 0.15,
    },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-navy-900 dark:text-white">
            Good morning, {firstName} 👋
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">
            Here's what's happening with your campus communications.
          </p>
        </div>
        <Link
          to="/faculty/circular-studio"
          className="btn-primary text-sm py-2 px-4 flex items-center gap-2 hidden sm:flex"
        >
          <Plus size={15} />
          New Circular
        </Link>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      {/* Chart + AI Panel */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Activity Chart */}
        <div className="lg:col-span-2 card p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="font-display font-semibold text-navy-900 dark:text-white">Notification Activity</p>
              <p className="text-slate-400 text-xs mt-0.5">Last 7 days — sent, delivered, opened</p>
            </div>
            <select className="text-xs border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 bg-white dark:bg-navy-800 text-slate-600 dark:text-slate-400 outline-none">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={demoNotificationActivity} margin={{ top: 5, right: 10, bottom: 5, left: -20 }}>
              <defs>
                <linearGradient id="sentGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="deliveredGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.5} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: "white", border: "1px solid #e2e8f0", borderRadius: "12px", fontSize: 12 }}
              />
              <Area type="monotone" dataKey="sent" stroke="#2563eb" strokeWidth={2} fill="url(#sentGrad)" name="Sent" />
              <Area type="monotone" dataKey="delivered" stroke="#06b6d4" strokeWidth={2} fill="url(#deliveredGrad)" name="Delivered" />
              <Line type="monotone" dataKey="opened" stroke="#10b981" strokeWidth={2} dot={false} name="Opened" />
            </AreaChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-4 mt-3 justify-center">
            {[
              { color: "#2563eb", label: "Sent" },
              { color: "#06b6d4", label: "Delivered" },
              { color: "#10b981", label: "Opened" },
            ].map((l) => (
              <div key={l.label} className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: l.color }} />
                <span className="text-xs text-slate-500">{l.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* AI Activity */}
        <AIActivityPanel />
      </div>

      {/* Bottom panels */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Recent Announcements */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="font-display font-semibold text-navy-900 dark:text-white">Recent Announcements</p>
            <Link to="/faculty/announcements" className="text-xs text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1">
              View all <ArrowRight size={11} />
            </Link>
          </div>
          {demoAnnouncements.slice(0, 4).map((a) => (
            <AnnouncementRow key={a.id} announcement={a} />
          ))}
        </div>

        {/* Upcoming Deadlines */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="font-display font-semibold text-navy-900 dark:text-white">Upcoming Deadlines</p>
            <Link to="/faculty/reminders" className="text-xs text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1">
              Manage <ArrowRight size={11} />
            </Link>
          </div>
          <div className="space-y-3">
            {[
              { title: "TCS Drive Registration", date: "Nov 10, 2024", days: 20, color: "bg-red-500" },
              { title: "GATE Workshop Registration", date: "Nov 14, 2024", days: 24, color: "bg-amber-500" },
              { title: "Scholarship Application", date: "Nov 30, 2024", days: 40, color: "bg-primary-500" },
            ].map((d) => (
              <div key={d.title} className="flex items-center gap-3">
                <div className={cn("w-1 h-10 rounded-full flex-shrink-0", d.color)} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-navy-900 dark:text-white truncate">{d.title}</p>
                  <p className="text-xs text-slate-400">{d.date}</p>
                </div>
                <span className="text-xs font-semibold text-slate-500 flex-shrink-0">
                  {d.days}d left
                </span>
              </div>
            ))}
          </div>

          {/* Quick action */}
          <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Link
              to="/faculty/circular-studio"
              className="flex items-center justify-between w-full px-4 py-3 rounded-xl bg-gradient-to-r from-primary-50 to-cyan-50 dark:from-primary-900/20 dark:to-cyan-900/20 border border-primary-100 dark:border-primary-900/40 hover:shadow-sm transition-all group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-cyan-500 flex items-center justify-center">
                  <Zap size={14} className="text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-navy-900 dark:text-white">Process a New Circular</p>
                  <p className="text-xs text-slate-400">Upload → AI → Approve → Send</p>
                </div>
              </div>
              <ArrowRight size={14} className="text-primary-600 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
