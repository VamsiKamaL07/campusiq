import { useState } from "react";
import { motion } from "framer-motion";
import {
  Wifi, Mail, MessageSquare, Bell, Check, X, Eye, EyeOff, AlertTriangle, CheckCircle2,
} from "lucide-react";
import { cn } from "../../lib/utils";

interface Provider {
  id: string;
  name: string;
  icon: React.ElementType;
  color: string;
  description: string;
  isConfigured: boolean;
  isEnabled: boolean;
  fields: { key: string; label: string; placeholder: string; secret?: boolean }[];
}

export default function ProvidersPage() {
  const [providers, setProviders] = useState<Provider[]>([
    {
      id: "firebase",
      name: "Firebase Cloud Messaging",
      icon: Bell,
      color: "from-amber-400 to-orange-500",
      description: "Send web push and in-app notifications via Firebase. Required for real-time delivery.",
      isConfigured: false,
      isEnabled: false,
      fields: [
        { key: "project_id", label: "Firebase Project ID", placeholder: "my-campus-iq" },
        { key: "api_key", label: "Web API Key", placeholder: "AIza…", secret: true },
        { key: "credentials_json", label: "Service Account JSON path", placeholder: "/etc/secrets/firebase.json" },
      ],
    },
    {
      id: "resend",
      name: "Resend (Email)",
      icon: Mail,
      color: "from-blue-500 to-cyan-500",
      description: "Send beautifully formatted email notifications via Resend's API.",
      isConfigured: true,
      isEnabled: true,
      fields: [
        { key: "api_key", label: "Resend API Key", placeholder: "re_…", secret: true },
        { key: "from_address", label: "From Address", placeholder: "noreply@college.edu" },
      ],
    },
    {
      id: "whatsapp",
      name: "WhatsApp Cloud API",
      icon: MessageSquare,
      color: "from-emerald-500 to-green-600",
      description: "Send WhatsApp messages via the official Meta Cloud API. Requires Meta Business verification.",
      isConfigured: false,
      isEnabled: false,
      fields: [
        { key: "phone_number_id", label: "Phone Number ID", placeholder: "1234567890" },
        { key: "access_token", label: "Access Token", placeholder: "EAA…", secret: true },
        { key: "waba_id", label: "WhatsApp Business Account ID", placeholder: "1234567890" },
      ],
    },
  ]);

  const [editing, setEditing] = useState<string | null>(null);
  const [values, setValues] = useState<Record<string, Record<string, string>>>({});
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});
  const [saved, setSaved] = useState<string | null>(null);

  const toggleEnabled = (id: string) => {
    setProviders((prev) => prev.map((p) => p.id === id ? { ...p, isEnabled: !p.isEnabled } : p));
  };

  const handleSave = (id: string) => {
    setProviders((prev) => prev.map((p) => p.id === id ? { ...p, isConfigured: true } : p));
    setEditing(null);
    setSaved(id);
    setTimeout(() => setSaved(null), 2000);
  };

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-navy-900 dark:text-white flex items-center gap-2">
          <Wifi size={22} className="text-primary-600" />
          Communication Providers
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          Configure Firebase, Email, and WhatsApp credentials for notification delivery.
        </p>
      </div>

      <div className="card p-4 border-l-4 border-l-amber-500 flex items-start gap-3">
        <AlertTriangle size={16} className="text-amber-500 mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-sm font-semibold text-navy-900 dark:text-white">Demo Mode Active</p>
          <p className="text-xs text-slate-500 mt-0.5">
            Credentials entered here are shown for demonstration only and are not saved. In production, set these as environment variables.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {providers.map((provider, i) => {
          const Icon = provider.icon;
          const isEditing = editing === provider.id;
          const isSaved = saved === provider.id;

          return (
            <motion.div
              key={provider.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="card overflow-hidden"
            >
              <div className="p-5">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-3">
                    <div className={cn("w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center", provider.color)}>
                      <Icon size={18} className="text-white" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-display font-semibold text-navy-900 dark:text-white">{provider.name}</p>
                        {provider.isConfigured ? (
                          <span className="badge-green text-[10px]"><CheckCircle2 size={9} /> Configured</span>
                        ) : (
                          <span className="badge-amber text-[10px]"><AlertTriangle size={9} /> Not configured</span>
                        )}
                        {isSaved && <span className="badge-green text-[10px]"><Check size={9} /> Saved!</span>}
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">{provider.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {provider.isConfigured && (
                      <button
                        onClick={() => toggleEnabled(provider.id)}
                        role="switch"
                        aria-checked={provider.isEnabled}
                        className={cn(
                          "relative rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500",
                          provider.isEnabled ? "bg-primary-600" : "bg-slate-200 dark:bg-slate-600"
                        )}
                        style={{ height: "22px", width: "40px" }}
                      >
                        <span className={cn(
                          "absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform",
                          provider.isEnabled ? "translate-x-[18px]" : "translate-x-0"
                        )} />
                      </button>
                    )}
                    <button
                      onClick={() => setEditing(isEditing ? null : provider.id)}
                      className="btn-secondary text-xs py-1.5 px-3"
                    >
                      {isEditing ? "Cancel" : "Configure"}
                    </button>
                  </div>
                </div>

                {isEditing && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-5 pt-5 border-t border-slate-100 dark:border-slate-700 space-y-3"
                  >
                    {provider.fields.map((field) => {
                      const fieldKey = `${provider.id}.${field.key}`;
                      const isVisible = showSecrets[fieldKey];
                      return (
                        <div key={field.key}>
                          <label className="block text-xs font-medium text-slate-500 mb-1.5">{field.label}</label>
                          <div className="relative">
                            <input
                              type={field.secret && !isVisible ? "password" : "text"}
                              placeholder={field.placeholder}
                              value={values[provider.id]?.[field.key] ?? ""}
                              onChange={(e) => setValues((v) => ({
                                ...v,
                                [provider.id]: { ...v[provider.id], [field.key]: e.target.value }
                              }))}
                              className="input w-full text-sm py-2.5 pr-10 font-mono"
                            />
                            {field.secret && (
                              <button
                                type="button"
                                onClick={() => setShowSecrets((s) => ({ ...s, [fieldKey]: !s[fieldKey] }))}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                              >
                                {isVisible ? <EyeOff size={14} /> : <Eye size={14} />}
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                    <div className="flex gap-2 pt-2">
                      <button onClick={() => setEditing(null)} className="btn-secondary text-sm py-2 px-4">Cancel</button>
                      <button onClick={() => handleSave(provider.id)} className="btn-primary text-sm py-2 px-4 flex items-center gap-2">
                        <Check size={14} /> Save Configuration
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
