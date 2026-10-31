import { useState } from "react";
import { motion } from "framer-motion";
import {
  Users, Search, Filter, ChevronRight, Download, Mail,
  GraduationCap, CheckCircle2, XCircle, Clock, SlidersHorizontal,
} from "lucide-react";
import { demoStudents, DEMO_DEPARTMENTS } from "../../lib/demoData";
import { Student, EligibilityStatus } from "../../types";
import { cn } from "../../lib/utils";

function StatusBadge({ status }: { status?: EligibilityStatus }) {
  if (!status) return null;
  const config = {
    eligible: { label: "Active", cls: "badge-green" },
    ineligible: { label: "On Leave", cls: "badge-amber" },
    review_required: { label: "Review", cls: "badge-blue" },
  }[status];
  return <span className={cn("badge text-[11px]", config.cls)}>{config.label}</span>;
}

export default function StudentsPage() {
  const [search, setSearch] = useState("");
  const [dept, setDept] = useState("all");
  const [year, setYear] = useState("all");
  const [selected, setSelected] = useState<Student | null>(null);

  const filtered = demoStudents.filter((s) => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.studentId.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase());
    const matchDept = dept === "all" || s.department === dept;
    const matchYear = year === "all" || String(s.year) === year;
    return matchSearch && matchDept && matchYear;
  });

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-navy-900 dark:text-white flex items-center gap-2">
            <Users size={22} className="text-primary-600" />
            Student Management
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            View and manage all registered students across departments.
          </p>
        </div>
        <button className="btn-secondary text-sm flex items-center gap-2">
          <Download size={14} />
          Export
        </button>
      </div>

      {/* Filters */}
      <div className="card p-4 flex flex-wrap gap-3">
        <div className="flex items-center gap-2 bg-surface-muted dark:bg-navy-800 rounded-xl px-3 py-2 border border-slate-200 dark:border-slate-700 flex-1 min-w-[180px]">
          <Search size={14} className="text-slate-400" />
          <input
            type="search"
            placeholder="Search students…"
            className="bg-transparent text-sm text-navy-900 dark:text-white placeholder:text-slate-400 outline-none flex-1"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="input text-sm py-2 px-3"
          value={dept}
          onChange={(e) => setDept(e.target.value)}
        >
          <option value="all">All Departments</option>
          {DEMO_DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>
        <select
          className="input text-sm py-2 px-3"
          value={year}
          onChange={(e) => setYear(e.target.value)}
        >
          <option value="all">All Years</option>
          {[1, 2, 3, 4].map((y) => <option key={y} value={y}>Year {y}</option>)}
        </select>
      </div>

      {/* Summary */}
      <div className="text-sm text-slate-500 dark:text-slate-400">
        Showing <strong className="text-navy-900 dark:text-white">{filtered.length}</strong> of {demoStudents.length} students
        <span className="text-[10px] ml-2 badge-amber">Demo data</span>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800">
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wide">Student</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wide">Department</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wide">Year</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wide">CGPA</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wide">Status</th>
                <th className="py-3 px-4"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s, i) => (
                <motion.tr
                  key={s.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="border-b border-slate-50 dark:border-slate-800/50 hover:bg-surface-muted dark:hover:bg-navy-800/50 transition-colors cursor-pointer"
                  onClick={() => setSelected(s)}
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-xs font-bold">{s.name[0]}</span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-navy-900 dark:text-white">{s.name}</p>
                        <p className="text-xs text-slate-400">{s.studentId}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">{s.department}</td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">Year {s.year} · Sec {s.section}</td>
                  <td className="py-3 px-4">
                    <span className={cn(
                      "text-sm font-semibold",
                      s.cgpa >= 8 ? "text-emerald-600" : s.cgpa >= 7 ? "text-amber-600" : "text-red-500"
                    )}>
                      {s.cgpa.toFixed(1)}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <StatusBadge status={s.eligibilityStatus} />
                  </td>
                  <td className="py-3 px-4">
                    <ChevronRight size={14} className="text-slate-300 dark:text-slate-600" />
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="p-12 flex flex-col items-center justify-center gap-3 text-center">
            <Users size={28} className="text-slate-300 dark:text-slate-600" />
            <p className="text-slate-500 font-medium">No students match your filters</p>
          </div>
        )}
      </div>

      {/* Student detail drawer */}
      {selected && (
        <div
          className="fixed inset-0 bg-black/40 z-50 flex items-end md:items-center justify-center md:justify-end p-4"
          onClick={() => setSelected(null)}
        >
          <motion.div
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
            className="w-full md:w-96 card p-6 space-y-4 max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-cyan-500 flex items-center justify-center">
                  <span className="text-white text-lg font-bold">{selected.name[0]}</span>
                </div>
                <div>
                  <p className="font-display font-bold text-navy-900 dark:text-white">{selected.name}</p>
                  <p className="text-xs text-slate-400">{selected.studentId}</p>
                </div>
              </div>
              <button onClick={() => setSelected(null)} className="btn-ghost p-1.5">✕</button>
            </div>
            <div className="space-y-2">
              {[
                { label: "Email", value: selected.email },
                { label: "Department", value: selected.department },
                { label: "Year / Section", value: `Year ${selected.year} · Section ${selected.section}` },
                { label: "CGPA", value: selected.cgpa.toFixed(2) },
                { label: "Enrollment", value: selected.enrollmentStatus },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-center py-1.5 border-b border-slate-100 dark:border-slate-800 last:border-0">
                  <span className="text-xs text-slate-400">{label}</span>
                  <span className="text-sm font-medium text-navy-900 dark:text-white capitalize">{value}</span>
                </div>
              ))}
            </div>
            {selected.skills.length > 0 && (
              <div>
                <p className="text-xs text-slate-400 mb-2">Skills</p>
                <div className="flex flex-wrap gap-1.5">
                  {selected.skills.map((sk) => (
                    <span key={sk} className="badge-blue text-[11px]">{sk}</span>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
}
