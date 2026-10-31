import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Plus, Filter, Megaphone, ArrowRight, Tag, Calendar, Users, AlertCircle } from "lucide-react";
import { demoAnnouncements } from "../../lib/demoData";
import { Announcement, AnnouncementStatus } from "../../types";
import { cn } from "../../lib/utils";

const STATUS_TABS: { id: AnnouncementStatus | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "live", label: "Live" },
  { id: "pending_approval", label: "Pending Approval" },
  { id: "draft", label: "Drafts" },
  { id: "expired", label: "Expired" },
];

const priorityBadge: Record<string, string> = {
  urgent: "badge-red",
  high: "badge-amber",
  medium: "badge-blue",
  low: "badge-blue",
};

const statusBadge: Record<string, string> = {
  live: "badge-green",
  pending_approval: "badge-amber",
  draft: "badge-blue",
  expired: "badge-red",
  approved: "badge-green",
  cancelled: "badge-red",
};

export default function FacultyAnnouncements() {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<AnnouncementStatus | "all">("all");

  const filtered = demoAnnouncements.filter((a) => {
    const matchTab = activeTab === "all" || a.status === activeTab;
    const matchSearch = !search || a.title.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-navy-900 dark:text-white flex items-center gap-2">
            <Megaphone size={22} className="text-primary-600" />
            Announcements
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage all your campus announcements.</p>
        </div>
        <Link to="/faculty/circular-studio" className="btn-primary text-sm flex items-center gap-2">
          <Plus size={15} />
          New Announcement
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-surface-subtle dark:bg-navy-800 p-1 rounded-xl w-fit overflow-x-auto">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "px-4 py-1.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap",
              activeTab === tab.id
                ? "bg-white dark:bg-navy-700 text-navy-900 dark:text-white shadow-sm"
                : "text-slate-500 dark:text-slate-400 hover:text-navy-900 dark:hover:text-white"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="flex gap-3">
        <div className="relative flex-1 max-w-md">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            placeholder="Search announcements…"
            className="input pl-9 py-2 text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button className="btn-secondary text-sm py-2 px-4 flex items-center gap-2">
          <Filter size={13} /> Filter
        </button>
      </div>

      {/* Announcement cards */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="card p-12 text-center">
            <Megaphone size={32} className="text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <p className="font-semibold text-slate-500">No announcements found</p>
          </div>
        ) : (
          filtered.map((a, i) => (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="card p-5 hover:shadow-card-hover transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap gap-2 mb-2">
                    <span className={cn("badge text-[11px]", statusBadge[a.status] ?? "badge-blue")}>
                      {a.status.replace("_", " ")}
                    </span>
                    <span className={cn("badge text-[11px]", priorityBadge[a.priority])}>
                      <AlertCircle size={9} /> {a.priority}
                    </span>
                    <span className="badge-blue text-[11px]">
                      <Tag size={9} /> {a.category}
                    </span>
                  </div>
                  <h3 className="font-display font-semibold text-navy-900 dark:text-white text-base mb-1">
                    {a.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-2 mb-3">{a.description}</p>
                  <div className="flex flex-wrap gap-4 text-xs text-slate-500">
                    {a.eventDate && (
                      <span className="flex items-center gap-1">
                        <Calendar size={11} />
                        {new Date(a.eventDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </span>
                    )}
                    {a.recipientCount !== undefined && a.recipientCount > 0 && (
                      <span className="flex items-center gap-1">
                        <Users size={11} />
                        {a.recipientCount} recipients
                      </span>
                    )}
                    <span>By {a.createdBy}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  {a.status === "pending_approval" && (
                    <Link to="/faculty/circular-studio" className="btn-primary text-xs py-1.5 px-3">
                      Review & Approve
                    </Link>
                  )}
                  {a.status === "live" && (
                    <Link to="/faculty/campaigns" className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1">
                      View Campaign <ArrowRight size={10} />
                    </Link>
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
