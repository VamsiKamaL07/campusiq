import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Settings,
  User,
  Brain,
  Bell,
  Clock,
  Shield,
  Save,
  CheckCircle2,
  Mail,
  Smartphone,
  MessageSquare,
  Sparkles,
  Sliders,
  RotateCcw,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { DEMO_DEPARTMENTS } from "../../lib/demoData";
import { cn } from "../../lib/utils";

interface FacultySettingsState {
  displayName: string;
  designation: string;
  department: string;
  email: string;
  phone: string;
  officeRoom: string;
  officeHours: string;
  aiConfidenceThreshold: number;
  autoExtractEligibility: boolean;
  autoGenerateCopies: boolean;
  circularTone: "formal" | "engaging" | "concise";
  defaultChannels: {
    email: boolean;
    whatsapp: boolean;
    push: boolean;
    sms: boolean;
  };
  autoRemind24h: boolean;
  autoRemind48h: boolean;
  quietHoursEnabled: boolean;
  quietHoursStart: string;
  quietHoursEnd: string;
  dailyRecapEmail: boolean;
  capacityAlerts: boolean;
}

const DEFAULT_SETTINGS: FacultySettingsState = {
  displayName: "Dr. Meenakshi Sharma",
  designation: "Associate Professor & Placement Coordinator",
  department: "AI & DS",
  email: "faculty@demo.edu",
  phone: "+91 98765 43210",
  officeRoom: "Room 402, Block B (Academic Wing)",
  officeHours: "Mon, Wed, Fri: 2:00 PM – 4:30 PM",
  aiConfidenceThreshold: 85,
  autoExtractEligibility: true,
  autoGenerateCopies: true,
  circularTone: "engaging",
  defaultChannels: {
    email: true,
    whatsapp: true,
    push: true,
    sms: false,
  },
  autoRemind24h: true,
  autoRemind48h: false,
  quietHoursEnabled: true,
  quietHoursStart: "22:00",
  quietHoursEnd: "07:00",
  dailyRecapEmail: true,
  capacityAlerts: true,
};

export default function FacultySettings() {
  const { user } = useAuth();
  const [settings, setSettings] = useState<FacultySettingsState>(() => {
    const saved = localStorage.getItem("campusiq_faculty_settings");
    if (saved) {
      try {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
      } catch {
        return DEFAULT_SETTINGS;
      }
    }
    return DEFAULT_SETTINGS;
  });

  const [activeTab, setActiveTab] = useState<"profile" | "ai" | "channels" | "schedule">("profile");
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("campusiq_faculty_settings", JSON.stringify(settings));
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleReset = () => {
    if (window.confirm("Reset all faculty settings to system defaults?")) {
      setSettings(DEFAULT_SETTINGS);
      localStorage.removeItem("campusiq_faculty_settings");
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto space-y-6">
      {/* Save Success Banner */}
      <AnimatePresence>
        {savedSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-12 right-6 z-50 bg-emerald-600 text-white px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 border border-emerald-400 text-sm font-medium"
          >
            <CheckCircle2 size={16} />
            <span>Preferences saved successfully!</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="badge badge-primary">Faculty Preferences</span>
            <span className="badge badge-purple">AI Powered</span>
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-navy-900 dark:text-white flex items-center gap-2.5">
            <Settings size={28} className="text-primary-600" />
            Faculty Settings
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">
            Configure your academic profile, AI Circular Studio defaults, and student dispatch channels.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="btn-secondary flex items-center gap-1.5 text-xs py-2 px-3"
          >
            <RotateCcw size={14} />
            Reset Defaults
          </button>
          <button
            onClick={handleSave}
            className="btn-primary flex items-center gap-1.5 text-xs py-2 px-3"
          >
            <Save size={14} />
            Save Changes
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto">
        {[
          { id: "profile", label: "Academic Profile", icon: User },
          { id: "ai", label: "AI Studio Intelligence", icon: Brain },
          { id: "channels", label: "Dispatch & Channels", icon: Bell },
          { id: "schedule", label: "Consultation & Hours", icon: Clock },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap",
                isActive
                  ? "bg-primary-600 text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-navy-800"
              )}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Tab 1: Profile */}
        {activeTab === "profile" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="card p-6 space-y-6"
          >
            <div>
              <h2 className="font-display text-lg font-bold text-navy-900 dark:text-white mb-1">
                Faculty Profile Information
              </h2>
              <p className="text-slate-500 text-xs">
                This information is shown to students on circular announcements and event invites.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label text-xs uppercase" htmlFor="displayName">
                  Full Name & Title
                </label>
                <input
                  id="displayName"
                  type="text"
                  className="input"
                  value={settings.displayName}
                  onChange={(e) => setSettings({ ...settings, displayName: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="label text-xs uppercase" htmlFor="designation">
                  Designation / Role
                </label>
                <input
                  id="designation"
                  type="text"
                  className="input"
                  value={settings.designation}
                  onChange={(e) => setSettings({ ...settings, designation: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="label text-xs uppercase" htmlFor="department">
                  Primary Department
                </label>
                <select
                  id="department"
                  className="input"
                  value={settings.department}
                  onChange={(e) => setSettings({ ...settings, department: e.target.value })}
                >
                  {DEMO_DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="label text-xs uppercase" htmlFor="officeRoom">
                  Office / Cabin Location
                </label>
                <input
                  id="officeRoom"
                  type="text"
                  className="input"
                  value={settings.officeRoom}
                  onChange={(e) => setSettings({ ...settings, officeRoom: e.target.value })}
                />
              </div>

              <div>
                <label className="label text-xs uppercase" htmlFor="email">
                  Institutional Email
                </label>
                <input
                  id="email"
                  type="email"
                  className="input"
                  value={settings.email}
                  onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="label text-xs uppercase" htmlFor="phone">
                  Contact Phone
                </label>
                <input
                  id="phone"
                  type="tel"
                  className="input"
                  value={settings.phone}
                  onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* Tab 2: AI Studio */}
        {activeTab === "ai" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="card p-6 space-y-6"
          >
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Brain size={20} className="text-primary-600" />
                <h2 className="font-display text-lg font-bold text-navy-900 dark:text-white">
                  AI Circular Studio Intelligence
                </h2>
              </div>
              <p className="text-slate-500 text-xs">
                Fine-tune how CampusIQ reads circular PDFs, extracts eligibility, and drafts notifications.
              </p>
            </div>

            <div className="space-y-4 divide-y divide-slate-100 dark:divide-slate-800">
              <div className="pt-2">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="text-sm font-semibold text-navy-900 dark:text-white">
                      Extraction Confidence Threshold
                    </p>
                    <p className="text-xs text-slate-500">
                      Fields extracted below this threshold will be flagged for manual faculty confirmation.
                    </p>
                  </div>
                  <span className="font-mono text-sm font-bold text-primary-600 bg-primary-50 dark:bg-primary-950/40 px-2.5 py-1 rounded-lg">
                    {settings.aiConfidenceThreshold}%
                  </span>
                </div>
                <input
                  type="range"
                  min="60"
                  max="98"
                  step="1"
                  value={settings.aiConfidenceThreshold}
                  onChange={(e) =>
                    setSettings({ ...settings, aiConfidenceThreshold: Number(e.target.value) })
                  }
                  className="w-full accent-primary-600 cursor-pointer"
                />
              </div>

              <div className="pt-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-navy-900 dark:text-white">
                    Auto-Extract Student Eligibility Rules
                  </p>
                  <p className="text-xs text-slate-500">
                    Parse CGPA limits, department restrictions, and graduating batch automatically from text.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.autoExtractEligibility}
                  onChange={(e) =>
                    setSettings({ ...settings, autoExtractEligibility: e.target.checked })
                  }
                  className="w-5 h-5 rounded text-primary-600 focus:ring-primary-500 cursor-pointer"
                />
              </div>

              <div className="pt-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-navy-900 dark:text-white">
                    Auto-Generate Multi-Channel Copy
                  </p>
                  <p className="text-xs text-slate-500">
                    Create tailored copy versions for WhatsApp, Email HTML, and In-App Push notifications.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.autoGenerateCopies}
                  onChange={(e) =>
                    setSettings({ ...settings, autoGenerateCopies: e.target.checked })
                  }
                  className="w-5 h-5 rounded text-primary-600 focus:ring-primary-500 cursor-pointer"
                />
              </div>

              <div className="pt-4">
                <label className="text-sm font-semibold text-navy-900 dark:text-white block mb-1">
                  Default Communication Tone
                </label>
                <p className="text-xs text-slate-500 mb-3">
                  Sets the writing voice applied by AI when drafting messages.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: "formal", label: "Academic Formal", desc: "Rigorous, official institutional phrasing" },
                    { id: "engaging", label: "Engaging & Action-Driven", desc: "Motivating, clear deadline highlights" },
                    { id: "concise", label: "Concise & Direct", desc: "Bullet points, essential details only" },
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() =>
                        setSettings({ ...settings, circularTone: t.id as typeof settings.circularTone })
                      }
                      className={cn(
                        "p-3 rounded-xl border text-left transition-all",
                        settings.circularTone === t.id
                          ? "border-primary-600 bg-primary-50/50 dark:bg-primary-950/20 ring-1 ring-primary-500"
                          : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-navy-800"
                      )}
                    >
                      <p className="font-semibold text-xs text-navy-900 dark:text-white">{t.label}</p>
                      <p className="text-[11px] text-slate-400 mt-1">{t.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Tab 3: Channels */}
        {activeTab === "channels" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="card p-6 space-y-6"
          >
            <div>
              <h2 className="font-display text-lg font-bold text-navy-900 dark:text-white mb-1">
                Dispatch Channels & Notification Rules
              </h2>
              <p className="text-slate-500 text-xs">
                Select default delivery channels and automated student reminder policies.
              </p>
            </div>

            <div className="space-y-4">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Default Channels for New Campaigns
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { key: "email", label: "Campus Email", desc: "Send formatted HTML email to student accounts", icon: Mail },
                  { key: "whatsapp", label: "WhatsApp Broadcast", desc: "Instant mobile alert with action buttons", icon: Smartphone },
                  { key: "push", label: "Push Notification", desc: "Real-time in-app and browser notifications", icon: Bell },
                  { key: "sms", label: "SMS Backup", desc: "Direct text alert for high-priority announcements", icon: MessageSquare },
                ].map((ch) => {
                  const Icon = ch.icon;
                  const isChecked = settings.defaultChannels[ch.key as keyof typeof settings.defaultChannels];
                  return (
                    <label
                      key={ch.key}
                      className={cn(
                        "flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all",
                        isChecked
                          ? "border-primary-500 bg-primary-50/30 dark:bg-primary-950/20"
                          : "border-slate-200 dark:border-slate-800"
                      )}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            defaultChannels: {
                              ...settings.defaultChannels,
                              [ch.key]: e.target.checked,
                            },
                          })
                        }
                        className="w-4 h-4 mt-1 rounded text-primary-600 focus:ring-primary-500"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-1.5 font-semibold text-xs text-navy-900 dark:text-white">
                          <Icon size={14} className="text-primary-600" />
                          {ch.label}
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">{ch.desc}</p>
                      </div>
                    </label>
                  );
                })}
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-navy-900 dark:text-white">
                      Auto-Remind Students 24h Before Deadline
                    </p>
                    <p className="text-xs text-slate-500">
                      Sends automated nudges to un-registered eligible candidates.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.autoRemind24h}
                    onChange={(e) => setSettings({ ...settings, autoRemind24h: e.target.checked })}
                    className="w-5 h-5 rounded text-primary-600 focus:ring-primary-500 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-navy-900 dark:text-white">
                      Enforce Quiet Hours (No Notifications)
                    </p>
                    <p className="text-xs text-slate-500">
                      Messages scheduled during quiet hours are queued until the next morning.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.quietHoursEnabled}
                    onChange={(e) =>
                      setSettings({ ...settings, quietHoursEnabled: e.target.checked })
                    }
                    className="w-5 h-5 rounded text-primary-600 focus:ring-primary-500 cursor-pointer"
                  />
                </div>

                {settings.quietHoursEnabled && (
                  <div className="grid grid-cols-2 gap-4 pl-4 pt-2 border-l-2 border-primary-500">
                    <div>
                      <label className="label text-[10px] uppercase">Quiet Hours Start</label>
                      <input
                        type="time"
                        className="input text-xs"
                        value={settings.quietHoursStart}
                        onChange={(e) =>
                          setSettings({ ...settings, quietHoursStart: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <label className="label text-[10px] uppercase">Quiet Hours End</label>
                      <input
                        type="time"
                        className="input text-xs"
                        value={settings.quietHoursEnd}
                        onChange={(e) =>
                          setSettings({ ...settings, quietHoursEnd: e.target.value })
                        }
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Tab 4: Consultation & Hours */}
        {activeTab === "schedule" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="card p-6 space-y-6"
          >
            <div>
              <h2 className="font-display text-lg font-bold text-navy-900 dark:text-white mb-1">
                Consultation Schedule & Office Hours
              </h2>
              <p className="text-slate-500 text-xs">
                Students can view this schedule when asking follow-up questions regarding circulars.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="label text-xs uppercase" htmlFor="officeHours">
                  Weekly Office Hours
                </label>
                <input
                  id="officeHours"
                  type="text"
                  className="input"
                  value={settings.officeHours}
                  onChange={(e) => setSettings({ ...settings, officeHours: e.target.value })}
                  placeholder="e.g. Mon, Wed: 3:00 PM – 5:00 PM"
                />
              </div>

              <div className="pt-2 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-navy-900 dark:text-white">
                    Receive Daily Registration Digest Email
                  </p>
                  <p className="text-xs text-slate-500">
                    Every evening at 6:00 PM with registration totals and attendance check-in counts.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.dailyRecapEmail}
                  onChange={(e) =>
                    setSettings({ ...settings, dailyRecapEmail: e.target.checked })
                  }
                  className="w-5 h-5 rounded text-primary-600 focus:ring-primary-500 cursor-pointer"
                />
              </div>

              <div className="pt-2 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-navy-900 dark:text-white">
                    Event Capacity Alerts
                  </p>
                  <p className="text-xs text-slate-500">
                    Notify faculty immediately when an event reaches 90% and 100% seating capacity.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.capacityAlerts}
                  onChange={(e) =>
                    setSettings({ ...settings, capacityAlerts: e.target.checked })
                  }
                  className="w-5 h-5 rounded text-primary-600 focus:ring-primary-500 cursor-pointer"
                />
              </div>
            </div>
          </motion.div>
        )}

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
          <button type="button" onClick={handleReset} className="btn-secondary text-sm">
            Reset Defaults
          </button>
          <button type="submit" className="btn-primary text-sm flex items-center gap-2">
            <Save size={15} />
            Save Preferences
          </button>
        </div>
      </form>
    </div>
  );
}
