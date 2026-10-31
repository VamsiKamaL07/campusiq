import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  Mail,
  MessageSquare,
  Smartphone,
  Send,
  Clock,
  Eye,
  CheckCircle2,
  AlertCircle,
  Info,
  DollarSign,
  Users,
  ChevronRight,
  Zap,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { NotificationChannel, AnnouncementPriority } from "../../types";

// ─── Channel Config ───────────────────────────────────────────────────────────
const CHANNELS: {
  id: NotificationChannel;
  icon: React.ElementType;
  label: string;
  description: string;
  available: boolean;
  costPerMsg?: number;
}[] = [
  {
    id: "in_app",
    icon: Bell,
    label: "In-App",
    description: "Appears in the student's CampusIQ notification center",
    available: true,
  },
  {
    id: "push",
    icon: Smartphone,
    label: "Web Push",
    description: "Browser push notification (requires student permission)",
    available: true,
  },
  {
    id: "email",
    icon: Mail,
    label: "Email",
    description: "Sent via Resend — requires provider configuration",
    available: false,
  },
  {
    id: "whatsapp",
    icon: MessageSquare,
    label: "WhatsApp",
    description: "Requires WhatsApp Cloud API config and student consent",
    available: false,
    costPerMsg: 0.005,
  },
];

// ─── Mobile Notification Preview ──────────────────────────────────────────────
function MobilePreview({ title, message }: { title: string; message: string }) {
  return (
    <div className="w-full max-w-xs mx-auto">
      {/* Phone frame */}
      <div className="relative bg-navy-900 rounded-[2.5rem] p-3 shadow-2xl border-4 border-navy-800">
        {/* Status bar */}
        <div className="flex items-center justify-between px-4 py-2 mb-2">
          <span className="text-white text-xs">9:41</span>
          <div className="flex gap-1">
            <div className="w-3 h-1.5 bg-white/60 rounded-full" />
            <div className="w-3 h-1.5 bg-white/60 rounded-full" />
            <div className="w-3 h-1.5 bg-white rounded-full" />
          </div>
        </div>
        {/* Screen */}
        <div className="bg-slate-100 dark:bg-slate-900 rounded-3xl min-h-[400px] p-4 overflow-hidden">
          {/* Notification popup */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-navy-800 rounded-2xl p-3 shadow-lg border border-slate-200 dark:border-slate-700 mb-4"
          >
            <div className="flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                <Bell size={14} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-navy-900 dark:text-white">CampusIQ</p>
                  <p className="text-[10px] text-slate-400">now</p>
                </div>
                <p className="text-xs font-semibold text-navy-900 dark:text-white mt-0.5 line-clamp-1">
                  {title || "Announcement Title"}
                </p>
                <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">
                  {message || "Your personalized notification will appear here."}
                </p>
              </div>
            </div>
          </motion.div>

          {/* App screen */}
          <div className="space-y-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-8 bg-slate-200 dark:bg-slate-800 rounded-xl opacity-30" style={{ width: `${70 + Math.random() * 30}%` }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Campaign Builder ─────────────────────────────────────────────────────────
export default function CampaignBuilder() {
  const [title, setTitle] = useState("TCS National Qualifier — Registration Open");
  const [message, setMessage] = useState(
    "You are eligible for the TCS National Qualifier 2024. Register before November 10th to secure your spot. Don't miss this opportunity!"
  );
  const [priority, setPriority] = useState<AnnouncementPriority>("urgent");
  const [channels, setChannels] = useState<NotificationChannel[]>(["in_app", "push"]);
  const [scheduledAt, setScheduledAt] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [sent, setSent] = useState(false);
  const [activePreview, setActivePreview] = useState<"mobile" | "email" | "whatsapp">("mobile");

  const recipientCount = 312;
  const whatsappCost = channels.includes("whatsapp")
    ? (recipientCount * (CHANNELS.find((c) => c.id === "whatsapp")?.costPerMsg ?? 0)).toFixed(2)
    : null;

  const toggleChannel = (id: NotificationChannel) => {
    const ch = CHANNELS.find((c) => c.id === id);
    if (!ch?.available) return;
    setChannels((prev) => prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]);
  };

  const handleSend = () => {
    setSent(true);
    setShowConfirm(false);
  };

  if (sent) {
    return (
      <div className="p-6 max-w-7xl mx-auto flex items-center justify-center min-h-[60vh]">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={40} className="text-emerald-500" />
          </div>
          <h2 className="font-display text-2xl font-bold text-navy-900 dark:text-white mb-2">
            Campaign Queued Successfully
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mb-6">
            Notifications are being dispatched to <strong>{recipientCount} eligible students</strong> through selected channels.
          </p>
          <div className="badge-green inline-flex items-center gap-2 py-2 px-4 text-sm">
            <Zap size={14} />
            Demo Mode — No real notifications sent
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-bold text-navy-900 dark:text-white flex items-center gap-2">
          <Bell size={22} className="text-primary-600" />
          Notification Campaign Builder
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          Compose and dispatch personalized notifications to eligible students.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* ─── Composer ─── */}
        <div className="space-y-4">
          <div className="card p-5">
            <h3 className="font-display font-semibold text-navy-900 dark:text-white mb-4">Compose Notification</h3>

            <div className="space-y-4">
              <div>
                <label className="label">Notification Title</label>
                <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter notification title" />
              </div>
              <div>
                <label className="label">Message Body</label>
                <textarea
                  rows={4}
                  className="input resize-none"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write your notification message…"
                />
                <p className="text-xs text-slate-400 mt-1">{message.length} / 500 characters</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">Priority</label>
                  <select
                    className="input text-sm"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as AnnouncementPriority)}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
                <div>
                  <label className="label">Schedule (optional)</label>
                  <input
                    type="datetime-local"
                    className="input text-sm"
                    value={scheduledAt}
                    onChange={(e) => setScheduledAt(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ─── Channel Selection ─── */}
          <div className="card p-5">
            <h3 className="font-display font-semibold text-navy-900 dark:text-white mb-3">Delivery Channels</h3>
            <div className="grid grid-cols-2 gap-3">
              {CHANNELS.map((ch) => {
                const Icon = ch.icon;
                const selected = channels.includes(ch.id);
                return (
                  <button
                    key={ch.id}
                    onClick={() => toggleChannel(ch.id)}
                    disabled={!ch.available}
                    className={cn(
                      "p-3 rounded-xl border-2 text-left transition-all relative",
                      !ch.available
                        ? "opacity-50 cursor-not-allowed border-slate-200 dark:border-slate-700"
                        : selected
                        ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20"
                        : "border-slate-200 dark:border-slate-700 hover:border-primary-300"
                    )}
                  >
                    {selected && (
                      <div className="absolute top-2 right-2">
                        <CheckCircle2 size={14} className="text-primary-600" />
                      </div>
                    )}
                    {!ch.available && (
                      <span className="absolute top-2 right-2 text-[9px] bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 rounded-full text-slate-500">
                        Setup needed
                      </span>
                    )}
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center", selected ? "bg-primary-100 dark:bg-primary-900/40" : "bg-slate-100 dark:bg-slate-800")}>
                        <Icon size={14} className={selected ? "text-primary-600" : "text-slate-500"} />
                      </div>
                      <p className="text-sm font-semibold text-navy-900 dark:text-white">{ch.label}</p>
                    </div>
                    <p className="text-xs text-slate-500 leading-snug">{ch.description}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* WhatsApp cost estimator */}
          {whatsappCost && (
            <div className="card p-4 border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/10">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign size={14} className="text-amber-600" />
                <h4 className="font-semibold text-sm text-amber-800 dark:text-amber-200">WhatsApp Cost Estimate</h4>
              </div>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Recipients</span>
                  <span className="font-semibold text-navy-900 dark:text-white">{recipientCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Cost per message</span>
                  <span className="font-semibold text-navy-900 dark:text-white">$0.005</span>
                </div>
                <div className="flex justify-between border-t border-amber-200 dark:border-amber-700 pt-1 mt-1">
                  <span className="font-semibold text-amber-700 dark:text-amber-300">Estimated total</span>
                  <span className="font-bold text-amber-700 dark:text-amber-300">${whatsappCost}</span>
                </div>
              </div>
              <p className="text-xs text-amber-600 dark:text-amber-400 mt-2">
                Actual billing depends on provider rates, message classification, and delivery status.
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <button className="btn-secondary flex-1 text-sm flex items-center justify-center gap-2">
              <Clock size={14} />
              Schedule Campaign
            </button>
            <button
              onClick={() => setShowConfirm(true)}
              className="btn-primary flex-1 text-sm flex items-center justify-center gap-2"
            >
              <Send size={14} />
              Send Notifications
            </button>
          </div>
        </div>

        {/* ─── Preview ─── */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold text-navy-900 dark:text-white">Preview</h3>
            <div className="flex gap-1">
              {(["mobile", "email", "whatsapp"] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setActivePreview(p)}
                  className={cn(
                    "px-3 py-1 rounded-lg text-xs font-medium capitalize transition-all",
                    activePreview === p
                      ? "bg-primary-600 text-white"
                      : "text-slate-500 hover:bg-surface-subtle dark:hover:bg-navy-800"
                  )}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            {activePreview === "mobile" && (
              <motion.div key="mobile" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <MobilePreview title={title} message={message} />
              </motion.div>
            )}
            {activePreview === "email" && (
              <motion.div key="email" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <div className="border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden">
                  <div className="bg-primary-600 p-4 text-center">
                    <p className="text-white text-xs font-semibold">CampusIQ Notification</p>
                  </div>
                  <div className="p-6">
                    <h4 className="font-display font-bold text-navy-900 dark:text-white text-lg mb-3">{title || "Announcement"}</h4>
                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-4">{message || "Message body"}</p>
                    <button className="btn-primary text-sm px-6 py-2">View Announcement</button>
                  </div>
                  <div className="p-4 bg-surface-muted dark:bg-navy-800 text-center text-xs text-slate-400">
                    CampusIQ · Your institution's communication platform
                  </div>
                </div>
              </motion.div>
            )}
            {activePreview === "whatsapp" && (
              <motion.div key="whatsapp" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <div className="bg-[#e5ddd5] dark:bg-[#1a2838] rounded-2xl p-4 min-h-48 flex flex-col justify-end gap-3">
                  <div className="bg-white dark:bg-[#202c33] rounded-2xl rounded-tl-none p-3 shadow-sm max-w-xs">
                    <p className="text-xs font-semibold text-emerald-600 mb-1">CampusIQ</p>
                    <p className="text-sm text-navy-900 dark:text-slate-200">{title || "Announcement"}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{message || "Message"}</p>
                    <p className="text-[10px] text-slate-400 text-right mt-1">10:30 AM</p>
                  </div>
                </div>
                {!channels.includes("whatsapp") && (
                  <p className="text-xs text-slate-400 text-center mt-2">
                    Enable WhatsApp channel to send this preview
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Recipients summary */}
          <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users size={14} className="text-slate-400" />
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  <strong className="text-navy-900 dark:text-white">{recipientCount}</strong> eligible recipients
                </span>
              </div>
              <div className="flex gap-1">
                {channels.map((c) => {
                  const ch = CHANNELS.find((x) => x.id === c);
                  const Icon = ch?.icon;
                  return Icon ? (
                    <div key={c} className="w-6 h-6 rounded-lg bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center">
                      <Icon size={11} className="text-primary-600" />
                    </div>
                  ) : null;
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirm modal */}
      <AnimatePresence>
        {showConfirm && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="card p-6 w-full max-w-md shadow-2xl"
            >
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center flex-shrink-0">
                  <AlertCircle size={18} className="text-amber-600" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-navy-900 dark:text-white">Confirm Bulk Send</h3>
                  <p className="text-slate-500 text-sm mt-0.5">Review before dispatching</p>
                </div>
              </div>
              <div className="space-y-2 mb-5 text-sm">
                <div className="flex justify-between p-2.5 rounded-xl bg-surface-muted dark:bg-navy-800">
                  <span className="text-slate-500">Announcement</span>
                  <span className="font-semibold text-navy-900 dark:text-white truncate max-w-[180px]">{title}</span>
                </div>
                <div className="flex justify-between p-2.5 rounded-xl bg-surface-muted dark:bg-navy-800">
                  <span className="text-slate-500">Recipients</span>
                  <span className="font-semibold text-navy-900 dark:text-white">{recipientCount} students</span>
                </div>
                <div className="flex justify-between p-2.5 rounded-xl bg-surface-muted dark:bg-navy-800">
                  <span className="text-slate-500">Channels</span>
                  <span className="font-semibold text-navy-900 dark:text-white capitalize">{channels.join(", ")}</span>
                </div>
                {scheduledAt && (
                  <div className="flex justify-between p-2.5 rounded-xl bg-surface-muted dark:bg-navy-800">
                    <span className="text-slate-500">Scheduled</span>
                    <span className="font-semibold text-navy-900 dark:text-white">{new Date(scheduledAt).toLocaleString()}</span>
                  </div>
                )}
              </div>
              <div className="flex items-start gap-2 mb-5 p-3 rounded-xl bg-primary-50 dark:bg-primary-900/20 border border-primary-100 dark:border-primary-900/40">
                <Info size={13} className="text-primary-600 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-primary-700 dark:text-primary-300">
                  In demo mode, no real notifications will be sent. In production, this will dispatch to real student devices.
                </p>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setShowConfirm(false)} className="btn-secondary flex-1 text-sm py-2.5">Cancel</button>
                <button onClick={handleSend} className="btn-primary flex-1 text-sm py-2.5 flex items-center justify-center gap-2">
                  <Send size={14} />
                  Confirm & Send
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
