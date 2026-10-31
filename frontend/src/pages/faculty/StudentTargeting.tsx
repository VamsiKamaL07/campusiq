import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Target,
  Users,
  Filter,
  Search,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ChevronRight,
  Info,
  ChevronLeft,
  ChevronDown,
} from "lucide-react";
import { demoStudents, DEMO_DEPARTMENTS, DEMO_SKILLS } from "../../lib/demoData";
import { EligibilityStatus, Student } from "../../types";
import { cn } from "../../lib/utils";

const STATUS_CONFIG: Record<EligibilityStatus, { icon: React.ElementType; label: string; className: string }> = {
  eligible: { icon: CheckCircle2, label: "Eligible", className: "badge-green" },
  ineligible: { icon: XCircle, label: "Ineligible", className: "badge-red" },
  review_required: { icon: AlertCircle, label: "Review", className: "badge-amber" },
};

interface FilterState {
  departments: string[];
  years: number[];
  minCgpa: number;
  skills: string[];
}

export default function StudentTargeting() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<FilterState>({
    departments: ["Computer Science", "Information Technology", "Electronics"],
    years: [3, 4],
    minCgpa: 7.0,
    skills: [],
  });
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [approved, setApproved] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const PAGE_SIZE = 6;

  const filteredStudents = demoStudents.filter((s) => {
    const matchDept = filters.departments.length === 0 || filters.departments.includes(s.department);
    const matchYear = filters.years.length === 0 || filters.years.includes(s.year);
    const matchCgpa = s.cgpa >= filters.minCgpa;
    const matchSearch =
      !search ||
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.studentId.toLowerCase().includes(search.toLowerCase());
    return matchDept && matchYear && matchCgpa && matchSearch;
  });

  const eligible = filteredStudents.filter((s) => s.eligibilityStatus === "eligible").length;
  const ineligible = filteredStudents.filter((s) => s.eligibilityStatus === "ineligible").length;
  const review = filteredStudents.filter((s) => s.eligibilityStatus === "review_required").length;
  const total = demoStudents.length;

  const paged = filteredStudents.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const totalPages = Math.ceil(filteredStudents.length / PAGE_SIZE);

  const toggleDept = (d: string) =>
    setFilters((f) => ({
      ...f,
      departments: f.departments.includes(d) ? f.departments.filter((x) => x !== d) : [...f.departments, d],
    }));

  const toggleYear = (y: number) =>
    setFilters((f) => ({
      ...f,
      years: f.years.includes(y) ? f.years.filter((x) => x !== y) : [...f.years, y],
    }));

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-bold text-navy-900 dark:text-white flex items-center gap-2">
          <Target size={22} className="text-primary-600" />
          Intelligent Student Targeting
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          Deliver the right information to the students who need it.
        </p>
      </div>

      <div className="grid lg:grid-cols-[280px_1fr] gap-6">
        {/* ─── Filter sidebar ─── */}
        <div className="space-y-4">
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-4">
              <Filter size={14} className="text-primary-600" />
              <h3 className="font-display font-semibold text-navy-900 dark:text-white text-sm">Eligibility Filters</h3>
            </div>

            {/* Departments */}
            <div className="mb-4">
              <label className="label">Departments</label>
              <div className="space-y-1.5">
                {DEMO_DEPARTMENTS.map((d) => (
                  <label key={d} className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={filters.departments.includes(d)}
                      onChange={() => toggleDept(d)}
                      className="w-3.5 h-3.5 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm text-slate-600 dark:text-slate-400 group-hover:text-navy-900 dark:group-hover:text-white transition-colors">
                      {d}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Academic Year */}
            <div className="mb-4">
              <label className="label">Academic Year</label>
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 4].map((y) => (
                  <button
                    key={y}
                    onClick={() => toggleYear(y)}
                    className={cn(
                      "px-3 py-1 rounded-lg text-sm font-medium border transition-all",
                      filters.years.includes(y)
                        ? "bg-primary-600 text-white border-primary-600"
                        : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-primary-400"
                    )}
                  >
                    Year {y}
                  </button>
                ))}
              </div>
            </div>

            {/* Min CGPA */}
            <div className="mb-4">
              <label className="label">Minimum CGPA: {filters.minCgpa.toFixed(1)}</label>
              <input
                type="range"
                min="0"
                max="10"
                step="0.1"
                value={filters.minCgpa}
                onChange={(e) => setFilters((f) => ({ ...f, minCgpa: parseFloat(e.target.value) }))}
                className="w-full accent-primary-600"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-1">
                <span>0.0</span>
                <span>10.0</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-primary-50 dark:bg-primary-900/20 border border-primary-100 dark:border-primary-900/40">
              <p className="text-xs text-primary-700 dark:text-primary-300 font-medium flex items-start gap-1.5">
                <Info size={12} className="mt-0.5 flex-shrink-0" />
                AI has proposed these eligibility rules based on the circular. You can edit them before approval.
              </p>
            </div>
          </div>
        </div>

        {/* ─── Main content ─── */}
        <div className="space-y-4">
          {/* Summary cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "Eligible", value: eligible, className: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800" },
              { label: "Ineligible", value: ineligible, className: "text-red-600", bg: "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800" },
              { label: "Requires Review", value: review, className: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800" },
              { label: "Total Evaluated", value: total, className: "text-navy-900 dark:text-white", bg: "bg-white dark:bg-navy-800 border-slate-200 dark:border-slate-700" },
            ].map((item) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn("rounded-2xl border p-4", item.bg)}
              >
                <p className={cn("font-display text-2xl font-bold", item.className)}>{item.value}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{item.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Table */}
          <div className="card overflow-hidden">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
              <div className="relative flex-1 max-w-xs">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="search"
                  placeholder="Search students…"
                  className="input pl-9 py-2 text-sm"
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                />
              </div>
              <span className="text-xs text-slate-400">{filteredStudents.length} students</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800">
                    {["Student ID", "Name", "Department", "Year", "CGPA", "Status"].map((col) => (
                      <th key={col} className="text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide px-4 py-3">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paged.map((student: Student) => {
                    const status = student.eligibilityStatus;
                    const cfg = status ? STATUS_CONFIG[status] : null;
                    const Icon = cfg?.icon;
                    return (
                      <tr key={student.id} className="border-b border-slate-50 dark:border-slate-800/50 hover:bg-surface-muted dark:hover:bg-navy-800/50 transition-colors">
                        <td className="px-4 py-3 text-xs font-mono text-slate-500">{student.studentId}</td>
                        <td className="px-4 py-3">
                          <p className="text-sm font-medium text-navy-900 dark:text-white">{student.name}</p>
                          <p className="text-xs text-slate-400">{student.email}</p>
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">{student.department}</td>
                        <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">Year {student.year}</td>
                        <td className="px-4 py-3">
                          <span className={cn(
                            "text-sm font-semibold",
                            student.cgpa >= 8.0 ? "text-emerald-600" :
                            student.cgpa >= 7.0 ? "text-amber-600" : "text-red-600"
                          )}>
                            {student.cgpa.toFixed(1)}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {cfg && Icon && (
                            <span className={cn("badge text-[11px] flex items-center gap-1 w-fit", cfg.className)}>
                              <Icon size={10} />
                              {cfg.label}
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(p => p - 1)}
                  className="flex items-center gap-1 text-sm text-slate-500 hover:text-primary-600 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={14} /> Previous
                </button>
                <span className="text-xs text-slate-400">Page {page} of {totalPages}</span>
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage(p => p + 1)}
                  className="flex items-center gap-1 text-sm text-slate-500 hover:text-primary-600 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Next <ChevronRight size={14} />
                </button>
              </div>
            )}
          </div>

          {/* Approval card */}
          <div className={cn(
            "card p-5 border-2 transition-all",
            approved ? "border-emerald-400 bg-emerald-50 dark:bg-emerald-900/10" : "border-primary-200 dark:border-primary-800"
          )}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-display font-semibold text-navy-900 dark:text-white mb-1">
                  {approved ? "✓ Recipient Selection Approved" : "Approve Recipient Selection"}
                </h3>
                <div className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  <p>Eligible recipients: <strong className="text-emerald-600">{eligible}</strong></p>
                  <p>Requiring review: <strong className="text-amber-600">{review}</strong></p>
                  <p>Excluded: <strong className="text-red-600">{ineligible}</strong></p>
                </div>
              </div>
              {!approved ? (
                <button
                  onClick={() => setShowConfirm(true)}
                  className="btn-primary text-sm py-2.5 px-6 flex-shrink-0"
                >
                  Approve Selection
                </button>
              ) : (
                <button
                  onClick={() => navigate("/faculty/campaigns")}
                  className="btn-primary text-sm py-2.5 px-6 flex items-center gap-1.5 flex-shrink-0"
                >
                  Continue to Campaigns
                  <ChevronRight size={14} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Confirm modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card p-6 w-full max-w-md shadow-2xl"
          >
            <h3 className="font-display font-bold text-navy-900 dark:text-white text-lg mb-3">
              Confirm Recipient Selection
            </h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">
              You are approving <strong>{eligible} eligible students</strong> to receive this announcement. {review > 0 && `${review} students are flagged for review.`}
            </p>
            <div className="flex gap-3">
              <button onClick={() => setShowConfirm(false)} className="btn-secondary flex-1 text-sm py-2.5">Cancel</button>
              <button
                onClick={() => { setApproved(true); setShowConfirm(false); }}
                className="btn-primary flex-1 text-sm py-2.5"
              >
                Confirm Approval
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
