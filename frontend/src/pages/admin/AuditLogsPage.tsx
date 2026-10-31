import { useState } from "react";
import { motion } from "framer-motion";
import {
  AlertTriangle, Search, Filter, ChevronRight, Shield, User,
  FileText, Upload, Bell, Settings, Trash2, CheckCircle2,
} from "lucide-react";
import { cn } from "../../lib/utils";

type AuditAction =
  | "announcement_created"
  | "announcement_approved"
  | "announcement_rejected"
  | "student_imported"
  | "faculty_invited"
  | "notification_sent"
  | "settings_updated"
  | "login";

interface AuditLog {
  id: string;
  actorName: string;
  actorRole: string;
  action: AuditAction;
  resourceType: string;
  resourceTitle: string;
  timestamp: string;
  ipAddress: string;
  metadata?: string;
}

const AUDIT_LOGS: AuditLog[] = [
  { id: "log-001", actorName: "Vikram Singh", actorRole: "super_admin", action: "announcement_approved", resourceType: "Announcement", resourceTitle: "TCS National Qualifier 2024", timestamp: "2024-10-21T11:45:00Z", ipAddress: "192.168.1.10" },
  { id: "log-002", actorName: "Dr. Meenakshi Sharma", actorRole: "faculty", action: "announcement_created", resourceType: "Announcement", resourceTitle: "Infosys InfyTQ Hackathon", timestamp: "2024-10-21T14:30:00Z", ipAddress: "192.168.1.25", metadata: "Category: placement" },
  { id: "log-003", actorName: "Vikram Singh", actorRole: "super_admin", action: "student_imported", resourceType: "Import", resourceTitle: "students_batch_2024.xlsx", timestamp: "2024-10-20T09:15:00Z", ipAddress: "192.168.1.10", metadata: "420 records imported" },
  { id: "log-004", actorName: "Prof. Rajiv Menon", actorRole: "faculty", action: "notification_sent", resourceType: "Campaign", resourceTitle: "GATE 2025 Workshop — Reminder", timestamp: "2024-10-20T10:00:00Z", ipAddress: "192.168.1.22", metadata: "180 recipients, channels: in_app, email" },
  { id: "log-005", actorName: "Vikram Singh", actorRole: "super_admin", action: "faculty_invited", resourceType: "User", resourceTitle: "Dr. Anita Rao <anita@college.edu>", timestamp: "2024-10-19T16:00:00Z", ipAddress: "192.168.1.10" },
  { id: "log-006", actorName: "Vikram Singh", actorRole: "super_admin", action: "settings_updated", resourceType: "Platform", resourceTitle: "Email provider configured (Resend)", timestamp: "2024-10-18T14:30:00Z", ipAddress: "192.168.1.10" },
  { id: "log-007", actorName: "Dr. Meenakshi Sharma", actorRole: "faculty", action: "login", resourceType: "Auth", resourceTitle: "Google SSO", timestamp: "2024-10-18T08:55:00Z", ipAddress: "192.168.1.25" },
  { id: "log-008", actorName: "Prof. Suresh Kumar", actorRole: "faculty", action: "announcement_rejected", resourceType: "Announcement", resourceTitle: "Cultural Fest Notice", timestamp: "2024-10-17T15:20:00Z", ipAddress: "192.168.1.30", metadata: "Reason: Missing eligibility filter" },
  { id: "log-009", actorName: "Prof. Rajiv Menon", actorRole: "faculty", action: "announcement_created", resourceType: "Announcement", resourceTitle: "GATE 2025 Preparation Workshop", timestamp: "2024-10-18T08:00:00Z", ipAddress: "192.168.1.22" },
  { id: "log-010", actorName: "Vikram Singh", actorRole: "super_admin", action: "student_imported", resourceType: "Import", resourceTitle: "new_admissions_sept.csv", timestamp: "2024-09-15T10:00:00Z", ipAddress: "192.168.1.10", metadata: "185 records imported" },
];

const actionIcon: Record<AuditAction, JSX.Element> = {
  announcement_created: <FileText size={13} className="text-blue-500" />,
  announcement_approved: <CheckCircle2 size={13} className="text-emerald-500" />,
  announcement_rejected: <Trash2 size={13} className="text-red-500" />,
  student_imported: <Upload size={13} className="text-violet-500" />,
  faculty_invited: <User size={13} className="text-cyan-500" />,
  notification_sent: <Bell size={13} className="text-amber-500" />,
  settings_updated: <Settings size={13} className="text-slate-500" />,
  login: <Shield size={13} className="text-primary-500" />,
};

const actionLabel: Record<AuditAction, string> = {
  announcement_created: "Created announcement",
  announcement_approved: "Approved announcement",
  announcement_rejected: "Rejected announcement",
  student_imported: "Imported students",
  faculty_invited: "Invited faculty",
  notification_sent: "Sent notification",
  settings_updated: "Updated settings",
  login: "Signed in",
};

const roleBadge: Record<string, string> = {
  super_admin: "badge-amber",
  faculty: "badge-blue",
  student: "badge-green",
};

export default function AuditLogsPage() {
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState<AuditAction | "all">("all");
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = AUDIT_LOGS.filter((log) => {
    const matchSearch = log.actorName.toLowerCase().includes(search.toLowerCase()) ||
      log.resourceTitle.toLowerCase().includes(search.toLowerCase());
    const matchAction = actionFilter === "all" || log.action === actionFilter;
    return matchSearch && matchAction;
  });

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-navy-900 dark:text-white flex items-center gap-2">
          <AlertTriangle size={22} className="text-primary-600" />
          Audit Logs
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          Detailed audit trail of all platform actions and approval events.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Events", value: AUDIT_LOGS.length, color: "from-primary-500 to-primary-600" },
          { label: "Announcements", value: AUDIT_LOGS.filter((l) => l.resourceType === "Announcement").length, color: "from-blue-500 to-cyan-500" },
          { label: "Imports", value: AUDIT_LOGS.filter((l) => l.resourceType === "Import").length, color: "from-violet-500 to-purple-600" },
          { label: "Notifications", value: AUDIT_LOGS.filter((l) => l.action === "notification_sent").length, color: "from-amber-500 to-orange-500" },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="card p-4">
            <div className={cn("w-8 h-8 rounded-lg bg-gradient-to-br flex items-center justify-center mb-2", s.color)}>
              <AlertTriangle size={14} className="text-white" />
            </div>
            <p className="font-display text-2xl font-bold text-navy-900 dark:text-white">{s.value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="card p-4 flex flex-wrap gap-3">
        <div className="flex items-center gap-2 bg-surface-muted dark:bg-navy-800 rounded-xl px-3 py-2 border border-slate-200 dark:border-slate-700 flex-1 min-w-[180px]">
          <Search size={14} className="text-slate-400" />
          <input
            type="search"
            placeholder="Search actor or resource…"
            className="bg-transparent text-sm text-navy-900 dark:text-white placeholder:text-slate-400 outline-none flex-1"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="input text-sm py-2 px-3"
          value={actionFilter}
          onChange={(e) => setActionFilter(e.target.value as AuditAction | "all")}
        >
          <option value="all">All Actions</option>
          {(Object.keys(actionLabel) as AuditAction[]).map((a) => (
            <option key={a} value={a}>{actionLabel[a]}</option>
          ))}
        </select>
      </div>

      {/* Log list */}
      <div className="card divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 flex flex-col items-center gap-3 text-center">
            <AlertTriangle size={28} className="text-slate-300 dark:text-slate-600" />
            <p className="text-slate-500 font-medium">No audit logs match your filters</p>
          </div>
        ) : (
          filtered.map((log, i) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.03 }}
              className="p-4 hover:bg-surface-muted dark:hover:bg-navy-800/50 transition-colors cursor-pointer"
              onClick={() => setExpanded(expanded === log.id ? null : log.id)}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-navy-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                    {actionIcon[log.action]}
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-navy-900 dark:text-white">{log.actorName}</span>
                      <span className={cn("badge text-[10px]", roleBadge[log.actorRole] ?? "badge-blue")}>{log.actorRole.replace("_", " ")}</span>
                      <span className="text-sm text-slate-400">{actionLabel[log.action]}</span>
                    </div>
                    <p className="text-xs text-slate-500 truncate">{log.resourceTitle}</p>
                    {expanded === log.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="mt-3 space-y-1"
                      >
                        <p className="text-xs text-slate-400">IP: <span className="font-mono text-navy-900 dark:text-white">{log.ipAddress}</span></p>
                        {log.metadata && <p className="text-xs text-slate-400">Details: <span className="text-navy-900 dark:text-white">{log.metadata}</span></p>}
                      </motion.div>
                    )}
                  </div>
                </div>
                <div className="flex items-start gap-2 flex-shrink-0 text-right">
                  <div>
                    <p className="text-xs text-slate-400">
                      {new Date(log.timestamp).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                    </p>
                    <p className="text-[10px] text-slate-300 dark:text-slate-600">
                      {new Date(log.timestamp).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                  <ChevronRight
                    size={13}
                    className={cn("text-slate-300 dark:text-slate-600 mt-0.5 transition-transform", expanded === log.id && "rotate-90")}
                  />
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
