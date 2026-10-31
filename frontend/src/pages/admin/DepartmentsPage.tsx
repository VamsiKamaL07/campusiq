import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2, Plus, Users, BookOpen, GraduationCap, X, Edit2, Check, Trash2,
} from "lucide-react";
import { DEMO_DEPARTMENTS } from "../../lib/demoData";
import { demoStudents } from "../../lib/demoData";
import { cn } from "../../lib/utils";

interface Department {
  id: string;
  name: string;
  code: string;
  hod: string;
  studentCount: number;
  facultyCount: number;
  isActive: boolean;
}

const INITIAL_DEPARTMENTS: Department[] = [
  { id: "dept-1", name: "Computer Science", code: "CSE", hod: "Prof. Rajiv Menon", studentCount: 420, facultyCount: 18, isActive: true },
  { id: "dept-2", name: "Information Technology", code: "IT", hod: "Dr. Anita Rao", studentCount: 360, facultyCount: 14, isActive: true },
  { id: "dept-3", name: "Electronics", code: "ECE", hod: "Prof. Suresh Kumar", studentCount: 380, facultyCount: 16, isActive: true },
  { id: "dept-4", name: "Mechanical", code: "ME", hod: "Dr. Priya Nambiar", studentCount: 340, facultyCount: 15, isActive: false },
  { id: "dept-5", name: "Civil", code: "CE", hod: "Prof. Arun Pillai", studentCount: 310, facultyCount: 13, isActive: true },
  { id: "dept-6", name: "Electrical", code: "EE", hod: "Dr. Meera Singh", studentCount: 290, facultyCount: 12, isActive: true },
];

function AddDeptModal({ onClose, onAdd }: { onClose: () => void; onAdd: (d: Omit<Department, "id" | "studentCount" | "facultyCount">) => void }) {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [hod, setHod] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [done, setDone] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({ name, code: code.toUpperCase(), hod, isActive });
    setDone(true);
    setTimeout(onClose, 1200);
  };

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
        className="card w-full max-w-md p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display font-bold text-lg text-navy-900 dark:text-white">Add Department</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-surface-subtle dark:hover:bg-navy-700">
            <X size={16} className="text-slate-500" />
          </button>
        </div>
        {done ? (
          <div className="flex flex-col items-center gap-3 py-8">
            <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
              <Check size={24} className="text-emerald-600" />
            </div>
            <p className="font-semibold text-navy-900 dark:text-white">Department added!</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">Department Name</label>
              <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Computer Science" className="input w-full text-sm py-2.5" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">Short Code</label>
              <input required value={code} onChange={(e) => setCode(e.target.value)} placeholder="CSE" className="input w-full text-sm py-2.5 uppercase" maxLength={6} />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">Head of Department</label>
              <input value={hod} onChange={(e) => setHod(e.target.value)} placeholder="Dr. Jane Doe" className="input w-full text-sm py-2.5" />
            </div>
            <div className="flex gap-2 pt-2">
              <button type="button" onClick={onClose} className="btn-secondary flex-1 text-sm py-2.5">Cancel</button>
              <button type="submit" className="btn-primary flex-1 text-sm py-2.5">Add Department</button>
            </div>
          </form>
        )}
      </motion.div>
    </motion.div>
  );
}

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>(INITIAL_DEPARTMENTS);
  const [showAdd, setShowAdd] = useState(false);
  const [selected, setSelected] = useState<Department | null>(null);

  const handleAdd = (d: Omit<Department, "id" | "studentCount" | "facultyCount">) => {
    setDepartments((prev) => [
      ...prev,
      { ...d, id: `dept-${Date.now()}`, studentCount: 0, facultyCount: 0 },
    ]);
  };

  const toggleActive = (id: string) => {
    setDepartments((prev) => prev.map((d) => d.id === id ? { ...d, isActive: !d.isActive } : d));
    if (selected?.id === id) setSelected((s) => s ? { ...s, isActive: !s.isActive } : null);
  };

  const totalStudents = departments.reduce((a, d) => a + d.studentCount, 0);
  const totalFaculty = departments.reduce((a, d) => a + d.facultyCount, 0);

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-navy-900 dark:text-white flex items-center gap-2">
            <Building2 size={22} className="text-primary-600" />
            Departments
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Configure departments and their institutional settings.
          </p>
        </div>
        <button onClick={() => setShowAdd(true)} className="btn-primary text-sm flex items-center gap-2">
          <Plus size={15} /> Add Department
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Departments", value: departments.length, color: "from-primary-500 to-primary-600" },
          { label: "Active", value: departments.filter((d) => d.isActive).length, color: "from-emerald-500 to-green-600" },
          { label: "Total Students", value: totalStudents.toLocaleString(), color: "from-cyan-500 to-sky-600" },
          { label: "Total Faculty", value: totalFaculty, color: "from-violet-500 to-purple-600" },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="card p-4">
            <div className={cn("w-8 h-8 rounded-lg bg-gradient-to-br flex items-center justify-center mb-2", s.color)}>
              <Building2 size={14} className="text-white" />
            </div>
            <p className="font-display text-2xl font-bold text-navy-900 dark:text-white">{s.value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Department Cards */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {departments.map((dept, i) => (
          <motion.div
            key={dept.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className={cn(
              "card p-5 cursor-pointer hover:shadow-card-hover transition-all duration-200",
              !dept.isActive && "opacity-60"
            )}
            onClick={() => setSelected(dept)}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs font-bold">{dept.code}</span>
                </div>
                <div>
                  <p className="font-display font-semibold text-navy-900 dark:text-white text-sm">{dept.name}</p>
                  <p className="text-xs text-slate-400">{dept.hod || "No HoD assigned"}</p>
                </div>
              </div>
              <span className={cn("badge text-[10px] flex-shrink-0", dept.isActive ? "badge-green" : "badge-amber")}>
                {dept.isActive ? "Active" : "Inactive"}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Users size={12} className="text-primary-500" />
                <span>{dept.studentCount.toLocaleString()} students</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <BookOpen size={12} className="text-violet-500" />
                <span>{dept.facultyCount} faculty</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Detail Drawer */}
      <AnimatePresence>
        {selected && (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-end md:items-center justify-center md:justify-end p-4" onClick={() => setSelected(null)}>
            <motion.div
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 300, opacity: 0 }}
              className="w-full md:w-96 card p-6 space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-cyan-500 flex items-center justify-center">
                    <span className="text-white font-bold">{selected.code}</span>
                  </div>
                  <div>
                    <p className="font-display font-bold text-navy-900 dark:text-white">{selected.name}</p>
                    <span className={cn("badge text-[10px] mt-1", selected.isActive ? "badge-green" : "badge-amber")}>
                      {selected.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
                <button onClick={() => setSelected(null)} className="btn-ghost p-1.5">✕</button>
              </div>
              <div className="space-y-2">
                {[
                  { label: "Short Code", value: selected.code },
                  { label: "Head of Department", value: selected.hod || "—" },
                  { label: "Total Students", value: selected.studentCount.toLocaleString() },
                  { label: "Total Faculty", value: String(selected.facultyCount) },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between items-center py-1.5 border-b border-slate-100 dark:border-slate-800 last:border-0">
                    <span className="text-xs text-slate-400">{label}</span>
                    <span className="text-sm font-medium text-navy-900 dark:text-white">{value}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => toggleActive(selected.id)}
                className={cn("btn-secondary w-full text-sm py-2 flex items-center justify-center gap-2", !selected.isActive && "border-emerald-300 text-emerald-600")}
              >
                {selected.isActive ? <><Trash2 size={13} /> Deactivate Department</> : <><Check size={13} /> Activate Department</>}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAdd && <AddDeptModal onClose={() => setShowAdd(false)} onAdd={handleAdd} />}
      </AnimatePresence>
    </div>
  );
}
