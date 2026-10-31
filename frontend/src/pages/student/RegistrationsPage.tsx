import { useState } from "react";
import { motion } from "framer-motion";
import {
  BookOpen, CheckCircle2, Calendar, MapPin, Clock, Tag, ChevronRight, XCircle,
} from "lucide-react";
import { demoAnnouncements } from "../../lib/demoData";
import { cn } from "../../lib/utils";

const catBadge: Record<string, string> = {
  placement: "badge-blue", scholarship: "badge-green", workshop: "badge-cyan",
  exam: "badge-amber", seminar: "badge-purple", internship: "badge-blue",
  general: "badge-blue", sports: "badge-green", cultural: "badge-purple",
};

type RegStatus = "confirmed" | "cancelled";
interface RegistrationEntry {
  announcementId: string;
  status: RegStatus;
  registeredAt: string;
}

const INITIAL_REGS: RegistrationEntry[] = [
  { announcementId: "ann-2", status: "confirmed", registeredAt: "2024-10-19T10:00:00Z" },
];

export default function RegistrationsPage() {
  const [registrations, setRegistrations] = useState<RegistrationEntry[]>(INITIAL_REGS);

  const cancel = (id: string) =>
    setRegistrations((rs) =>
      rs.map((r) => r.announcementId === id ? { ...r, status: "cancelled" } : r)
    );

  const withAnn = registrations.map((r) => ({
    reg: r,
    ann: demoAnnouncements.find((a) => a.id === r.announcementId),
  })).filter((x) => x.ann);

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-navy-900 dark:text-white flex items-center gap-2">
          <BookOpen size={22} className="text-primary-600" />
          My Registrations
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          All events and announcements you have registered for.
        </p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[
          {
            label: "Total Registered",
            value: registrations.length,
            color: "from-primary-500 to-primary-600",
          },
          {
            label: "Confirmed",
            value: registrations.filter((r) => r.status === "confirmed").length,
            color: "from-emerald-500 to-green-600",
          },
          {
            label: "Cancelled",
            value: registrations.filter((r) => r.status === "cancelled").length,
            color: "from-red-400 to-red-500",
          },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="card p-4"
          >
            <div className={cn("w-8 h-8 rounded-lg bg-gradient-to-br flex items-center justify-center mb-2", s.color)}>
              <BookOpen size={14} className="text-white" />
            </div>
            <p className="font-display text-xl font-bold text-navy-900 dark:text-white">{s.value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {withAnn.length === 0 ? (
        <div className="card p-16 flex flex-col items-center justify-center gap-3 text-center">
          <div className="w-16 h-16 rounded-2xl bg-surface-subtle dark:bg-navy-800 flex items-center justify-center">
            <BookOpen size={28} className="text-slate-300 dark:text-slate-600" />
          </div>
          <p className="font-semibold text-slate-500">No registrations yet</p>
          <p className="text-sm text-slate-400">Register for events from the Announcements page.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {withAnn.map(({ reg, ann }, i) => (
            <motion.div
              key={reg.announcementId}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="card p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className={cn("badge text-[11px]", catBadge[ann!.category] ?? "badge-blue")}>
                      <Tag size={9} />
                      {ann!.category}
                    </span>
                    <span className={cn(
                      "badge text-[11px]",
                      reg.status === "confirmed" ? "badge-green" : "badge-red"
                    )}>
                      {reg.status === "confirmed"
                        ? <><CheckCircle2 size={10} /> Confirmed</>
                        : <><XCircle size={10} /> Cancelled</>
                      }
                    </span>
                  </div>
                  <h3 className="font-display font-semibold text-navy-900 dark:text-white text-base mb-1 leading-snug">
                    {ann!.title}
                  </h3>
                  <div className="flex flex-wrap gap-3 text-xs text-slate-500 mt-2">
                    {ann!.eventDate && (
                      <div className="flex items-center gap-1">
                        <Calendar size={11} className="text-primary-500" />
                        {new Date(ann!.eventDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </div>
                    )}
                    {ann!.venue && (
                      <div className="flex items-center gap-1">
                        <MapPin size={11} className="text-primary-500" />
                        {ann!.venue}
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Clock size={11} />
                      Registered {new Date(reg.registeredAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                    </div>
                  </div>
                </div>
                {reg.status === "confirmed" && (
                  <button
                    onClick={() => cancel(reg.announcementId)}
                    className="btn-ghost text-xs py-1.5 px-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 border border-red-200 dark:border-red-800 flex-shrink-0"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
