import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, UserRole } from "../types";

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AuthContextValue extends AuthState {
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// ─── Demo users (role assigned by institution, not user-chosen) ───────────────
const DEMO_USERS: Record<string, User> = {
  "faculty@demo.edu": {
    id: "u-faculty-1",
    email: "faculty@demo.edu",
    displayName: "Dr. Meenakshi Sharma",
    role: "faculty" as UserRole,
    institutionId: "inst-1",
    departmentId: "dept-cse",
    avatarUrl: undefined,
  },
  "student@demo.edu": {
    id: "u-student-1",
    email: "student@demo.edu",
    displayName: "Arjun Mehta",
    role: "student" as UserRole,
    institutionId: "inst-1",
    departmentId: "dept-cse",
    avatarUrl: undefined,
  },
  "admin@demo.edu": {
    id: "u-admin-1",
    email: "admin@demo.edu",
    displayName: "Vikram Singh",
    role: "super_admin" as UserRole,
    institutionId: "inst-1",
    avatarUrl: undefined,
  },
};

const SESSION_KEY = "campusiq_demo_user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  });

  // Restore session from localStorage (demo mode)
  useEffect(() => {
    try {
      const stored = localStorage.getItem(SESSION_KEY);
      if (stored) {
        const user: User = JSON.parse(stored);
        setState({ user, isLoading: false, isAuthenticated: true });
      } else {
        setState((s) => ({ ...s, isLoading: false }));
      }
    } catch {
      setState((s) => ({ ...s, isLoading: false }));
    }
  }, []);

  const setUser = (user: User | null) => {
    if (user) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(user));
      setState({ user, isLoading: false, isAuthenticated: true });
    } else {
      localStorage.removeItem(SESSION_KEY);
      setState({ user: null, isLoading: false, isAuthenticated: false });
    }
  };

  // In demo mode, google sign-in returns a demo faculty user
  const signInWithGoogle = async () => {
    await new Promise((r) => setTimeout(r, 1200));
    setUser(DEMO_USERS["faculty@demo.edu"]);
  };

  const signInWithEmail = async (email: string, _password: string) => {
    await new Promise((r) => setTimeout(r, 1000));
    const lower = email.toLowerCase().trim();
    const demo = DEMO_USERS[lower];
    if (!demo) {
      throw new Error(
        "No demo account found for this email. Try: faculty@demo.edu, student@demo.edu, or admin@demo.edu"
      );
    }
    setUser(demo);
  };

  const signOut = async () => {
    await new Promise((r) => setTimeout(r, 300));
    setUser(null);
  };

  const resetPassword = async (_email: string) => {
    await new Promise((r) => setTimeout(r, 800));
    // In production this would trigger Firebase password reset
  };

  return (
    <AuthContext.Provider value={{ ...state, signInWithGoogle, signInWithEmail, signOut, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
