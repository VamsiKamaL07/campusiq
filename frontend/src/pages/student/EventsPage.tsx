import { useState } from "react";
import { motion } from "framer-motion";
import {
  Calendar, MapPin, Clock, BookOpen, CheckCircle2, Tag, Search, Filter,
} from "lucide-react";
import { demoAnnouncements } from "../../lib/demoData";
import { cn } from "../../lib/utils";

const catBadge: Record<string, string> = {
  placement: "badge-blue", scholarship: "badge-green", workshop: "badge-cyan",
  exam: "badge-amber", seminar: "badge-purple", internship: "badge-blue",
  general: "badge-blue", sports: "badge-green", cultural: "badge-purple",
};

export default function EventsPage() {
  const [search, setSearch] = useState("");
  const [registeredIds, setRegisteredIds] = useState<Set<string>>(new Set(["ann-2"]));

  const events = demoAnnouncements.filter(
    (a) => a.eventDate && a.status === "live" &&
      a.title.toLowerCase().includes(search.toLowerCase())
  );

  const register = (id: string) => setRegisteredIds((prev) => {
    const next = new Set(prev);
    next.add(id);
    return next;
  });

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-navy-900 dark:text-white flex items-center gap-2">
            <Calendar size={22} className="text-primary-600" />
            Upcoming Events
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Events you are eligible to attend or register for.
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 bg-white dark:bg-navy-800 rounded-xl px-3 py-2.5 border border-slate-200 dark:border-slate-700 shadow-sm">
        <Search size={15} className="text-slate-400 flex-shrink-0" />
        <input
          type="search"
          placeholder="Search events…"
          className="bg-transparent text-sm text-navy-900 dark:text-white placeholder:text-slate-400 outline-none flex-1"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {events.length === 0 ? (
        <div className="card p-16 flex flex-col items-center justify-center gap-3 text-center">
          <div className="w-16 h-16 rounded-2xl bg-surface-subtle dark:bg-navy-800 flex items-center justify-center">
            <Calendar size={28} className="text-slate-300 dark:text-slate-600" />
          </div>
          <p className="font-semibold text-slate-500">No events found</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {events.map((event, i) => {
            const isRegistered = registeredIds.has(event.id);
            const isDeadlinePassed = event.registrationDeadline
              ? new Date(event.registrationDeadline) < new Date()
              : false;
            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="card p-5 hover:shadow-card-hover transition-all duration-300"
              >
                <div className="flex items-start justify-between gap-2 mb-3">
                  <span className={cn("badge text-[11px]", catBadge[event.category] ?? "badge-blue")}>
                    <Tag size={9} />
                    {event.category}
                  </span>
                  {isRegistered && (
                    <span className="badge-green text-[10px] flex items-center gap-1">
                      <CheckCircle2 size={10} /> Registered
                    </span>
                  )}
                </div>
                <h3 className="font-display font-semibold text-navy-900 dark:text-white text-base mb-2 leading-snug">
                  {event.title}
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-2 mb-4 leading-relaxed">
                  {event.description}
                </p>
                <div className="space-y-1.5 mb-4">
                  {event.eventDate && (
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Calendar size={12} className="text-primary-500" />
                      {new Date(event.eventDate).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                      {event.eventTime && ` · ${event.eventTime}`}
                    </div>
                  )}
                  {event.venue && (
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <MapPin size={12} className="text-primary-500" />
                      {event.venue}
                    </div>
                  )}
                  {event.registrationDeadline && (
                    <div className="flex items-center gap-2 text-xs text-amber-600 dark:text-amber-400 font-medium">
                      <Clock size={12} />
                      Registration deadline: {new Date(event.registrationDeadline).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  {!isRegistered && !isDeadlinePassed && event.registrationLink && (
                    <button
                      onClick={() => register(event.id)}
                      className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1.5"
                    >
                      <BookOpen size={12} />
                      Register Now
                    </button>
                  )}
                  {isRegistered && (
                    <span className="badge-green text-xs py-1.5 px-3 flex items-center gap-1.5">
                      <CheckCircle2 size={12} /> Registered
                    </span>
                  )}
                  {isDeadlinePassed && !isRegistered && (
                    <span className="badge text-xs py-1.5 px-3 bg-slate-100 dark:bg-slate-700 text-slate-500">
                      Registration Closed
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
