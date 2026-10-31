import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload, FileSpreadsheet, CheckCircle2, XCircle, AlertTriangle,
  Download, Eye, ChevronRight, Loader2, Users, RefreshCw,
} from "lucide-react";
import { DEMO_DEPARTMENTS } from "../../lib/demoData";
import { ImportRecord } from "../../types";
import { cn } from "../../lib/utils";

const DEMO_PREVIEW: ImportRecord[] = [
  { studentId: "CSE24001", name: "Aisha Khan", email: "aisha.khan@college.edu", department: "Computer Science", year: 1, section: "A", status: "valid" },
  { studentId: "CSE24002", name: "Rohan Das", email: "rohan.das@college.edu", department: "Computer Science", year: 1, section: "A", status: "valid" },
  { studentId: "IT24001", name: "Meera Pillai", email: "meera.pillai@college.edu", department: "Information Technology", year: 1, section: "B", status: "valid" },
  { studentId: "CSE21001", name: "Arjun Mehta", email: "arjun.mehta@college.edu", department: "Computer Science", year: 3, section: "A", status: "duplicate", errors: ["Student ID already exists — will update record"] },
  { studentId: "ECE24001", name: "Siddharth Roy", email: "invalid-email", department: "Electronics", year: 1, section: "A", status: "invalid", errors: ["Invalid email address"] },
  { studentId: "ME24001", name: "Kavita Sharma", email: "kavita.sharma@college.edu", department: "Mechanical", year: 1, section: "A", status: "valid" },
];

type ImportStep = "idle" | "previewing" | "importing" | "done";

const statusIcon: Record<string, JSX.Element> = {
  valid: <CheckCircle2 size={14} className="text-emerald-500" />,
  duplicate: <AlertTriangle size={14} className="text-amber-500" />,
  invalid: <XCircle size={14} className="text-red-500" />,
  updated: <RefreshCw size={14} className="text-blue-500" />,
};

const statusBadge: Record<string, string> = {
  valid: "badge-green", duplicate: "badge-amber", invalid: "badge-red", updated: "badge-blue",
};

export default function ImportsPage() {
  const [step, setStep] = useState<ImportStep>("idle");
  const [fileName, setFileName] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [importedCount, setImportedCount] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const valid = DEMO_PREVIEW.filter((r) => r.status === "valid" || r.status === "duplicate").length;
  const invalid = DEMO_PREVIEW.filter((r) => r.status === "invalid").length;

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) { setFileName(file.name); setStep("previewing"); }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) { setFileName(file.name); setStep("previewing"); }
  };

  const handleImport = async () => {
    setStep("importing");
    setProgress(0);
    for (let i = 0; i <= 100; i += 10) {
      await new Promise((r) => setTimeout(r, 120));
      setProgress(i);
    }
    setImportedCount(valid);
    setStep("done");
  };

  const handleReset = () => {
    setStep("idle");
    setFileName(null);
    setProgress(0);
    setImportedCount(0);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-navy-900 dark:text-white flex items-center gap-2">
          <Upload size={22} className="text-primary-600" />
          Student Imports
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          Bulk import student records via CSV or Excel. Preview before committing.
        </p>
      </div>

      {/* Template download */}
      <div className="card p-4 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
            <FileSpreadsheet size={18} className="text-emerald-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-navy-900 dark:text-white">Download Template</p>
            <p className="text-xs text-slate-400">Get the Excel/CSV template with all required columns</p>
          </div>
        </div>
        <button className="btn-secondary text-sm flex items-center gap-2">
          <Download size={14} /> Download Template
        </button>
      </div>

      {/* Upload zone */}
      {step === "idle" && (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleFileDrop}
          className="card p-12 border-2 border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center gap-4 hover:border-primary-400 dark:hover:border-primary-600 transition-colors cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="w-16 h-16 rounded-2xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center">
            <Upload size={28} className="text-primary-600" />
          </div>
          <div className="text-center">
            <p className="font-semibold text-navy-900 dark:text-white">Drag & drop your file here</p>
            <p className="text-sm text-slate-400 mt-1">Supports CSV and Excel (.xlsx) — max 5,000 rows</p>
          </div>
          <button className="btn-primary text-sm px-6">Browse File</button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.xlsx"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      )}

      {/* Preview */}
      {step === "previewing" && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="card p-4 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <FileSpreadsheet size={18} className="text-primary-500" />
              <div>
                <p className="text-sm font-semibold text-navy-900 dark:text-white">{fileName}</p>
                <p className="text-xs text-slate-400">{DEMO_PREVIEW.length} records found</p>
              </div>
            </div>
            <div className="flex gap-2">
              <span className="badge-green text-xs"><CheckCircle2 size={10} /> {valid} Valid</span>
              <span className="badge-red text-xs"><XCircle size={10} /> {invalid} Invalid</span>
            </div>
          </div>

          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800">
                    {["Student ID", "Name", "Email", "Department", "Year/Section", "Status"].map((h) => (
                      <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {DEMO_PREVIEW.map((r, i) => (
                    <motion.tr
                      key={r.studentId}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.04 }}
                      className="border-b border-slate-50 dark:border-slate-800/50"
                    >
                      <td className="py-2.5 px-4 text-sm font-mono text-navy-900 dark:text-white">{r.studentId}</td>
                      <td className="py-2.5 px-4 text-sm text-navy-900 dark:text-white">{r.name}</td>
                      <td className="py-2.5 px-4 text-sm text-slate-500">{r.email}</td>
                      <td className="py-2.5 px-4 text-sm text-slate-500">{r.department}</td>
                      <td className="py-2.5 px-4 text-sm text-slate-500">Y{r.year}-{r.section}</td>
                      <td className="py-2.5 px-4">
                        <div className="flex items-center gap-1.5">
                          {statusIcon[r.status]}
                          <span className={cn("badge text-[10px]", statusBadge[r.status])}>{r.status}</span>
                        </div>
                        {r.errors && <p className="text-[10px] text-red-500 mt-1">{r.errors[0]}</p>}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex gap-3 justify-end">
            <button onClick={handleReset} className="btn-secondary text-sm">Cancel</button>
            <button onClick={handleImport} className="btn-primary text-sm flex items-center gap-2">
              <Users size={14} /> Import {valid} Records
            </button>
          </div>
        </motion.div>
      )}

      {/* Importing */}
      {step === "importing" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card p-12 flex flex-col items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center">
            <Loader2 size={28} className="text-primary-600 animate-spin" />
          </div>
          <div className="text-center">
            <p className="font-semibold text-navy-900 dark:text-white">Importing records…</p>
            <p className="text-sm text-slate-400 mt-1">{progress}% complete</p>
          </div>
          <div className="w-full max-w-sm bg-slate-100 dark:bg-slate-800 rounded-full h-2">
            <motion.div
              className="h-2 bg-gradient-to-r from-primary-500 to-cyan-500 rounded-full"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.2 }}
            />
          </div>
        </motion.div>
      )}

      {/* Done */}
      {step === "done" && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="card p-12 flex flex-col items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
            <CheckCircle2 size={28} className="text-emerald-600" />
          </div>
          <div className="text-center">
            <p className="font-display font-bold text-xl text-navy-900 dark:text-white">Import Complete!</p>
            <p className="text-slate-500 text-sm mt-1">
              {importedCount} student records have been imported successfully.
            </p>
            {invalid > 0 && (
              <p className="text-amber-600 dark:text-amber-400 text-xs mt-2">
                {invalid} records were skipped due to validation errors.
              </p>
            )}
          </div>
          <button onClick={handleReset} className="btn-primary text-sm px-8">Import Another File</button>
        </motion.div>
      )}

      {/* Recent imports */}
      <div className="card p-5">
        <h2 className="font-display font-semibold text-navy-900 dark:text-white mb-4">Recent Imports</h2>
        <div className="space-y-2">
          {[
            { date: "Oct 20, 2024", file: "students_batch_2024.xlsx", records: 420, status: "success" },
            { date: "Sep 15, 2024", file: "new_admissions_sept.csv", records: 185, status: "success" },
            { date: "Aug 01, 2024", file: "semester_update.xlsx", records: 52, status: "partial" },
          ].map((item) => (
            <div key={item.date} className="flex items-center justify-between p-3 rounded-xl bg-surface-muted dark:bg-navy-800 border border-slate-100 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <FileSpreadsheet size={16} className="text-slate-400" />
                <div>
                  <p className="text-sm font-medium text-navy-900 dark:text-white">{item.file}</p>
                  <p className="text-xs text-slate-400">{item.date} · {item.records} records</p>
                </div>
              </div>
              <span className={cn("badge text-[10px]", item.status === "success" ? "badge-green" : "badge-amber")}>
                {item.status === "success" ? "Completed" : "Partial"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
