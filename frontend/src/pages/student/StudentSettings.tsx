import { useState } from "react";
import { motion } from "framer-motion";
import { Settings, Bell, Mail, MessageSquare, Smartphone, Moon, Globe, Shield, User, Save, Check } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { cn } from "../../lib/utils";

interface NotifPref {
  id: string;
  label: string;
  description: string;
  icon: React.ElementType;
  enabled: boolean;
}

export default function StudentSettings() {
  const { user } = useAuth();
  const [saved, setSaved] = useState(false);

  const [notifPrefs, setNotifPrefs] = useState<NotifPref[]>([
    { id: "in_app", label: "In-App Notifications", description: "Receive notifications inside the platform", icon: Bell, enabled: true },
    { id: "push", label: "Web Push", description: "Browser push notifications (requires permission)", icon: Globe, enabled: true },
    { id: "email", label: "Email Notifications", description: "Receive announcements via email", icon: Mail, enabled: false },
    { id: "whatsapp", label: "WhatsApp", description: "WhatsApp messages (requires consent & provider config)", icon: MessageSquare, enabled: false },
  ]);

  const [categories, setCategories] = useState({
    placement: true,
    scholarship: true,
    workshop: true,
    exam: true,
    seminar: false,
    internship: true,
    cultural: false,
    sports: false,
  });

  const toggleNotif = (id: string) =>
    setNotifPrefs((ps) => ps.map((p) => p.id === id ? { ...p, enabled: !p.enabled } : p));

  const toggleCategory = (key: string) =>
    setCategories((c) => ({ ...c, [key]: !c[key as keyof typeof c] }));

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-navy-900 dark:text-white flex items-center gap-2">
          <Settings size={22} className="text-primary-600" />
          Notification Preferences
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          Manage how and when you receive notifications from CampusIQ.
        </p>
      </div>

      {/* Profile Info */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-semibold text-navy-900 dark:text-white flex items-center gap-2">
            <User size={16} className="text-primary-600" />
            Profile
          </h2>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
            <User size={20} className="text-white" />
          </div>
          <div>
            <p className="font-semibold text-navy-900 dark:text-white">{user?.displayName}</p>
            <p className="text-sm text-slate-400">{user?.email}</p>
            <div className="flex items-center gap-1.5 mt-1">
              <Shield size={11} className="text-primary-500" />
              <span className="text-xs text-slate-400 capitalize">{user?.role} · Role assigned by institution</span>
            </div>
          </div>
        </div>
        <p className="text-xs text-slate-400 mt-4 p-3 rounded-xl bg-slate-50 dark:bg-navy-800 border border-slate-200 dark:border-slate-700">
          ⚠️ Role and institutional access are managed by your institution's administrator. Contact your admin for any changes.
        </p>
      </motion.div>

      {/* Notification Channels */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="card p-5">
        <h2 className="font-display font-semibold text-navy-900 dark:text-white flex items-center gap-2 mb-4">
          <Bell size={16} className="text-primary-600" />
          Notification Channels
        </h2>
        <div className="space-y-3">
          {notifPrefs.map((pref) => {
            const Icon = pref.icon;
            return (
              <div key={pref.id} className="flex items-center justify-between p-3 rounded-xl bg-surface-muted dark:bg-navy-800 border border-slate-100 dark:border-slate-700">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white dark:bg-navy-700 border border-slate-200 dark:border-slate-600 flex items-center justify-center">
                    <Icon size={14} className="text-slate-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-navy-900 dark:text-white">{pref.label}</p>
                    <p className="text-xs text-slate-400">{pref.description}</p>
                  </div>
                </div>
                <button
                  onClick={() => toggleNotif(pref.id)}
                  role="switch"
                  aria-checked={pref.enabled}
                  className={cn(
                    "relative w-10 h-5.5 rounded-full transition-colors flex-shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500",
                    pref.enabled ? "bg-primary-600" : "bg-slate-200 dark:bg-slate-600"
                  )}
                  style={{ height: "22px", width: "40px" }}
                >
                  <span
                    className={cn(
                      "absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform",
                      pref.enabled ? "translate-x-[18px]" : "translate-x-0"
                    )}
                  />
                </button>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Category Preferences */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card p-5">
        <h2 className="font-display font-semibold text-navy-900 dark:text-white flex items-center gap-2 mb-4">
          <Bell size={16} className="text-primary-600" />
          Announcement Categories
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
          Choose which announcement types you want to receive notifications for.
        </p>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(categories).map(([key, enabled]) => (
            <button
              key={key}
              onClick={() => toggleCategory(key)}
              className={cn(
                "flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium border transition-all",
                enabled
                  ? "bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-800 text-primary-700 dark:text-primary-300"
                  : "bg-white dark:bg-navy-800 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400"
              )}
            >
              <div className={cn("w-4 h-4 rounded flex items-center justify-center", enabled ? "bg-primary-600" : "bg-slate-200 dark:bg-slate-600")}>
                {enabled && <Check size={10} className="text-white" />}
              </div>
              <span className="capitalize">{key}</span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Save */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className={cn("btn-primary flex items-center gap-2", saved ? "bg-emerald-500 hover:bg-emerald-600" : "")}
        >
          {saved ? <><Check size={15} /> Saved!</> : <><Save size={15} /> Save Preferences</>}
        </button>
      </div>
    </div>
  );
}
