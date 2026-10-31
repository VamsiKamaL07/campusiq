import { useState } from "react";
import { motion } from "framer-motion";
import {
  Settings, Building2, Globe, Bell, Shield, Check, Save,
  Mail, Clock, Zap, AlertTriangle, ToggleLeft,
} from "lucide-react";
import { cn } from "../../lib/utils";

interface SettingSection {
  id: string;
  title: string;
  icon: React.ElementType;
  color: string;
}

const SECTIONS: SettingSection[] = [
  { id: "institution", title: "Institution", icon: Building2, color: "text-primary-600" },
  { id: "notifications", title: "Notifications", icon: Bell, color: "text-amber-600" },
  { id: "approval", title: "Approval Workflow", icon: Shield, color: "text-violet-600" },
  { id: "rate", title: "Rate Limits", icon: Zap, color: "text-cyan-600" },
];

export default function PlatformSettings() {
  const [activeSection, setActiveSection] = useState("institution");
  const [saved, setSaved] = useState(false);

  // Institution settings
  const [institutionName, setInstitutionName] = useState("Demo College of Technology");
  const [domain, setDomain] = useState("demo.edu");
  const [timezone, setTimezone] = useState("Asia/Kolkata");
  const [logo, setLogo] = useState("");

  // Notification settings
  const [defaultChannels, setDefaultChannels] = useState({ in_app: true, push: true, email: false, whatsapp: false });
  const [quietHoursStart, setQuietHoursStart] = useState("22:00");
  const [quietHoursEnd, setQuietHoursEnd] = useState("08:00");
  const [batchNotifs, setBatchNotifs] = useState(true);

  // Approval settings
  const [requireApproval, setRequireApproval] = useState(true);
  const [autoApproveGrade, setAutoApproveGrade] = useState<"none" | "hod" | "admin">("hod");
  const [approvalTimeout, setApprovalTimeout] = useState("48");

  // Rate limits
  const [maxPerDay, setMaxPerDay] = useState("10");
  const [maxWhatsapp, setMaxWhatsapp] = useState("3");

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const Toggle = ({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) => (
    <button
      role="switch"
      aria-checked={value}
      onClick={() => onChange(!value)}
      className={cn(
        "relative rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500",
        value ? "bg-primary-600" : "bg-slate-200 dark:bg-slate-600"
      )}
      style={{ height: "22px", width: "40px" }}
    >
      <span className={cn(
        "absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform",
        value ? "translate-x-[18px]" : "translate-x-0"
      )} />
    </button>
  );

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-navy-900 dark:text-white flex items-center gap-2">
          <Settings size={22} className="text-primary-600" />
          Platform Settings
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          Configure global platform behaviour and institutional settings.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <div className="md:w-52 flex-shrink-0">
          <nav className="card p-2 space-y-1">
            {SECTIONS.map((s) => {
              const Icon = s.icon;
              return (
                <button
                  key={s.id}
                  onClick={() => setActiveSection(s.id)}
                  className={cn(
                    "w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                    activeSection === s.id
                      ? "bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300"
                      : "text-slate-600 dark:text-slate-400 hover:bg-surface-subtle dark:hover:bg-navy-800"
                  )}
                >
                  <Icon size={15} className={activeSection === s.id ? "text-primary-600" : s.color} />
                  {s.title}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 space-y-4">
          {activeSection === "institution" && (
            <motion.div key="institution" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
              <div className="card p-5">
                <h2 className="font-display font-semibold text-navy-900 dark:text-white flex items-center gap-2 mb-4">
                  <Building2 size={15} className="text-primary-600" /> Institution Details
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1.5">Institution Name</label>
                    <input value={institutionName} onChange={(e) => setInstitutionName(e.target.value)} className="input w-full text-sm py-2.5" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1.5">Email Domain</label>
                    <input value={domain} onChange={(e) => setDomain(e.target.value)} className="input w-full text-sm py-2.5" placeholder="college.edu" />
                    <p className="text-xs text-slate-400 mt-1">Only emails from this domain can be registered as institutional users.</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1.5">Timezone</label>
                    <select value={timezone} onChange={(e) => setTimezone(e.target.value)} className="input w-full text-sm py-2.5">
                      <option value="Asia/Kolkata">Asia/Kolkata (IST +5:30)</option>
                      <option value="UTC">UTC</option>
                      <option value="Asia/Dubai">Asia/Dubai (GST +4:00)</option>
                    </select>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeSection === "notifications" && (
            <motion.div key="notifs" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
              <div className="card p-5">
                <h2 className="font-display font-semibold text-navy-900 dark:text-white flex items-center gap-2 mb-4">
                  <Bell size={15} className="text-amber-600" /> Default Notification Channels
                </h2>
                <div className="space-y-3">
                  {(Object.entries(defaultChannels) as [keyof typeof defaultChannels, boolean][]).map(([channel, enabled]) => (
                    <div key={channel} className="flex items-center justify-between p-3 rounded-xl bg-surface-muted dark:bg-navy-800 border border-slate-100 dark:border-slate-700">
                      <div>
                        <p className="text-sm font-medium text-navy-900 dark:text-white capitalize">{channel.replace("_", " ")}</p>
                        <p className="text-xs text-slate-400">
                          {channel === "in_app" ? "Notification bell inside the platform" :
                           channel === "push" ? "Browser push notifications" :
                           channel === "email" ? "Requires Resend configuration" :
                           "Requires WhatsApp Cloud API"}
                        </p>
                      </div>
                      <Toggle value={enabled} onChange={(v) => setDefaultChannels((c) => ({ ...c, [channel]: v }))} />
                    </div>
                  ))}
                </div>
              </div>

              <div className="card p-5">
                <h2 className="font-display font-semibold text-navy-900 dark:text-white flex items-center gap-2 mb-4">
                  <Clock size={15} className="text-amber-600" /> Quiet Hours
                </h2>
                <p className="text-xs text-slate-400 mb-4">No notifications will be sent during quiet hours. Urgent announcements bypass this setting.</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1.5">Start (local time)</label>
                    <input type="time" value={quietHoursStart} onChange={(e) => setQuietHoursStart(e.target.value)} className="input w-full text-sm py-2.5" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1.5">End (local time)</label>
                    <input type="time" value={quietHoursEnd} onChange={(e) => setQuietHoursEnd(e.target.value)} className="input w-full text-sm py-2.5" />
                  </div>
                </div>
                <div className="flex items-center justify-between mt-4 p-3 rounded-xl bg-surface-muted dark:bg-navy-800 border border-slate-100 dark:border-slate-700">
                  <div>
                    <p className="text-sm font-medium text-navy-900 dark:text-white">Batch Notifications</p>
                    <p className="text-xs text-slate-400">Group non-urgent notifications into digests</p>
                  </div>
                  <Toggle value={batchNotifs} onChange={setBatchNotifs} />
                </div>
              </div>
            </motion.div>
          )}

          {activeSection === "approval" && (
            <motion.div key="approval" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
              <div className="card p-5">
                <h2 className="font-display font-semibold text-navy-900 dark:text-white flex items-center gap-2 mb-4">
                  <Shield size={15} className="text-violet-600" /> Approval Workflow
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-surface-muted dark:bg-navy-800 border border-slate-100 dark:border-slate-700">
                    <div>
                      <p className="text-sm font-medium text-navy-900 dark:text-white">Require Approval for Announcements</p>
                      <p className="text-xs text-slate-400">Faculty must get approval before announcements go live</p>
                    </div>
                    <Toggle value={requireApproval} onChange={setRequireApproval} />
                  </div>
                  {requireApproval && (
                    <>
                      <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1.5">Auto-approve for role and above</label>
                        <select value={autoApproveGrade} onChange={(e) => setAutoApproveGrade(e.target.value as typeof autoApproveGrade)} className="input w-full text-sm py-2.5">
                          <option value="none">Never auto-approve</option>
                          <option value="hod">HoD and above</option>
                          <option value="admin">Admins only</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1.5">Approval Timeout (hours)</label>
                        <input type="number" value={approvalTimeout} onChange={(e) => setApprovalTimeout(e.target.value)} min={1} max={168} className="input w-full text-sm py-2.5" />
                        <p className="text-xs text-slate-400 mt-1">After this time, pending announcements are auto-rejected.</p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {activeSection === "rate" && (
            <motion.div key="rate" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
              <div className="card p-5">
                <h2 className="font-display font-semibold text-navy-900 dark:text-white flex items-center gap-2 mb-4">
                  <Zap size={15} className="text-cyan-600" /> Rate Limits
                </h2>
                <div className="card p-3 border-l-4 border-l-amber-500 mb-4 flex items-start gap-2">
                  <AlertTriangle size={14} className="text-amber-500 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-slate-500">Rate limits protect students from notification fatigue and keep provider costs manageable.</p>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1.5">Max notifications per student per day</label>
                    <input type="number" value={maxPerDay} onChange={(e) => setMaxPerDay(e.target.value)} min={1} max={50} className="input w-full text-sm py-2.5" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1.5">Max WhatsApp messages per student per day</label>
                    <input type="number" value={maxWhatsapp} onChange={(e) => setMaxWhatsapp(e.target.value)} min={1} max={10} className="input w-full text-sm py-2.5" />
                    <p className="text-xs text-slate-400 mt-1">WhatsApp has strict per-business rate limits. Keep this low.</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Save button */}
          <div className="flex justify-end pt-2">
            <button
              onClick={handleSave}
              className={cn("btn-primary flex items-center gap-2 text-sm", saved && "bg-emerald-500 hover:bg-emerald-600")}
            >
              {saved ? <><Check size={14} /> Saved!</> : <><Save size={14} /> Save Settings</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
