import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Users,
  Building,
  Briefcase,
  Import,
  Activity,
  Shield,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { ImportRecord } from "../../types";

// ─── Mock import data ─────────────────────────────────────────────────────────
const MOCK_IMPORT: ImportRecord[] = [
  { studentId: "CSE24001", name: "Aarav Sharma", email: "aarav@college.edu", department: "Computer Science", year: 1, section: "A", status: "valid" },
  { studentId: "CSE24002", name: "Riya Gupta", email: "riya@college.edu", department: "Computer Science", year: 1, section: "A", status: "valid" },
  { studentId: "CSE21001", name: "Arjun Mehta", email: "arjun@college.edu", department: "Computer Science", year: 3, section: "A", status: "duplicate", errors: ["Student ID already exists"] },
  { studentId: "IT24001", name: "Kiran Patel", email: "", department: "IT", year: 1, section: "B", status: "invalid", errors: ["Email is required"] },
  { studentId: "ECE24001", name: "Meera Nair", email: "meera@college.edu", department: "Electronics", year: 1, section: "A", status: "valid" },
];

type ImportStep = 1 | 2 | 3 | 4 | 5 | 6;

function StatCard({ icon: Icon, label, value, color, delay }: { icon: React.ElementType; label: string; value: string | number; color: string; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 15 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay }} className="card p-5">
      <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-3", color)}>
        <Icon size={18} className="text-white" />
      </div>
      <p className="font-display text-2xl font-bold text-navy-900 dark:text-white">{value}</p>
      <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{label}</p>
    </motion.div>
  );
}

function ImportStatusBadge({ status }: { status: ImportRecord["status"] }) {
  const config = {
    valid: { label: "Valid", className: "badge-green", icon: CheckCircle2 },
    invalid: { label: "Invalid", className: "badge-red", icon: AlertCircle },
    duplicate: { label: "Duplicate", className: "badge-amber", icon: AlertCircle },
    updated: { label: "Updated", className: "badge-blue", icon: CheckCircle2 },
  }[status];
  const Icon = config.icon;
  return (
    <span className={cn("badge text-[11px] flex items-center gap-1", config.className)}>
      <Icon size={10} />
      {config.label}
    </span>
  );
}

export default function AdminDashboard() {
  const [importStep, setImportStep] = useState<ImportStep>(1);
  const [importData] = useState<ImportRecord[]>(MOCK_IMPORT);
  const [confirmed, setConfirmed] = useState(false);

  const valid = importData.filter((r) => r.status === "valid").length;
  const invalid = importData.filter((r) => r.status === "invalid").length;
  const duplicate = importData.filter((r) => r.status === "duplicate").length;

  const IMPORT_STEPS = ["Upload", "Map Columns", "Validate", "Preview", "Confirm", "Results"];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-bold text-navy-900 dark:text-white flex items-center gap-2">
          <Shield size={22} className="text-primary-600" />
          Administrator Dashboard
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage institutions, users, and platform settings.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={Users} label="Total Students" value="2,840" color="bg-gradient-to-br from-primary-500 to-primary-600" delay={0} />
        <StatCard icon={Briefcase} label="Faculty Members" value="48" color="bg-gradient-to-br from-cyan-500 to-cyan-600" delay={0.05} />
        <StatCard icon={Building} label="Departments" value="6" color="bg-gradient-to-br from-violet-500 to-violet-600" delay={0.1} />
        <StatCard icon={Activity} label="Platform Events" value="1,204" color="bg-gradient-to-br from-emerald-500 to-green-600" delay={0.15} />
      </div>

      {/* Audit + Import */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Audit Events */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold text-navy-900 dark:text-white">Recent Audit Events</h3>
            <span className="text-xs text-slate-400">Last 24h</span>
          </div>
          <div className="space-y-3">
            {[
              { actor: "Dr. Meenakshi Sharma", action: "Approved announcement", target: "TCS Drive 2024", time: "2m ago", type: "success" },
              { actor: "Admin System", action: "Sent 312 notifications", target: "Multi-channel campaign", time: "45m ago", type: "info" },
              { actor: "Vikram Singh", action: "Updated provider settings", target: "Firebase Config", time: "2h ago", type: "warning" },
              { actor: "Prof. Rajiv Menon", action: "Created announcement", target: "GATE Workshop", time: "4h ago", type: "success" },
            ].map((event, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className={cn(
                  "w-2 h-2 rounded-full mt-1.5 flex-shrink-0",
                  event.type === "success" ? "bg-emerald-500" : event.type === "warning" ? "bg-amber-500" : "bg-primary-500"
                )} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-navy-900 dark:text-white">
                    <span className="font-medium">{event.actor}</span> — {event.action}
                  </p>
                  <p className="text-xs text-slate-400">{event.target} · {event.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Student Import Wizard */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold text-navy-900 dark:text-white">Student Import Wizard</h3>
            <Import size={16} className="text-primary-600" />
          </div>

          {/* Step indicator */}
          <div className="flex items-center gap-1 mb-5 overflow-x-auto pb-1">
            {IMPORT_STEPS.map((step, i) => {
              const stepNum = i + 1;
              const isActive = importStep === stepNum;
              const isDone = importStep > stepNum;
              return (
                <div key={step} className="flex items-center gap-1 flex-shrink-0">
                  <div className={cn(
                    "flex items-center justify-center w-6 h-6 rounded-full text-[10px] font-bold transition-all",
                    isDone ? "bg-emerald-500 text-white" : isActive ? "bg-primary-600 text-white" : "bg-slate-200 dark:bg-slate-700 text-slate-400"
                  )}>
                    {isDone ? "✓" : stepNum}
                  </div>
                  <span className={cn("text-[10px] hidden sm:block", isActive ? "text-primary-600 font-medium" : "text-slate-400")}>{step}</span>
                  {i < 5 && <div className="w-3 h-px bg-slate-200 dark:bg-slate-700" />}
                </div>
              );
            })}
          </div>

          {/* Step content */}
          {importStep === 1 && (
            <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-6 text-center">
              <Import size={28} className="text-slate-300 dark:text-slate-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Upload your Excel or CSV file</p>
              <p className="text-xs text-slate-400 mt-1">Supports .csv, .xlsx, .xls</p>
              <button onClick={() => setImportStep(2)} className="btn-primary text-xs py-2 px-4 mt-4">
                Choose File (Demo)
              </button>
            </div>
          )}

          {importStep === 2 && (
            <div className="space-y-3">
              <p className="text-sm text-slate-600 dark:text-slate-400">Map your CSV columns to student fields:</p>
              {[["Student ID", "student_id"], ["Full Name", "name"], ["Email", "email"], ["Department", "dept"], ["Year", "year"]].map(([field, col]) => (
                <div key={field} className="flex items-center gap-3">
                  <span className="text-xs font-medium text-slate-600 dark:text-slate-400 w-28 flex-shrink-0">{field}</span>
                  <select className="input text-xs py-1.5 flex-1">
                    <option value={col}>{col}</option>
                  </select>
                </div>
              ))}
              <button onClick={() => setImportStep(3)} className="btn-primary text-xs py-2 px-4 w-full flex items-center justify-center gap-1.5">
                Validate Records <ArrowRight size={12} />
              </button>
            </div>
          )}

          {importStep >= 3 && !confirmed && (
            <div>
              {/* Summary */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="text-center p-2 rounded-xl bg-emerald-50 dark:bg-emerald-900/20">
                  <p className="font-bold text-emerald-600">{valid}</p>
                  <p className="text-[10px] text-slate-500">Valid</p>
                </div>
                <div className="text-center p-2 rounded-xl bg-red-50 dark:bg-red-900/20">
                  <p className="font-bold text-red-600">{invalid}</p>
                  <p className="text-[10px] text-slate-500">Invalid</p>
                </div>
                <div className="text-center p-2 rounded-xl bg-amber-50 dark:bg-amber-900/20">
                  <p className="font-bold text-amber-600">{duplicate}</p>
                  <p className="text-[10px] text-slate-500">Duplicate</p>
                </div>
              </div>
              {/* Preview table */}
              <div className="overflow-x-auto -mx-1">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800">
                      <th className="text-left py-1.5 px-2 text-slate-400 font-medium">ID</th>
                      <th className="text-left py-1.5 px-2 text-slate-400 font-medium">Name</th>
                      <th className="text-left py-1.5 px-2 text-slate-400 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {importData.map((r) => (
                      <tr key={r.studentId} className="border-b border-slate-50 dark:border-slate-800/50">
                        <td className="py-1.5 px-2 font-mono text-slate-500">{r.studentId}</td>
                        <td className="py-1.5 px-2 text-navy-900 dark:text-white">{r.name}</td>
                        <td className="py-1.5 px-2"><ImportStatusBadge status={r.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <button
                onClick={() => { setConfirmed(true); setImportStep(6); }}
                className="btn-primary text-xs py-2 px-4 w-full flex items-center justify-center gap-1.5 mt-3"
              >
                Confirm Import ({valid} records) <ArrowRight size={12} />
              </button>
            </div>
          )}

          {confirmed && (
            <div className="text-center py-4">
              <CheckCircle2 size={32} className="text-emerald-500 mx-auto mb-2" />
              <p className="font-semibold text-navy-900 dark:text-white">Import Completed</p>
              <p className="text-xs text-slate-500 mt-1">{valid} records imported successfully.</p>
              <button onClick={() => { setImportStep(1); setConfirmed(false); }} className="btn-secondary text-xs py-2 px-4 mt-3">
                Start New Import
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Provider Config Cards */}
      <div>
        <h3 className="font-display font-semibold text-navy-900 dark:text-white mb-4">Communication Providers</h3>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { name: "Firebase", description: "Push notifications & authentication", status: "configured", color: "from-amber-400 to-orange-500" },
            { name: "Resend", description: "Transactional email delivery", status: "not_configured", color: "from-slate-400 to-slate-500" },
            { name: "WhatsApp Cloud API", description: "WhatsApp Business messaging", status: "not_configured", color: "from-emerald-400 to-green-500" },
          ].map((provider) => (
            <div key={provider.name} className="card p-5">
              <div className="flex items-center justify-between mb-3">
                <div className={cn("w-9 h-9 rounded-xl bg-gradient-to-br flex items-center justify-center text-white font-bold text-sm", provider.color)}>
                  {provider.name[0]}
                </div>
                <span className={cn(provider.status === "configured" ? "badge-green" : "badge-amber", "text-[10px]")}>
                  {provider.status === "configured" ? "Configured" : "Setup needed"}
                </span>
              </div>
              <p className="font-semibold text-sm text-navy-900 dark:text-white mb-1">{provider.name}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">{provider.description}</p>
              <button className="btn-ghost text-xs py-1.5 px-3 border border-slate-200 dark:border-slate-700 w-full">
                {provider.status === "configured" ? "Edit Config" : "Configure"}
              </button>
              <p className="text-[10px] text-slate-400 mt-2 text-center">
                Credentials managed via secure backend environment
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
