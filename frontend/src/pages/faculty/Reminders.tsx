import { useState } from "react";
import { motion } from "framer-motion";
import { Clock, Plus, Pause, X, CheckCircle2, Bell, Calendar, Users, DollarSign } from "lucide-react";
import { demoReminders } from "../../lib/demoData";
import { Reminder, ReminderStatus } from "../../types";
import { cn } from "../../lib/utils";

const STATUS_CONFIG: Record<ReminderStatus, { label: string; className: string }> = {
  scheduled: { label: "Scheduled", className: "badge-blue" },
  sent: { label: "Sent", className: "badge-green" },
  paused: { label: "Paused", className: "badge-amber" },
  cancelled: { label: "Cancelled", className: "badge-red" },
};

export default function Reminders() {
  const [reminders, setReminders] = useState<Reminder[]>(demoReminders);
  const [showCreate, setShowCreate] = useState(false);

  const updateStatus = (id: string, status: ReminderStatus) => {
    setReminders((rs) => rs.map((r) => (r.id === id ? { ...r, status } : r)));
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-navy-900 dark:text-white flex items-center gap-2">
            <Clock size={22} className="text-primary-600" />
            Automated Reminders
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Schedule reminder sequences to ensure students don't miss important deadlines.
          </p>
        </div>
        <button onClick={() => setShowCreate(true)} className="btn-primary text-sm flex items-center gap-2">
          <Plus size={15} />
          Create Reminder
        </button>
      </div>

      {/* Timeline */}
      <div className="grid lg:grid-cols-[1fr_320px] gap-6">
        <div className="space-y-3">
          {reminders.map((reminder, i) => {
            const statusCfg = STATUS_CONFIG[reminder.status];
            return (
              <motion.div
                key={reminder.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="card p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="flex flex-col items-center">
                      <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center",
                        reminder.status === "scheduled" ? "bg-primary-100 dark:bg-primary-900/40" : "bg-slate-100 dark:bg-slate-800"
                      )}>
                        <Bell size={18} className={reminder.status === "scheduled" ? "text-primary-600" : "text-slate-400"} />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-sm font-semibold text-navy-900 dark:text-white">{reminder.announcementTitle}</p>
                        <span className={cn("badge text-[10px]", statusCfg.className)}>{statusCfg.label}</span>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">"{reminder.message}"</p>
                      <div className="flex flex-wrap gap-3 text-xs text-slate-500">
                        <div className="flex items-center gap-1">
                          <Calendar size={11} />
                          {formatDate(reminder.scheduledAt)}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users size={11} />
                          ~{reminder.recipientCount} recipients
                        </div>
                        <div className="flex items-center gap-1">
                          <Bell size={11} />
                          {reminder.channels.join(", ")}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    {reminder.status === "scheduled" && (
                      <button
                        onClick={() => updateStatus(reminder.id, "paused")}
                        className="p-1.5 rounded-lg text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors"
                        title="Pause reminder"
                      >
                        <Pause size={14} />
                      </button>
                    )}
                    {reminder.status === "paused" && (
                      <button
                        onClick={() => updateStatus(reminder.id, "scheduled")}
                        className="p-1.5 rounded-lg text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
                        title="Resume reminder"
                      >
                        <CheckCircle2 size={14} />
                      </button>
                    )}
                    {reminder.status !== "sent" && (
                      <button
                        onClick={() => updateStatus(reminder.id, "cancelled")}
                        className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        title="Cancel reminder"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Timeline overview */}
        <div className="card p-5">
          <h3 className="font-display font-semibold text-navy-900 dark:text-white mb-4">Timeline</h3>
          <div className="relative pl-4">
            {[
              { date: "Nov 8, 2024", label: "First Reminder", desc: "TCS Drive", color: "bg-primary-500" },
              { date: "Nov 10, 2024", label: "Final Reminder", desc: "TCS Drive", color: "bg-amber-500" },
              { date: "Nov 10, 2024", label: "Registration Deadline", desc: "TCS Drive", color: "bg-red-500", isDeadline: true },
              { date: "Nov 27, 2024", label: "Reminder", desc: "Scholarship", color: "bg-primary-500" },
              { date: "Nov 30, 2024", label: "Registration Deadline", desc: "Scholarship", color: "bg-red-500", isDeadline: true },
            ].map((item, i) => (
              <div key={i} className="relative flex gap-3 pb-4 last:pb-0">
                <div className={cn("w-2.5 h-2.5 rounded-full flex-shrink-0 mt-1.5 relative z-10", item.color)} />
                {i < 4 && (
                  <div className="absolute left-[4px] top-3 bottom-0 w-px bg-slate-200 dark:bg-slate-700" />
                )}
                <div>
                  <p className="text-xs text-slate-400 font-medium">{item.date}</p>
                  <p className={cn("text-sm font-semibold", item.isDeadline ? "text-red-600" : "text-navy-900 dark:text-white")}>
                    {item.label}
                  </p>
                  <p className="text-xs text-slate-500">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Create Reminder Modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card p-6 w-full max-w-lg shadow-2xl"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-bold text-navy-900 dark:text-white">Create Reminder</h3>
              <button onClick={() => setShowCreate(false)} className="p-1.5 rounded-lg hover:bg-surface-subtle dark:hover:bg-navy-800">
                <X size={16} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="label">Announcement</label>
                <select className="input text-sm">
                  <option>TCS National Qualifier 2024</option>
                  <option>National Science Scholarship</option>
                  <option>GATE Workshop</option>
                </select>
              </div>
              <div>
                <label className="label">Reminder Message</label>
                <textarea rows={3} className="input text-sm resize-none" placeholder="e.g. Reminder: Registration deadline is approaching…" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">Schedule Date & Time</label>
                  <input type="datetime-local" className="input text-sm" />
                </div>
                <div>
                  <label className="label">Channels</label>
                  <div className="flex gap-2 mt-1">
                    {["In-App", "Push", "Email"].map((c) => (
                      <label key={c} className="flex items-center gap-1 cursor-pointer">
                        <input type="checkbox" defaultChecked={c !== "Email"} className="w-3.5 h-3.5 accent-primary-600" />
                        <span className="text-xs text-slate-600 dark:text-slate-400">{c}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowCreate(false)} className="btn-secondary flex-1 text-sm py-2.5">Cancel</button>
              <button
                onClick={() => {
                  setReminders((rs) => [...rs, {
                    id: `rem-${Date.now()}`,
                    announcementId: "ann-1",
                    announcementTitle: "TCS National Qualifier 2024",
                    message: "Don't forget to register before the deadline!",
                    channels: ["in_app", "push"],
                    scheduledAt: new Date(Date.now() + 86400000).toISOString(),
                    status: "scheduled",
                    recipientCount: 312,
                  }]);
                  setShowCreate(false);
                }}
                className="btn-primary flex-1 text-sm py-2.5"
              >
                Schedule Reminder
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
