import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Bell,
  Calendar,
  BookOpen,
  Clock,
  ArrowRight,
  CheckCircle2,
  Star,
  Tag,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { demoAnnouncements, demoNotifications } from "../../lib/demoData";
import { Announcement, AnnouncementPriority } from "../../types";
import { cn } from "../../lib/utils";

// ─── Announcement Card ────────────────────────────────────────────────────────
function AnnouncementCard({ ann }: { ann: Announcement }) {
  const [registered, setRegistered] = useState(ann.isRegistered ?? false);
  const [acknowledged, setAcknowledged] = useState(ann.isAcknowledged ?? false);

  const priorityColor: Record<AnnouncementPriority, string> = {
    urgent: "border-l-4 border-l-red-500",
    high: "border-l-4 border-l-amber-500",
    medium: "border-l-4 border-l-primary-500",
    low: "border-l-4 border-l-slate-300",
  };

  const catBadge: Record<string, string> = {
    placement: "badge-blue",
    scholarship: "badge-green",
    workshop: "badge-cyan",
    exam: "badge-amber",
    seminar: "badge-purple",
    internship: "badge-blue",
    general: "badge-blue",
    sports: "badge-green",
    cultural: "badge-purple",
  };

  return (
    <div className={cn("card p-5 hover:shadow-card-hover transition-all duration-300", priorityColor[ann.priority])}>
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex flex-wrap gap-2">
          <span className={cn("badge text-[11px]", catBadge[ann.category] ?? "badge-blue")}>
            <Tag size={9} />
            {ann.category}
          </span>
          {ann.priority === "urgent" && (
            <span className="badge-red text-[11px]">
              <AlertCircle size={9} />
              Urgent
            </span>
          )}
        </div>
        {ann.status === "live" && (
          <span className="badge-green text-[10px] flex-shrink-0">Live</span>
        )}
      </div>

      <h3 className="font-display font-semibold text-navy-900 dark:text-white text-base mb-2 leading-snug">
        {ann.title}
      </h3>
      <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-2 mb-3 leading-relaxed">
        {ann.description}
      </p>

      {/* Meta */}
      <div className="flex flex-wrap gap-3 text-xs text-slate-500 mb-4">
        {ann.eventDate && (
          <div className="flex items-center gap-1">
            <Calendar size={11} />
            {new Date(ann.eventDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
          </div>
        )}
        {ann.registrationDeadline && (
          <div className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
            <Clock size={11} />
            Deadline: {new Date(ann.registrationDeadline).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
          </div>
        )}
        {ann.venue && (
          <div className="flex items-center gap-1">
            <Star size={11} />
            {ann.venue}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2">
        {ann.registrationLink && !registered && (
          <button
            onClick={() => setRegistered(true)}
            className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1.5"
          >
            <BookOpen size={12} />
            Register Now
          </button>
        )}
        {registered && (
          <span className="badge-green text-xs py-1.5 px-3 flex items-center gap-1.5">
            <CheckCircle2 size={12} />
            Registered
          </span>
        )}
        {!acknowledged && (
          <button
            onClick={() => setAcknowledged(true)}
            className="btn-ghost text-xs py-1.5 px-3 flex items-center gap-1.5 border border-slate-200 dark:border-slate-700"
          >
            <CheckCircle2 size={12} />
            Acknowledge
          </button>
        )}
        <button className="btn-ghost text-xs py-1.5 px-3 flex items-center gap-1.5">
          <ExternalLink size={12} />
          Details
        </button>
      </div>
    </div>
  );
}

// ─── Student Dashboard ────────────────────────────────────────────────────────
export default function StudentDashboard() {
  const { user } = useAuth();
  const firstName = user?.displayName?.split(" ")[0] ?? "Student";
  const unreadCount = demoNotifications.filter((n) => !n.isRead).length;

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-5 bg-gradient-to-r from-primary-600 to-cyan-600 text-white overflow-hidden relative"
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-1/3 w-32 h-32 bg-white rounded-full translate-y-1/2" />
        </div>
        <div className="relative z-10">
          <p className="text-primary-100 text-sm mb-1">Welcome back,</p>
          <h1 className="font-display text-2xl font-bold mb-3">Hey {firstName}! 👋</h1>
          <div className="flex flex-wrap gap-3">
            <div className="bg-white/20 rounded-xl px-3 py-2">
              <p className="text-xs text-primary-100">Unread Notifications</p>
              <p className="font-display font-bold text-xl">{unreadCount}</p>
            </div>
            <div className="bg-white/20 rounded-xl px-3 py-2">
              <p className="text-xs text-primary-100">Open Announcements</p>
              <p className="font-display font-bold text-xl">{demoAnnouncements.filter((a) => a.status === "live").length}</p>
            </div>
            <div className="bg-white/20 rounded-xl px-3 py-2">
              <p className="text-xs text-primary-100">Upcoming Deadlines</p>
              <p className="font-display font-bold text-xl">3</p>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Announcement feed */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-semibold text-navy-900 dark:text-white">Your Announcements</h2>
            <Link to="/student/announcements" className="text-xs text-primary-600 hover:underline flex items-center gap-1">
              View all <ArrowRight size={11} />
            </Link>
          </div>
          {demoAnnouncements.filter((a) => a.status === "live").slice(0, 3).map((ann) => (
            <AnnouncementCard key={ann.id} ann={ann} />
          ))}
        </div>

        {/* Right sidebar */}
        <div className="space-y-4">
          {/* Upcoming deadlines */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-semibold text-navy-900 dark:text-white text-sm">Upcoming Deadlines</h3>
              <Clock size={14} className="text-primary-600" />
            </div>
            <div className="space-y-3">
              {[
                { title: "TCS Drive Registration", date: "Nov 10", days: 20, color: "text-red-600" },
                { title: "GATE Workshop", date: "Nov 14", days: 24, color: "text-amber-600" },
                { title: "Scholarship Apply", date: "Nov 30", days: 40, color: "text-primary-600" },
              ].map((d) => (
                <div key={d.title} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-navy-900 dark:text-white leading-tight">{d.title}</p>
                    <p className="text-xs text-slate-400">{d.date}</p>
                  </div>
                  <span className={cn("text-xs font-bold", d.color)}>{d.days}d</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent notifications */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-semibold text-navy-900 dark:text-white text-sm">Notifications</h3>
              <Link to="/student/notifications" className="text-xs text-primary-600 hover:underline">
                View all
              </Link>
            </div>
            <div className="space-y-3">
              {demoNotifications.slice(0, 3).map((n) => (
                <div key={n.id} className={cn("flex items-start gap-2.5 p-2.5 rounded-xl", !n.isRead ? "bg-primary-50 dark:bg-primary-900/20" : "")}>
                  <div className={cn("w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0", !n.isRead ? "bg-primary-500" : "bg-slate-300")} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-navy-900 dark:text-white truncate">{n.title}</p>
                    <p className="text-xs text-slate-400 truncate">{n.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
