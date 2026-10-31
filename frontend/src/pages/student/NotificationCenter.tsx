import { useState } from "react";
import { motion } from "framer-motion";
import { Bell, Check, Archive, Trash2, Star } from "lucide-react";
import { demoNotifications } from "../../lib/demoData";
import { StudentNotification } from "../../types";
import { cn } from "../../lib/utils";

type Tab = "all" | "unread" | "important" | "archived";

export default function NotificationCenter() {
  const [notifications, setNotifications] = useState<StudentNotification[]>(demoNotifications);
  const [tab, setTab] = useState<Tab>("all");

  const filtered = notifications.filter((n) => {
    if (tab === "unread") return !n.isRead;
    if (tab === "important") return n.priority === "urgent" || n.priority === "high";
    if (tab === "archived") return n.status === "delivered" && n.isRead;
    return true;
  });

  const markRead = (id: string) =>
    setNotifications((ns) => ns.map((n) => n.id === id ? { ...n, isRead: true } : n));

  const markAllRead = () =>
    setNotifications((ns) => ns.map((n) => ({ ...n, isRead: true })));

  const TABS: { id: Tab; label: string }[] = [
    { id: "all", label: "All" },
    { id: "unread", label: `Unread (${notifications.filter((n) => !n.isRead).length})` },
    { id: "important", label: "Important" },
    { id: "archived", label: "Archived" },
  ];

  const priorityColor: Record<string, string> = {
    urgent: "border-l-2 border-l-red-500",
    high: "border-l-2 border-l-amber-500",
    medium: "border-l-2 border-l-primary-500",
    low: "",
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-navy-900 dark:text-white flex items-center gap-2">
          <Bell size={22} className="text-primary-600" />
          Notification Center
        </h1>
        <button
          onClick={markAllRead}
          className="btn-ghost text-xs flex items-center gap-1.5 border border-slate-200 dark:border-slate-700"
        >
          <Check size={12} />
          Mark all read
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-surface-subtle dark:bg-navy-800 p-1 rounded-xl w-fit">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "px-4 py-1.5 rounded-lg text-sm font-medium transition-all",
              tab === t.id
                ? "bg-white dark:bg-navy-700 text-navy-900 dark:text-white shadow-sm"
                : "text-slate-500 dark:text-slate-400 hover:text-navy-900 dark:hover:text-white"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Notification list */}
      <div className="space-y-2">
        {filtered.length === 0 ? (
          <div className="card p-12 flex flex-col items-center justify-center gap-3 text-center">
            <div className="w-16 h-16 rounded-2xl bg-surface-subtle dark:bg-navy-800 flex items-center justify-center">
              <Bell size={28} className="text-slate-300 dark:text-slate-600" />
            </div>
            <p className="font-semibold text-slate-500">No notifications here</p>
          </div>
        ) : (
          filtered.map((n, i) => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={cn(
                "card p-4 flex items-start gap-3 cursor-pointer hover:shadow-card-hover transition-all",
                !n.isRead ? "bg-primary-50/50 dark:bg-primary-900/10" : "",
                priorityColor[n.priority]
              )}
              onClick={() => markRead(n.id)}
            >
              <div className={cn("w-2 h-2 rounded-full mt-1.5 flex-shrink-0", !n.isRead ? "bg-primary-500" : "bg-transparent")} />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className={cn("text-sm font-semibold leading-tight", !n.isRead ? "text-navy-900 dark:text-white" : "text-slate-700 dark:text-slate-300")}>
                    {n.title}
                  </p>
                  <span className="text-[10px] text-slate-400 flex-shrink-0">
                    {new Date(n.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                  </span>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">{n.message}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[10px] bg-surface-muted dark:bg-navy-800 border border-slate-200 dark:border-slate-700 px-2 py-0.5 rounded-full text-slate-500 capitalize">
                    {n.channel.replace("_", " ")}
                  </span>
                  {!n.isRead && (
                    <span className="text-[10px] text-primary-600 font-medium">New</span>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
