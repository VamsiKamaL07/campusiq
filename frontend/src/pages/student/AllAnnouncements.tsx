import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Megaphone, Search, Calendar, Clock, Tag, AlertCircle,
  CheckCircle2, BookOpen, ExternalLink, MapPin, Users, X,
} from "lucide-react";
import { demoAnnouncements } from "../../lib/demoData";
import { Announcement, AnnouncementCategory } from "../../types";
import { cn } from "../../lib/utils";

const CATEGORIES: { id: AnnouncementCategory | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "placement", label: "Placement" },
  { id: "scholarship", label: "Scholarship" },
  { id: "workshop", label: "Workshop" },
  { id: "exam", label: "Exam" },
  { id: "seminar", label: "Seminar" },
  { id: "internship", label: "Internship" },
  { id: "general", label: "General" },
];

const catBadge: Record<string, string> = {
  placement: "badge-blue", scholarship: "badge-green", workshop: "badge-cyan",
  exam: "badge-amber", seminar: "badge-purple", internship: "badge-blue",
  general: "badge-blue", sports: "badge-green", cultural: "badge-purple",
};

const priorityBorder: Record<string, string> = {
  urgent: "border-l-4 border-l-red-500",
  high: "border-l-4 border-l-amber-500",
  medium: "border-l-4 border-l-primary-500",
  low: "border-l-4 border-l-slate-200 dark:border-l-slate-700",
};

function DetailModal({ ann, onClose }: { ann: Announcement; onClose: () => void }) {
  const [registered, setRegistered] = useState(ann.isRegistered ?? false);
  const [acknowledged, setAcknowledged] = useState(ann.isAcknowledged ?? false);
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="card w-full max-w-xl p-6 max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex flex-wrap gap-2">
            <span className={cn("badge text-[11px]", catBadge[ann.category] ?? "badge-blue")}>
              <Tag size={9} /> {ann.category}
            </span>
            {ann.priority === "urgent" && <span className="badge-red text-[11px]"><AlertCircle size={9} /> Urgent</span>}
            {ann.status === "live" && <span className="badge-green text-[11px]">Live</span>}
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-surface-subtle dark:hover:bg-navy-700 flex-shrink-0">
            <X size={16} className="text-slate-500" />
          </button>
        </div>
        <h2 className="font-display font-bold text-xl text-navy-900 dark:text-white mb-3 leading-snug">{ann.title}</h2>
        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-5">{ann.description}</p>
        <div className="grid grid-cols-2 gap-3 mb-5">
          {ann.eventDate && (
            <div className="flex items-start gap-2">
              <Calendar size={14} className="text-primary-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-wide font-medium">Event Date</p>
                <p className="text-sm font-medium text-navy-900 dark:text-white">
                  {new Date(ann.eventDate).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                </p>
              </div>
            </div>
          )}
          {ann.registrationDeadline && (
            <div className="flex items-start gap-2">
              <Clock size={14} className="text-amber-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-wide font-medium">Deadline</p>
                <p className="text-sm font-medium text-amber-600 dark:text-amber-400">
                  {new Date(ann.registrationDeadline).toLocaleDateString("en-IN", { day: "numeric", month: "long" })}
                </p>
              </div>
            </div>
          )}
          {ann.venue && (
            <div className="flex items-start gap-2">
              <MapPin size={14} className="text-cyan-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-wide font-medium">Venue</p>
                <p className="text-sm font-medium text-navy-900 dark:text-white">{ann.venue}</p>
              </div>
            </div>
          )}
          {(ann.recipientCount ?? 0) > 0 && (
            <div className="flex items-start gap-2">
              <Users size={14} className="text-violet-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-wide font-medium">Recipients</p>
                <p className="text-sm font-medium text-navy-900 dark:text-white">{ann.recipientCount} students</p>
              </div>
            </div>
          )}
        </div>
        <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-100 dark:border-slate-700">
          {ann.registrationLink && !registered && (
            <button onClick={() => setRegistered(true)} className="btn-primary text-sm py-2 px-5 flex items-center gap-2">
              <BookOpen size={14} /> Register Now
            </button>
          )}
          {registered && (
            <span className="badge-green text-sm py-2 px-4 flex items-center gap-2">
              <CheckCircle2 size={14} /> Registered
            </span>
          )}
          {!acknowledged && (
            <button onClick={() => setAcknowledged(true)} className="btn-secondary text-sm py-2 px-4 flex items-center gap-2">
              <CheckCircle2 size={14} /> Acknowledge
            </button>
          )}
          {ann.registrationLink && (
            <a href={ann.registrationLink} target="_blank" rel="noopener noreferrer"
              className="btn-ghost text-sm py-2 px-4 flex items-center gap-2 border border-slate-200 dark:border-slate-700">
              <ExternalLink size={14} /> Open Link
            </a>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

function AnnouncementCard({ ann, onClick }: { ann: Announcement; onClick: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      className={cn("card p-5 hover:shadow-card-hover transition-all duration-200 cursor-pointer", priorityBorder[ann.priority])}
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex flex-wrap gap-2">
          <span className={cn("badge text-[11px]", catBadge[ann.category] ?? "badge-blue")}>
            <Tag size={9} /> {ann.category}
          </span>
          {ann.priority === "urgent" && <span className="badge-red text-[11px]"><AlertCircle size={9} /> Urgent</span>}
        </div>
        {ann.status === "live" && <span className="badge-green text-[10px] flex-shrink-0">Live</span>}
      </div>
      <h3 className="font-display font-semibold text-navy-900 dark:text-white text-base mb-2 leading-snug">{ann.title}</h3>
      <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-2 mb-4 leading-relaxed">{ann.description}</p>
      <div className="flex flex-wrap gap-4 text-xs text-slate-500">
        {ann.eventDate && (
          <span className="flex items-center gap-1">
            <Calendar size={11} />
            {new Date(ann.eventDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
          </span>
        )}
        {ann.registrationDeadline && (
          <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
            <Clock size={11} /> Due {new Date(ann.registrationDeadline).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
          </span>
        )}
        {ann.createdBy && <span>By {ann.createdBy}</span>}
      </div>
    </motion.div>
  );
}

export default function AllAnnouncements() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<AnnouncementCategory | "all">("all");
  const [selected, setSelected] = useState<Announcement | null>(null);

  const filtered = demoAnnouncements.filter((a) => {
    if (a.status !== "live") return false;
    const matchCat = activeCategory === "all" || a.category === activeCategory;
    const matchSearch = !search || a.title.toLowerCase().includes(search.toLowerCase())
      || a.description.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-navy-900 dark:text-white flex items-center gap-2">
          <Megaphone size={22} className="text-primary-600" /> All Announcements
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          Browse all active announcements relevant to your profile.
        </p>
      </div>

      <div className="relative max-w-lg">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="search" placeholder="Search announcements…" className="input pl-10 py-2.5 text-sm"
          value={search} onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="flex gap-1 bg-surface-subtle dark:bg-navy-800 p-1 rounded-xl overflow-x-auto">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id} onClick={() => setActiveCategory(cat.id)}
            className={cn(
              "px-3 py-1.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap",
              activeCategory === cat.id
                ? "bg-white dark:bg-navy-700 text-navy-900 dark:text-white shadow-sm"
                : "text-slate-500 dark:text-slate-400 hover:text-navy-900 dark:hover:text-white"
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div>
        <p className="text-xs text-slate-400 mb-4">{filtered.length} announcement{filtered.length !== 1 ? "s" : ""} found</p>
        {filtered.length === 0 ? (
          <div className="card p-14 text-center">
            <Megaphone size={36} className="text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <p className="font-semibold text-slate-500">No announcements match your filters</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {filtered.map((ann) => (
              <AnnouncementCard key={ann.id} ann={ann} onClick={() => setSelected(ann)} />
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {selected && <DetailModal ann={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </div>
  );
}
