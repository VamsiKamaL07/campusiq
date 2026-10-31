import { useState } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { BarChart3, TrendingUp, Download, Filter, Bell, Users, CheckCircle2, XCircle, Zap } from "lucide-react";
import {
  demoNotificationActivity,
  demoChannelDistribution,
  demoRegistrationProgress,
} from "../../lib/demoData";
import { cn } from "../../lib/utils";

const COLORS = ["#2563eb", "#06b6d4", "#10b981", "#f59e0b", "#ef4444"];

const METRICS = [
  { label: "Total Announcements", value: 12, icon: Bell, color: "bg-primary-500" },
  { label: "Total Recipients", value: "4,820", icon: Users, color: "bg-cyan-500" },
  { label: "Notifications Sent", value: "4,180", icon: Zap, color: "bg-violet-500" },
  { label: "Delivery Rate", value: "92.4%", icon: CheckCircle2, color: "bg-emerald-500" },
  { label: "Acknowledgment Rate", value: "68.2%", icon: TrendingUp, color: "bg-amber-500" },
  { label: "Registration Rate", value: "43.7%", icon: Users, color: "bg-pink-500" },
  { label: "Delivery Failures", value: "326", icon: XCircle, color: "bg-red-500" },
  { label: "Est. Spend", value: "$0.00", icon: Zap, color: "bg-slate-500" },
];

export default function Analytics() {
  const [dateRange, setDateRange] = useState("7d");
  const [department, setDepartment] = useState("all");

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-navy-900 dark:text-white flex items-center gap-2">
            <BarChart3 size={22} className="text-primary-600" />
            Analytics Dashboard
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Track communication performance and engagement metrics.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Filters */}
          <div className="flex items-center gap-2">
            <Filter size={14} className="text-slate-400" />
            <select
              className="text-sm border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 bg-white dark:bg-navy-800 text-slate-600 dark:text-slate-400 outline-none"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
            </select>
            <select
              className="text-sm border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 bg-white dark:bg-navy-800 text-slate-600 dark:text-slate-400 outline-none"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            >
              <option value="all">All Departments</option>
              <option value="cse">Computer Science</option>
              <option value="it">Information Technology</option>
              <option value="ece">Electronics</option>
            </select>
          </div>
          <button className="btn-secondary text-sm py-1.5 px-3 flex items-center gap-1.5">
            <Download size={13} />
            Export
          </button>
        </div>
      </div>

      {/* Demo notice */}
      <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 text-xs text-amber-700 dark:text-amber-300">
        <Zap size={12} />
        <strong>Demo Mode:</strong> These metrics are illustrative sample data. Production metrics reflect real backend telemetry.
      </div>

      {/* Metrics grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {METRICS.map((m, i) => {
          const Icon = m.icon;
          return (
            <div key={m.label} className="card p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", m.color)}>
                  <Icon size={14} className="text-white" />
                </div>
              </div>
              <p className="font-display text-xl font-bold text-navy-900 dark:text-white">{m.value}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{m.label}</p>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Notification Activity */}
        <div className="card p-5">
          <h3 className="font-display font-semibold text-navy-900 dark:text-white mb-1">Notification Activity</h3>
          <p className="text-xs text-slate-400 mb-4">Sent, delivered, and opened over time</p>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={demoNotificationActivity} margin={{ top: 5, right: 10, bottom: 5, left: -20 }}>
              <defs>
                {[{ id: "sent", color: "#2563eb" }, { id: "delivered", color: "#06b6d4" }].map((g) => (
                  <linearGradient key={g.id} id={g.id} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={g.color} stopOpacity={0.2} />
                    <stop offset="95%" stopColor={g.color} stopOpacity={0} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.5} />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "white", border: "1px solid #e2e8f0", borderRadius: "12px", fontSize: 11 }} />
              <Area type="monotone" dataKey="sent" stroke="#2563eb" fill="url(#sent)" strokeWidth={2} name="Sent" />
              <Area type="monotone" dataKey="delivered" stroke="#06b6d4" fill="url(#delivered)" strokeWidth={2} name="Delivered" />
              <Line type="monotone" dataKey="opened" stroke="#10b981" strokeWidth={2} dot={false} name="Opened" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Channel Distribution */}
        <div className="card p-5">
          <h3 className="font-display font-semibold text-navy-900 dark:text-white mb-1">Channel Distribution</h3>
          <p className="text-xs text-slate-400 mb-4">Notification breakdown by delivery channel</p>
          <div className="flex items-center gap-6">
            <ResponsiveContainer width="50%" height={160}>
              <PieChart>
                <Pie
                  data={demoChannelDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={70}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {demoChannelDistribution.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ fontSize: 11, borderRadius: "12px" }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 flex-1">
              {demoChannelDistribution.map((item, i) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[i] }} />
                    <span className="text-xs text-slate-600 dark:text-slate-400">{item.name}</span>
                  </div>
                  <span className="text-xs font-semibold text-navy-900 dark:text-white">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Registration Progress */}
        <div className="card p-5">
          <h3 className="font-display font-semibold text-navy-900 dark:text-white mb-1">Registration Progress</h3>
          <p className="text-xs text-slate-400 mb-4">Eligible students vs registered by announcement</p>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={demoRegistrationProgress} margin={{ top: 5, right: 10, bottom: 5, left: -20 }} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.5} />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "white", border: "1px solid #e2e8f0", borderRadius: "12px", fontSize: 11 }} />
              <Bar dataKey="eligible" fill="#e0e9ff" radius={[4, 4, 0, 0]} name="Eligible" />
              <Bar dataKey="registered" fill="#2563eb" radius={[4, 4, 0, 0]} name="Registered" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Delivery Status */}
        <div className="card p-5">
          <h3 className="font-display font-semibold text-navy-900 dark:text-white mb-4">Delivery Status Breakdown</h3>
          <div className="space-y-3">
            {[
              { label: "Successfully Delivered", value: 3854, total: 4180, color: "bg-emerald-500", pct: 92 },
              { label: "Opened / Read", value: 2620, total: 3854, color: "bg-primary-500", pct: 68 },
              { label: "Acknowledged", value: 1890, total: 3854, color: "bg-cyan-500", pct: 49 },
              { label: "Failed / Undelivered", value: 326, total: 4180, color: "bg-red-500", pct: 8 },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-slate-600 dark:text-slate-400">{item.label}</span>
                  <span className="text-xs font-semibold text-navy-900 dark:text-white">
                    {item.value.toLocaleString()} ({item.pct}%)
                  </span>
                </div>
                <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={cn("h-full rounded-full transition-all duration-500", item.color)}
                    style={{ width: `${item.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
