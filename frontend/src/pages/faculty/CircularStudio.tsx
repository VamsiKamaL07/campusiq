import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Upload,
  Brain,
  FileText,
  CheckCircle2,
  Circle,
  AlertCircle,
  Loader2,
  X,
  Eye,
  ChevronRight,
  Sparkles,
  Info,
  Target,
  Calendar,
  MapPin,
  Link as LinkIcon,
  Tag,
  Users,
  GraduationCap,
  Star,
  Zap,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { AIProcessingStep, AIStepStatus, ExtractedAnnouncement } from "../../types";

// ─── Simulated AI Processing ──────────────────────────────────────────────────
const INITIAL_STEPS: AIProcessingStep[] = [
  { id: "read", label: "Reading Document", status: "pending" },
  { id: "extract", label: "Extracting Information", status: "pending" },
  { id: "eligibility", label: "Understanding Eligibility", status: "pending" },
  { id: "draft", label: "Preparing Announcement", status: "pending" },
  { id: "review", label: "Awaiting Faculty Review", status: "pending" },
];

const DEMO_EXTRACTION: ExtractedAnnouncement = {
  title: "TCS National Qualifier 2024 — On-Campus Drive",
  category: "placement",
  description:
    "Tata Consultancy Services (TCS) is conducting its National Qualifier examination for the 2024 passing-out batch at our campus. Students who clear the qualifier will be invited to the TCS technical and HR rounds. Shortlisted candidates may receive Pre-Placement Offers (PPOs).",
  eventDate: "2024-11-15",
  eventTime: "09:00",
  venue: "Seminar Hall A, Block 3",
  registrationDeadline: "2024-11-10",
  eligibleDepartments: ["Computer Science", "Information Technology", "Electronics"],
  eligibleYears: [4],
  minCGPA: 7.0,
  requiredSkills: ["Aptitude", "Verbal Ability", "Coding"],
  registrationLink: "https://tcs.com/apply",
  confidenceScore: 0.91,
  missingFields: [],
};

type StudioPhase = "upload" | "processing" | "review" | "complete";

// ─── Step Status Icon ─────────────────────────────────────────────────────────
function StepIcon({ status }: { status: AIStepStatus }) {
  if (status === "completed") return <CheckCircle2 size={18} className="text-emerald-500" />;
  if (status === "running") return <Loader2 size={18} className="text-primary-500 animate-spin" />;
  if (status === "needs_review") return <AlertCircle size={18} className="text-amber-500" />;
  if (status === "failed") return <X size={18} className="text-danger" />;
  return <Circle size={18} className="text-slate-300 dark:text-slate-600" />;
}

// ─── Upload Panel ─────────────────────────────────────────────────────────────
function UploadPanel({
  onFileSelect,
  file,
}: {
  onFileSelect: (file: File) => void;
  file: File | null;
}) {
  const [dragging, setDragging] = useState(false);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const dropped = e.dataTransfer.files[0];
      if (dropped) onFileSelect(dropped);
    },
    [onFileSelect]
  );

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) onFileSelect(selected);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-7 h-7 rounded-lg bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center">
          <FileText size={14} className="text-primary-600" />
        </div>
        <h3 className="font-display font-semibold text-navy-900 dark:text-white">Document Workspace</h3>
      </div>

      {/* Drop zone */}
      {!file ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          className={cn(
            "flex-1 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-4 p-8 transition-all duration-200 cursor-pointer",
            dragging
              ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20"
              : "border-slate-200 dark:border-slate-700 hover:border-primary-400 hover:bg-slate-50 dark:hover:bg-navy-800/50"
          )}
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-100 to-cyan-100 dark:from-primary-900/40 dark:to-cyan-900/40 flex items-center justify-center">
            <Upload size={28} className="text-primary-500" />
          </div>
          <div className="text-center">
            <p className="font-semibold text-navy-900 dark:text-white mb-1">Drop your circular here</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">or click to browse</p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">PDF · PNG · JPG · JPEG</p>
          </div>
          <label className="btn-primary text-sm py-2 px-5 cursor-pointer">
            Browse Files
            <input
              type="file"
              accept=".pdf,.png,.jpg,.jpeg"
              className="hidden"
              onChange={handleFileInput}
            />
          </label>
        </div>
      ) : (
        <div className="flex-1 flex flex-col gap-4">
          {/* File metadata card */}
          <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center flex-shrink-0">
              <FileText size={18} className="text-emerald-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-navy-900 dark:text-white text-sm truncate">{file.name}</p>
              <p className="text-xs text-slate-500 mt-0.5">
                {(file.size / 1024).toFixed(1)} KB · {file.type || "document"}
              </p>
            </div>
            <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0" />
          </div>

          {/* Preview placeholder */}
          <div className="flex-1 rounded-2xl bg-surface-muted dark:bg-navy-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center flex-col gap-3">
            <Eye size={28} className="text-slate-300 dark:text-slate-600" />
            <p className="text-sm text-slate-400">
              {file.type === "application/pdf" ? "PDF preview available after processing" : "Image uploaded"}
            </p>
          </div>
        </div>
      )}

      {/* Sample circulars */}
      <div className="mt-4">
        <p className="text-xs text-slate-400 font-medium uppercase tracking-wide mb-2">Sample Circulars</p>
        <div className="space-y-1.5">
          {[
            "TCS Placement Drive — Nov 2024",
            "National Scholarship Application",
            "GATE 2025 Preparation Workshop",
          ].map((sample) => (
            <button
              key={sample}
              onClick={() => {
                const mockFile = new File(["mock content"], `${sample}.pdf`, { type: "application/pdf" });
                onFileSelect(mockFile);
              }}
              className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-sm text-slate-600 dark:text-slate-400 hover:bg-surface-subtle dark:hover:bg-navy-800 hover:text-primary-600 transition-all text-left"
            >
              <FileText size={13} className="flex-shrink-0 text-primary-400" />
              {sample}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── AI Processing Panel ──────────────────────────────────────────────────────
function AIProcessingPanel({
  steps,
  phase,
}: {
  steps: AIProcessingStep[];
  phase: StudioPhase;
}) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center">
          <Brain size={14} className="text-white" />
        </div>
        <h3 className="font-display font-semibold text-navy-900 dark:text-white">AI Agent Workspace</h3>
        {phase === "processing" && (
          <span className="badge-blue text-[10px] animate-pulse ml-auto">
            <Zap size={9} />
            Processing
          </span>
        )}
      </div>

      {/* Steps */}
      <div className="space-y-3 mb-6">
        {steps.map((step, i) => (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className={cn(
              "flex items-start gap-3 p-3 rounded-xl transition-all",
              step.status === "running"
                ? "bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800"
                : step.status === "completed"
                ? "bg-emerald-50/50 dark:bg-emerald-900/10"
                : "opacity-50"
            )}
          >
            <StepIcon status={step.status} />
            <div className="flex-1">
              <p
                className={cn(
                  "text-sm font-medium",
                  step.status === "running"
                    ? "text-primary-700 dark:text-primary-300"
                    : step.status === "completed"
                    ? "text-slate-700 dark:text-slate-300"
                    : "text-slate-400"
                )}
              >
                {step.label}
              </p>
              {step.status === "running" && (
                <motion.div
                  className="mt-1.5 h-1 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden"
                >
                  <motion.div
                    className="h-full bg-primary-500 rounded-full"
                    animate={{ width: ["0%", "80%", "95%"] }}
                    transition={{ duration: 2, ease: "easeInOut" }}
                  />
                </motion.div>
              )}
              {step.detail && (
                <p className="text-xs text-slate-400 mt-0.5">{step.detail}</p>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Demo mode notice */}
      <div className="mt-auto p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 flex items-start gap-2">
        <Info size={14} className="text-amber-600 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-amber-700 dark:text-amber-300">
          <strong>Demo Mode:</strong> AI extraction is simulated. In production, this connects to the live CampusIQ backend.
        </p>
      </div>

      {/* Confidence score */}
      {phase === "review" || phase === "complete" ? (
        <div className="mt-3 p-3 rounded-xl bg-surface-muted dark:bg-navy-800 border border-slate-100 dark:border-slate-700">
          <div className="flex items-center justify-between mb-1.5">
            <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">Extraction Confidence</p>
            <span className="text-xs font-bold text-emerald-600">91%</span>
          </div>
          <div className="h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: "91%" }}
              transition={{ duration: 0.8, delay: 0.2 }}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}

// ─── Extracted Intelligence Panel ─────────────────────────────────────────────
function ExtractedPanel({
  data,
  onApprove,
}: {
  data: ExtractedAnnouncement;
  onApprove: () => void;
}) {
  const [localData, setLocalData] = useState(data);

  const FieldRow = ({
    icon: Icon,
    label,
    value,
    editable,
    fieldKey,
  }: {
    icon: React.ElementType;
    label: string;
    value: string | number | undefined;
    editable?: boolean;
    fieldKey?: keyof ExtractedAnnouncement;
  }) => (
    <div className="flex items-start gap-2.5 py-2 border-b border-slate-100 dark:border-slate-800 last:border-0">
      <Icon size={14} className="text-slate-400 mt-1 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-[10px] text-slate-400 uppercase tracking-wide font-medium">{label}</p>
        {editable && fieldKey ? (
          <input
            className="w-full text-sm text-navy-900 dark:text-white bg-transparent border-0 outline-none p-0 mt-0.5 focus:ring-1 focus:ring-primary-300 rounded"
            value={String(localData[fieldKey] ?? "")}
            onChange={(e) => setLocalData((d) => ({ ...d, [fieldKey]: e.target.value }))}
          />
        ) : (
          <p className="text-sm text-navy-900 dark:text-white mt-0.5">{String(value ?? "—")}</p>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center">
          <Sparkles size={14} className="text-white" />
        </div>
        <h3 className="font-display font-semibold text-navy-900 dark:text-white">Extracted Intelligence</h3>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin space-y-1 pr-1">
        {/* Title */}
        <div className="mb-3">
          <label className="label text-[10px] uppercase tracking-wide">Announcement Title</label>
          <input
            className="input text-sm font-semibold"
            value={localData.title}
            onChange={(e) => setLocalData((d) => ({ ...d, title: e.target.value }))}
          />
        </div>

        {/* Category + Description */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div>
            <label className="label text-[10px] uppercase tracking-wide">Category</label>
            <select
              className="input text-sm capitalize"
              value={localData.category}
              onChange={(e) => setLocalData((d) => ({ ...d, category: e.target.value as ExtractedAnnouncement["category"] }))}
            >
              {["placement", "internship", "scholarship", "seminar", "workshop", "exam", "sports", "cultural", "general"].map((c) => (
                <option key={c} value={c} className="capitalize">{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label text-[10px] uppercase tracking-wide">Min CGPA</label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="10"
              className="input text-sm"
              value={localData.minCGPA ?? ""}
              onChange={(e) => setLocalData((d) => ({ ...d, minCGPA: parseFloat(e.target.value) || undefined }))}
            />
          </div>
        </div>

        <div className="mb-3">
          <label className="label text-[10px] uppercase tracking-wide">Description</label>
          <textarea
            rows={3}
            className="input text-sm resize-none"
            value={localData.description}
            onChange={(e) => setLocalData((d) => ({ ...d, description: e.target.value }))}
          />
        </div>

        {/* Event details */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div>
            <label className="label text-[10px] uppercase tracking-wide flex items-center gap-1">
              <Calendar size={10} /> Event Date
            </label>
            <input
              type="date"
              className="input text-sm"
              value={localData.eventDate ?? ""}
              onChange={(e) => setLocalData((d) => ({ ...d, eventDate: e.target.value }))}
            />
          </div>
          <div>
            <label className="label text-[10px] uppercase tracking-wide flex items-center gap-1">
              <Calendar size={10} /> Time
            </label>
            <input
              type="time"
              className="input text-sm"
              value={localData.eventTime ?? ""}
              onChange={(e) => setLocalData((d) => ({ ...d, eventTime: e.target.value }))}
            />
          </div>
        </div>

        <div className="mb-3">
          <label className="label text-[10px] uppercase tracking-wide flex items-center gap-1">
            <MapPin size={10} /> Venue
          </label>
          <input
            className="input text-sm"
            value={localData.venue ?? ""}
            onChange={(e) => setLocalData((d) => ({ ...d, venue: e.target.value }))}
          />
        </div>

        <div className="mb-3">
          <label className="label text-[10px] uppercase tracking-wide flex items-center gap-1">
            <Calendar size={10} /> Registration Deadline
          </label>
          <input
            type="date"
            className="input text-sm"
            value={localData.registrationDeadline ?? ""}
            onChange={(e) => setLocalData((d) => ({ ...d, registrationDeadline: e.target.value }))}
          />
        </div>

        {/* Eligibility */}
        <div className="p-3 rounded-xl bg-surface-muted dark:bg-navy-800 border border-slate-100 dark:border-slate-700 space-y-2">
          <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">Eligibility Criteria</p>
          <div>
            <div className="flex items-center gap-1 mb-1">
              <Users size={11} className="text-slate-400" />
              <span className="text-xs text-slate-500">Departments</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {localData.eligibleDepartments.map((d) => (
                <span key={d} className="badge-blue text-[10px]">{d}</span>
              ))}
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1 mb-1">
              <GraduationCap size={11} className="text-slate-400" />
              <span className="text-xs text-slate-500">Years</span>
            </div>
            <div className="flex gap-1">
              {localData.eligibleYears.map((y) => (
                <span key={y} className="badge-cyan text-[10px]">Year {y}</span>
              ))}
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1 mb-1">
              <Star size={11} className="text-slate-400" />
              <span className="text-xs text-slate-500">Required Skills</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {localData.requiredSkills.map((s) => (
                <span key={s} className="badge-purple text-[10px]">{s}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Registration link */}
        <div className="mt-2">
          <label className="label text-[10px] uppercase tracking-wide flex items-center gap-1">
            <LinkIcon size={10} /> Registration Link
          </label>
          <input
            type="url"
            className="input text-sm"
            value={localData.registrationLink ?? ""}
            onChange={(e) => setLocalData((d) => ({ ...d, registrationLink: e.target.value }))}
          />
        </div>
      </div>

      {/* Action buttons */}
      <div className="mt-4 space-y-2">
        <button className="btn-secondary w-full text-sm py-2.5 flex items-center justify-center gap-2">
          <Tag size={14} />
          Save Draft
        </button>
        <button
          onClick={onApprove}
          className="btn-primary w-full text-sm py-2.5 flex items-center justify-center gap-2"
        >
          <Target size={14} />
          Continue to Eligibility
          <ChevronRight size={14} />
        </button>
      </div>

      {/* Approval notice */}
      <div className="mt-3 flex items-start gap-2 text-xs text-slate-500 dark:text-slate-400">
        <Info size={11} className="mt-0.5 flex-shrink-0 text-amber-500" />
        <span>Review all extracted fields before proceeding. Your explicit approval is required.</span>
      </div>
    </div>
  );
}

// ─── AI Circular Studio Page ──────────────────────────────────────────────────
export default function CircularStudio() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<StudioPhase>("upload");
  const [file, setFile] = useState<File | null>(null);
  const [steps, setSteps] = useState<AIProcessingStep[]>(INITIAL_STEPS);
  const [extractedData, setExtractedData] = useState<ExtractedAnnouncement | null>(null);

  const handleFileSelect = (f: File) => {
    setFile(f);
    setPhase("upload");
    setSteps(INITIAL_STEPS);
    setExtractedData(null);
  };

  const startProcessing = async () => {
    setPhase("processing");

    const stepDurations = [800, 1200, 1000, 900, 600];
    const stepIds = ["read", "extract", "eligibility", "draft", "review"];

    for (let i = 0; i < stepIds.length; i++) {
      // Set current step to running
      setSteps((prev) =>
        prev.map((s) => (s.id === stepIds[i] ? { ...s, status: "running" } : s))
      );
      await new Promise((r) => setTimeout(r, stepDurations[i]));

      // Complete current step
      setSteps((prev) =>
        prev.map((s) =>
          s.id === stepIds[i]
            ? { ...s, status: i === stepIds.length - 1 ? "needs_review" : "completed" }
            : s
        )
      );
      await new Promise((r) => setTimeout(r, 200));
    }

    setExtractedData(DEMO_EXTRACTION);
    setPhase("review");
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="bg-white dark:bg-navy-900 border-b border-slate-200 dark:border-slate-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center">
                <Zap size={12} className="text-white" />
              </div>
              <h1 className="font-display text-xl font-bold text-navy-900 dark:text-white">
                AI Circular Studio
              </h1>
              <span className="badge-blue text-[10px]">Flagship</span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Upload a circular, review AI-extracted details, approve and dispatch.
            </p>
          </div>

          {/* Phase indicator */}
          <div className="hidden md:flex items-center gap-2">
            {(["Upload", "AI Process", "Review", "Send"] as const).map((label, i) => {
              const phaseIndex = { upload: 0, processing: 1, review: 2, complete: 3 }[phase];
              return (
                <div key={label} className="flex items-center gap-2">
                  <div
                    className={cn(
                      "flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold transition-all",
                      i <= phaseIndex
                        ? "bg-primary-600 text-white"
                        : "bg-slate-200 dark:bg-slate-700 text-slate-400"
                    )}
                  >
                    {i < phaseIndex ? "✓" : i + 1}
                  </div>
                  <span
                    className={cn(
                      "text-xs font-medium",
                      i <= phaseIndex ? "text-primary-600" : "text-slate-400"
                    )}
                  >
                    {label}
                  </span>
                  {i < 3 && <ChevronRight size={12} className="text-slate-300" />}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Three-panel workspace */}
      <div className="flex-1 overflow-hidden p-4">
        <div className="h-full grid lg:grid-cols-3 gap-4">
          {/* Left: Document Workspace */}
          <div className="card p-5 flex flex-col overflow-hidden">
            <UploadPanel onFileSelect={handleFileSelect} file={file} />

            {file && phase === "upload" && (
              <button
                onClick={startProcessing}
                className="mt-4 btn-primary w-full flex items-center justify-center gap-2 text-sm"
              >
                <Brain size={15} />
                Process with AI
              </button>
            )}
          </div>

          {/* Center: AI Processing */}
          <div className="card p-5 flex flex-col overflow-hidden">
            <AIProcessingPanel steps={steps} phase={phase} />
          </div>

          {/* Right: Extracted Intelligence */}
          <div className={cn("card p-5 flex flex-col overflow-hidden transition-all duration-500", phase === "review" || phase === "complete" ? "opacity-100" : "opacity-40 pointer-events-none")}>
            {extractedData ? (
              <ExtractedPanel
                data={extractedData}
                onApprove={() => navigate("/faculty/targeting")}
              />
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center">
                <div className="w-16 h-16 rounded-2xl bg-surface-muted dark:bg-navy-800 flex items-center justify-center">
                  <Sparkles size={28} className="text-slate-300 dark:text-slate-600" />
                </div>
                <p className="font-semibold text-slate-500 dark:text-slate-400">
                  Extracted data will appear here
                </p>
                <p className="text-sm text-slate-400">
                  Upload a circular and start AI processing to see results.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
