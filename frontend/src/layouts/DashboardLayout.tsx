import { NavLink, Outlet } from "react-router-dom";
import { LogOut } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

export interface NavItem { to: string; label: string; }

export default function DashboardLayout({ items, title }: { items: NavItem[]; title: string }) {
  const { user, signOut } = useAuth();
  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-64 flex-col bg-navy-900 p-5 text-slate-300 md:flex">
        <p className="font-display text-xl font-bold text-white">Campus<span className="text-cyanx-400">IQ</span></p>
        <p className="mt-1 text-xs text-slate-400">{title}</p>
        <nav className="mt-8 flex flex-1 flex-col gap-1" aria-label="Main">
          {items.map((i) => (
            <NavLink key={i.to} to={i.to} end className={({ isActive }) =>
              `rounded-xl px-3 py-2 text-sm transition ${isActive ? "bg-royal-600 text-white" : "hover:bg-white/10"}`}>{i.label}</NavLink>
          ))}
        </nav>
        <button onClick={signOut} className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm hover:bg-white/10"><LogOut size={16} /> Sign out</button>
      </aside>
      <main className="flex-1 p-6 md:p-10">
        <p className="mb-6 text-sm text-slate-500">Signed in as {user?.displayName ?? user?.id} ({user?.email})</p>
        <Outlet />
      </main>
    </div>
  );
}
