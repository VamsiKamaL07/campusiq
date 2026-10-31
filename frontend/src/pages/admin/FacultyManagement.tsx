import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Briefcase, Search, Plus, X, Mail, Shield, ChevronRight,
  Building, Check, Trash2, Edit2, User,
} from "lucide-react";
import { DEMO_DEPARTMENTS } from "../../lib/demoData";
import { cn } from "../../lib/utils";

type FacultyRole = "faculty" | "hod" | "super_admin";

interface FacultyMember {
  id: string;
  name: string;
  email: string;
  department: string;
  role: FacultyRole;
  isActive: boolean;
  joinedAt: string;
}

const DEMO_FACULTY: FacultyMember[] = [
  { id: "f-001", name: "Dr. Meenakshi Sharma", email: "meenakshi@college.edu", department: "Computer Science", role: "faculty", isActive: true, joinedAt: "2022-07-01" },
  { id: "f-002", name: "Prof. Rajiv Menon", email: "rajiv@college.edu", department: "Computer Science", role: "hod", isActive: true, joinedAt: "2019-06-15" },
  { id: "f-003", name: "Dr. Anita Rao", email: "anita@college.edu", department: "Information Technology", role: "faculty", isActive: true, joinedAt: "2021-08-01" },
  { id: "f-004", name: "Prof. Suresh Kumar", email: "suresh@college.edu", department: "Electronics", role: "hod", isActive: true, joinedAt: "2018-07-01" },
  { id: "f-005", name: "Dr. Priya Nambiar", email: "priya.n@college.edu", department: "Mechanical", role: "faculty", isActive: false, joinedAt: "2020-07-01" },
  { id: "f-006", name: "Vikram Singh", email: "admin@demo.edu", department: "Administration", role: "super_admin", isActive: true, joinedAt: "2017-01-01" },
];

const roleConfig: Record<FacultyRole, { label: string; cls: string }> = {
  faculty: { label: "Faculty", cls: "badge-blue" },
  hod: { label: "HoD", cls: "badge-purple" },
  super_admin: { label: "Admin", cls: "badge-amber" },
};

interface InviteModalProps {
  onClose: () => void;
  onInvite: (member: Omit<FacultyMember, "id" | "joinedAt" | "isActive">) => void;
}

function InviteModal({ onClose, onInvite }: InviteModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState(DEMO_DEPARTMENTS[0]);
  const [role, setRole] = useState<FacultyRole>("faculty");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onInvite({ name, email, department, role });
    setSent(true);
    setTimeout(onClose, 1500);
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
          <h2 className="font-display font-bold text-lg text-navy-900 dark:text-white">Invite Faculty Member</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-surface-subtle dark:hover:bg-navy-700">
            <X size={16} className="text-slate-500" />
          </button>
        </div>

        {sent ? (
          <div className="flex flex-col items-center gap-3 py-8">
            <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
              <Check size={24} className="text-emerald-600" />
            </div>
            <p className="font-semibold text-navy-900 dark:text-white">Invitation sent!</p>
            <p className="text-sm text-slate-400">An email has been sent to {email}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">Full Name</label>
              <input
                required value={name} onChange={(e) => setName(e.target.value)}
                placeholder="Dr. Jane Doe"
                className="input w-full text-sm py-2.5"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">Email Address</label>
              <input
                required type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="faculty@college.edu"
                className="input w-full text-sm py-2.5"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">Department</label>
              <select value={department} onChange={(e) => setDepartment(e.target.value)} className="input w-full text-sm py-2.5">
                {DEMO_DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
                <option value="Administration">Administration</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">Role</label>
              <select value={role} onChange={(e) => setRole(e.target.value as FacultyRole)} className="input w-full text-sm py-2.5">
                <option value="faculty">Faculty</option>
                <option value="hod">Head of Department (HoD)</option>
                <option value="super_admin">Administrator</option>
              </select>
            </div>
            <div className="flex gap-2 pt-2">
              <button type="button" onClick={onClose} className="btn-secondary flex-1 text-sm py-2.5">Cancel</button>
              <button type="submit" className="btn-primary flex-1 text-sm py-2.5 flex items-center justify-center gap-2">
                <Mail size={14} /> Send Invite
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </motion.div>
  );
}

export default function FacultyManagement() {
  const [faculty, setFaculty] = useState<FacultyMember[]>(DEMO_FACULTY);
  const [search, setSearch] = useState("");
  const [dept, setDept] = useState("all");
  const [showInvite, setShowInvite] = useState(false);
  const [selected, setSelected] = useState<FacultyMember | null>(null);

  const filtered = faculty.filter((f) => {
    const matchSearch = f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.email.toLowerCase().includes(search.toLowerCase());
    const matchDept = dept === "all" || f.department === dept;
    return matchSearch && matchDept;
  });

  const handleInvite = (member: Omit<FacultyMember, "id" | "joinedAt" | "isActive">) => {
    const newMember: FacultyMember = {
      ...member,
      id: `f-${Date.now()}`,
      joinedAt: new Date().toISOString().split("T")[0],
      isActive: true,
    };
    setFaculty((prev) => [newMember, ...prev]);
  };

  const toggleActive = (id: string) => {
    setFaculty((prev) => prev.map((f) => f.id === id ? { ...f, isActive: !f.isActive } : f));
    if (selected?.id === id) setSelected((s) => s ? { ...s, isActive: !s.isActive } : null);
  };

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-navy-900 dark:text-white flex items-center gap-2">
            <Briefcase size={22} className="text-primary-600" />
            Faculty Management
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Manage faculty accounts, roles, and access levels.
          </p>
        </div>
        <button
          onClick={() => setShowInvite(true)}
          className="btn-primary text-sm flex items-center gap-2"
        >
          <Plus size={15} /> Invite Faculty
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Faculty", value: faculty.length, color: "from-primary-500 to-primary-600" },
          { label: "Active", value: faculty.filter((f) => f.isActive).length, color: "from-emerald-500 to-green-600" },
          { label: "HoDs", value: faculty.filter((f) => f.role === "hod").length, color: "from-violet-500 to-purple-600" },
          { label: "Admins", value: faculty.filter((f) => f.role === "super_admin").length, color: "from-amber-500 to-orange-500" },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="card p-4">
            <div className={cn("w-8 h-8 rounded-lg bg-gradient-to-br flex items-center justify-center mb-2", s.color)}>
              <Briefcase size={14} className="text-white" />
            </div>
            <p className="font-display text-2xl font-bold text-navy-900 dark:text-white">{s.value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="card p-4 flex flex-wrap gap-3">
        <div className="flex items-center gap-2 bg-surface-muted dark:bg-navy-800 rounded-xl px-3 py-2 border border-slate-200 dark:border-slate-700 flex-1 min-w-[180px]">
          <Search size={14} className="text-slate-400" />
          <input
            type="search"
            placeholder="Search faculty…"
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
          <option value="Administration">Administration</option>
        </select>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800">
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wide">Name</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wide">Department</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wide">Role</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wide">Status</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wide">Joined</th>
                <th className="py-3 px-4" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((f, i) => (
                <motion.tr
                  key={f.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="border-b border-slate-50 dark:border-slate-800/50 hover:bg-surface-muted dark:hover:bg-navy-800/50 transition-colors cursor-pointer"
                  onClick={() => setSelected(f)}
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-xs font-bold">{f.name[0]}</span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-navy-900 dark:text-white">{f.name}</p>
                        <p className="text-xs text-slate-400">{f.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">{f.department}</td>
                  <td className="py-3 px-4">
                    <span className={cn("badge text-[11px]", roleConfig[f.role].cls)}>
                      <Shield size={9} /> {roleConfig[f.role].label}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={cn("badge text-[11px]", f.isActive ? "badge-green" : "badge-amber")}>
                      {f.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-slate-400">
                    {new Date(f.joinedAt).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}
                  </td>
                  <td className="py-3 px-4">
                    <ChevronRight size={14} className="text-slate-300 dark:text-slate-600" />
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="p-12 flex flex-col items-center justify-center gap-3 text-center">
              <Briefcase size={28} className="text-slate-300 dark:text-slate-600" />
              <p className="text-slate-500 font-medium">No faculty match your filters</p>
            </div>
          )}
        </div>
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
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                    <span className="text-white text-lg font-bold">{selected.name[0]}</span>
                  </div>
                  <div>
                    <p className="font-display font-bold text-navy-900 dark:text-white">{selected.name}</p>
                    <p className="text-xs text-slate-400">{selected.email}</p>
                  </div>
                </div>
                <button onClick={() => setSelected(null)} className="btn-ghost p-1.5">✕</button>
              </div>
              <div className="space-y-2">
                {[
                  { label: "Department", value: selected.department },
                  { label: "Role", value: roleConfig[selected.role].label },
                  { label: "Status", value: selected.isActive ? "Active" : "Inactive" },
                  { label: "Joined", value: new Date(selected.joinedAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between items-center py-1.5 border-b border-slate-100 dark:border-slate-800 last:border-0">
                    <span className="text-xs text-slate-400">{label}</span>
                    <span className="text-sm font-medium text-navy-900 dark:text-white">{value}</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => toggleActive(selected.id)}
                  className={cn("btn-secondary flex-1 text-sm py-2 flex items-center justify-center gap-2", !selected.isActive && "border-emerald-300 text-emerald-600 hover:bg-emerald-50")}
                >
                  {selected.isActive ? <><Trash2 size={13} /> Deactivate</> : <><Check size={13} /> Activate</>}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showInvite && (
          <InviteModal onClose={() => setShowInvite(false)} onInvite={handleInvite} />
        )}
      </AnimatePresence>
    </div>
  );
}
