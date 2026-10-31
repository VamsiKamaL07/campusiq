import { useState } from "react";
import { Link, NavLink, useNavigate, Outlet } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../contexts/AuthContext";
import {
  Brain,
  LayoutDashboard,
  FileText,
  Megaphone,
  Users,
  Bell,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
  Menu,
  X,
  Search,
  Sun,
  Moon,
  User,
  Clock,
  Briefcase,
  Shield,
  BookOpen,
  Calendar,
  Import,
  Building,
  UserCog,
  AlertTriangle,
  Target,
  Zap,
} from "lucide-react";
import { cn } from "../../lib/utils";

// ─── Nav config by role ───────────────────────────────────────────────────────
const FACULTY_NAV = [
  { icon: LayoutDashboard, label: "Dashboard", to: "/faculty/dashboard" },
  { icon: Zap, label: "AI Circular Studio", to: "/faculty/circular-studio", badge: "AI" },
  { icon: Megaphone, label: "Announcements", to: "/faculty/announcements" },
  { icon: Target, label: "Student Targeting", to: "/faculty/targeting" },
  { icon: Bell, label: "Campaigns", to: "/faculty/campaigns" },
  { icon: BookOpen, label: "Registrations", to: "/faculty/registrations" },
  { icon: Clock, label: "Reminders", to: "/faculty/reminders" },
  { icon: BarChart3, label: "Analytics", to: "/faculty/analytics" },
  { icon: Settings, label: "Settings", to: "/faculty/settings" },
];

const STUDENT_NAV = [
  { icon: LayoutDashboard, label: "Dashboard", to: "/student/dashboard" },
  { icon: Megaphone, label: "Announcements", to: "/student/announcements" },
  { icon: Calendar, label: "Events", to: "/student/events" },
  { icon: BookOpen, label: "Registrations", to: "/student/registrations" },
  { icon: Bell, label: "Notifications", to: "/student/notifications" },
  { icon: Settings, label: "Settings", to: "/student/settings" },
];

const ADMIN_NAV = [
  { icon: LayoutDashboard, label: "Overview", to: "/admin/dashboard" },
  { icon: Building, label: "Departments", to: "/admin/departments" },
  { icon: Users, label: "Students", to: "/admin/students" },
  { icon: Briefcase, label: "Faculty", to: "/admin/faculty" },
  { icon: Import, label: "Student Imports", to: "/admin/imports" },
  { icon: Bell, label: "Comm. Settings", to: "/admin/providers" },
  { icon: AlertTriangle, label: "Audit Logs", to: "/admin/audit-logs" },
  { icon: UserCog, label: "Platform Settings", to: "/admin/settings" },
];

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  to: string;
  badge?: string;
  collapsed: boolean;
}

function SidebarItem({ icon: Icon, label, to, badge, collapsed }: SidebarItemProps) {
  return (
    <NavLink
      to={to}
      end={to.endsWith("dashboard")}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all duration-200 group relative",
          collapsed ? "justify-center" : "",
          isActive
            ? "bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300"
            : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-slate-200"
        )
      }
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <motion.div
              layoutId="sidebar-indicator"
              className="absolute left-0 top-1 bottom-1 w-0.5 bg-primary-600 dark:bg-primary-400 rounded-full"
            />
          )}
          <Icon size={18} className="flex-shrink-0" />
          {!collapsed && (
            <span className="text-sm truncate flex-1">{label}</span>
          )}
          {!collapsed && badge && (
            <span className="badge-blue text-[10px] px-1.5 py-0.5">{badge}</span>
          )}
          {collapsed && (
            <div className="absolute left-full ml-2 px-2 py-1 bg-navy-900 dark:bg-slate-100 text-white dark:text-navy-900 text-xs rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
              {label}
            </div>
          )}
        </>
      )}
    </NavLink>
  );
}

// ─── Topbar ───────────────────────────────────────────────────────────────────
function Topbar({
  onMenuToggle,
  isDark,
  onThemeToggle,
}: {
  onMenuToggle: () => void;
  isDark: boolean;
  onThemeToggle: () => void;
}) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  return (
    <header className="h-14 bg-white dark:bg-navy-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 gap-4">
      {/* Left */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-1.5 rounded-lg hover:bg-surface-subtle dark:hover:bg-navy-800"
          aria-label="Toggle sidebar"
        >
          <Menu size={18} />
        </button>
        {/* Search */}
        <div className="hidden md:flex items-center gap-2 bg-surface-muted dark:bg-navy-800 rounded-xl px-3 py-1.5 border border-slate-200 dark:border-slate-700 w-56 lg:w-72">
          <Search size={14} className="text-slate-400" />
          <input
            type="search"
            placeholder="Search announcements…"
            className="bg-transparent text-sm text-slate-700 dark:text-slate-300 placeholder:text-slate-400 outline-none w-full"
          />
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        {/* Theme toggle */}
        <button
          onClick={onThemeToggle}
          className="p-2 rounded-xl hover:bg-surface-subtle dark:hover:bg-navy-800 transition-colors"
          aria-label="Toggle theme"
        >
          {isDark ? <Sun size={16} className="text-amber-400" /> : <Moon size={16} className="text-slate-500" />}
        </button>

        {/* Notifications */}
        <button className="relative p-2 rounded-xl hover:bg-surface-subtle dark:hover:bg-navy-800 transition-colors" aria-label="Notifications">
          <Bell size={16} className="text-slate-600 dark:text-slate-400" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-danger rounded-full" />
        </button>

        {/* Profile */}
        <div className="relative">
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-surface-subtle dark:hover:bg-navy-800 transition-colors"
            aria-haspopup="true"
            aria-expanded={showProfile}
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary-500 to-cyan-500 flex items-center justify-center">
              <User size={14} className="text-white" />
            </div>
            <div className="hidden md:block text-left">
              <p className="text-xs font-semibold text-navy-900 dark:text-white leading-tight">{user?.displayName}</p>
              <p className="text-[10px] text-slate-400 capitalize">{user?.role?.replace("_", " ")}</p>
            </div>
          </button>

          <AnimatePresence>
            {showProfile && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-2 w-52 card shadow-card-hover z-50 overflow-hidden"
              >
                <div className="p-3 border-b border-slate-100 dark:border-slate-700">
                  <p className="font-semibold text-sm text-navy-900 dark:text-white">{user?.displayName}</p>
                  <p className="text-xs text-slate-400">{user?.email}</p>
                </div>
                <div className="p-2">
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-sm text-danger hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <LogOut size={14} />
                    Sign out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}

// ─── Dashboard Layout ─────────────────────────────────────────────────────────
export default function DashboardLayout() {
  const { user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  const navItems =
    user?.role === "faculty"
      ? FACULTY_NAV
      : user?.role === "student"
      ? STUDENT_NAV
      : ADMIN_NAV;

  const roleLabel =
    user?.role === "faculty" ? "Faculty" : user?.role === "student" ? "Student" : "Administrator";

  const toggleTheme = () => {
    setIsDark((d) => {
      const next = !d;
      document.documentElement.classList.toggle("dark", next);
      return next;
    });
  };

  const Sidebar = (
    <div
      className={cn(
        "flex flex-col h-full bg-white dark:bg-navy-900 border-r border-slate-200 dark:border-slate-800 transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className={cn("flex items-center gap-2.5 px-4 py-4 border-b border-slate-100 dark:border-slate-800", collapsed && "justify-center px-2")}>
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-600 to-cyan-500 flex items-center justify-center flex-shrink-0">
          <Brain size={16} className="text-white" />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="font-display text-base font-bold text-navy-900 dark:text-white leading-tight">
              Campus<span className="text-primary-600">IQ</span>
            </p>
            <p className="text-[10px] text-slate-400 font-medium">{roleLabel} Portal</p>
          </div>
        )}
        {/* Collapse toggle - desktop only */}
        <button
          className={cn(
            "hidden lg:flex ml-auto p-1 rounded-lg hover:bg-surface-subtle dark:hover:bg-navy-800 transition-colors",
            collapsed && "ml-0"
          )}
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <motion.div animate={{ rotate: collapsed ? 180 : 0 }}>
            <ChevronLeft size={14} className="text-slate-400" />
          </motion.div>
        </button>
      </div>

      {/* Nav items */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto scrollbar-thin">
        {navItems.map((item) => (
          <SidebarItem key={item.to} {...item} collapsed={collapsed} />
        ))}
      </nav>

      {/* Bottom user info */}
      {!collapsed && (
        <div className="p-3 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5 px-2 py-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
              <User size={13} className="text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-navy-900 dark:text-white truncate">{user?.displayName}</p>
              <p className="text-[10px] text-slate-400 truncate capitalize">{user?.role?.replace("_", " ")}</p>
            </div>
            <Shield size={12} className="text-primary-500 flex-shrink-0" />
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="h-screen flex overflow-hidden bg-surface-muted dark:bg-navy-950">
      {/* Desktop sidebar */}
      <div className="hidden lg:flex flex-shrink-0">{Sidebar}</div>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 bg-black/50 z-40"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 20 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 z-50 flex"
            >
              <div className="relative w-64">
                {Sidebar}
                <button
                  className="absolute top-4 right-3 p-1.5 rounded-lg bg-surface-subtle dark:bg-navy-800"
                  onClick={() => setMobileOpen(false)}
                >
                  <X size={14} />
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar
          onMenuToggle={() => setMobileOpen(true)}
          isDark={isDark}
          onThemeToggle={toggleTheme}
        />
        <main className="flex-1 overflow-y-auto scrollbar-thin">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
