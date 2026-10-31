import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../../contexts/AuthContext";
import {
  Brain,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  Loader2,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  Bell,
  BarChart3,
} from "lucide-react";

type LoginMode = "signin" | "reset";

const DEMO_CREDENTIALS = [
  { label: "Faculty", email: "faculty@demo.edu", role: "Faculty / Admin access" },
  { label: "Student", email: "student@demo.edu", role: "Student portal access" },
  { label: "Admin", email: "admin@demo.edu", role: "Platform administration" },
];

export default function Login() {
  const { signInWithGoogle, signInWithEmail, resetPassword } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState<LoginMode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resetSent, setResetSent] = useState(false);

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      await signInWithEmail(email, password);
      // Redirect based on role happens inside AuthContext / ProtectedRoute
      // We redirect to the appropriate dashboard
      const stored = localStorage.getItem("campusiq_demo_user");
      if (stored) {
        const user = JSON.parse(stored);
        const redirects: Record<string, string> = {
          faculty: "/faculty/dashboard",
          student: "/student/dashboard",
          super_admin: "/admin/dashboard",
        };
        navigate(redirects[user.role] ?? "/");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Sign-in failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
      navigate("/faculty/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Google sign-in failed.");
    } finally {
      setGoogleLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      await resetPassword(email);
      setResetSent(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Password reset failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemo = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword("demo1234");
    setError(null);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left branding panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-navy-900 via-navy-800 to-primary-900 flex-col justify-between p-12">
        {/* BG orbs */}
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 relative z-10">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-cyan-500 flex items-center justify-center shadow-glow">
            <Brain size={20} className="text-white" />
          </div>
          <span className="font-display text-2xl font-bold text-white">
            Campus<span className="text-primary-300">IQ</span>
          </span>
        </Link>

        {/* Center content */}
        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <p className="text-primary-300 text-sm font-semibold tracking-wide uppercase mb-4">
              Agentic AI Platform
            </p>
            <h2 className="font-display text-4xl font-black text-white leading-tight mb-6">
              One Circular.
              <br />
              Right Students.
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-blue-300">
                Right Time.
              </span>
            </h2>
            <p className="text-slate-300 leading-relaxed text-[15px] max-w-sm">
              CampusIQ transforms college announcements into personalized, trackable notification workflows for every student.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-10 space-y-4"
          >
            {[
              { icon: Brain, label: "AI reads and understands circulars automatically" },
              { icon: ShieldCheck, label: "Faculty approve every decision before sending" },
              { icon: Bell, label: "Personalized multi-channel student notifications" },
              { icon: BarChart3, label: "Real-time analytics on delivery and engagement" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Icon size={14} className="text-primary-300" />
                </div>
                <p className="text-slate-300 text-sm leading-relaxed">{label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        <p className="text-slate-500 text-xs relative z-10">
          © 2024 CampusIQ. Access is assigned by your institution.
        </p>
      </div>

      {/* Right auth panel */}
      <div className="flex-1 flex items-center justify-center p-6 bg-surface-muted dark:bg-navy-950">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-600 to-cyan-500 flex items-center justify-center">
                <Brain size={18} className="text-white" />
              </div>
              <span className="font-display text-xl font-bold text-navy-900 dark:text-white">
                Campus<span className="text-primary-600">IQ</span>
              </span>
            </Link>
          </div>

          {/* Demo mode badge */}
          <div className="flex items-center gap-2 badge badge-amber mb-6 py-2 px-3 w-full justify-center">
            <Sparkles size={13} />
            <span className="text-xs font-semibold">Demo Mode — No real accounts needed</span>
          </div>

          {/* Card */}
          <div className="card p-8">
            {mode === "reset" ? (
              <>
                <button
                  onClick={() => { setMode("signin"); setResetSent(false); setError(null); }}
                  className="flex items-center gap-1 text-sm text-slate-500 hover:text-primary-600 mb-6 transition-colors"
                >
                  <ArrowLeft size={14} /> Back to sign in
                </button>
                <h1 className="font-display text-2xl font-bold text-navy-900 dark:text-white mb-1">
                  Reset Password
                </h1>
                <p className="text-slate-500 text-sm mb-6">
                  Enter your email to receive a password reset link.
                </p>

                {resetSent ? (
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
                    <CheckCircle2 size={18} className="text-emerald-600 flex-shrink-0" />
                    <p className="text-sm text-emerald-700 dark:text-emerald-300">
                      In production, a reset link would be sent to <strong>{email}</strong>.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handlePasswordReset} className="space-y-4">
                    <div>
                      <label className="label" htmlFor="reset-email">Email address</label>
                      <input
                        id="reset-email"
                        type="email"
                        className="input"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@institution.edu"
                        required
                      />
                    </div>
                    {error && (
                      <div className="flex items-center gap-2 text-danger text-sm">
                        <AlertCircle size={14} />
                        {error}
                      </div>
                    )}
                    <button type="submit" className="btn-primary w-full justify-center flex items-center gap-2" disabled={isLoading}>
                      {isLoading ? <Loader2 size={16} className="animate-spin" /> : null}
                      Send Reset Link
                    </button>
                  </form>
                )}
              </>
            ) : (
              <>
                <h1 className="font-display text-2xl font-bold text-navy-900 dark:text-white mb-1">
                  Welcome back
                </h1>
                <p className="text-slate-500 text-sm mb-6">
                  Sign in with your institutional credentials.
                </p>

                {/* Google sign-in */}
                <button
                  onClick={handleGoogleSignIn}
                  disabled={googleLoading}
                  className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-navy-800 hover:bg-slate-50 dark:hover:bg-navy-700 transition-all text-sm font-semibold text-navy-800 dark:text-slate-200 shadow-sm mb-5"
                >
                  {googleLoading ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <svg viewBox="0 0 24 24" className="w-4 h-4" aria-hidden>
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                  )}
                  Continue with Google
                </button>

                <div className="flex items-center gap-3 mb-5">
                  <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
                  <span className="text-xs text-slate-400 font-medium">or sign in with email</span>
                  <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
                </div>

                <form onSubmit={handleEmailSignIn} className="space-y-4">
                  <div>
                    <label className="label" htmlFor="email">Email address</label>
                    <div className="relative">
                      <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        id="email"
                        type="email"
                        className="input pl-9"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@institution.edu"
                        required
                        autoComplete="email"
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="label mb-0" htmlFor="password">Password</label>
                      <button
                        type="button"
                        onClick={() => setMode("reset")}
                        className="text-xs text-primary-600 hover:underline"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        className="input pl-9 pr-10"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Your password"
                        required
                        autoComplete="current-password"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </div>

                  {error && (
                    <div className="flex items-start gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                      <AlertCircle size={15} className="text-danger flex-shrink-0 mt-0.5" />
                      <p className="text-danger text-sm">{error}</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="btn-primary w-full justify-center flex items-center gap-2"
                    disabled={isLoading}
                  >
                    {isLoading && <Loader2 size={16} className="animate-spin" />}
                    Sign In
                  </button>
                </form>
              </>
            )}
          </div>

          {/* Demo credentials */}
          <div className="mt-4 card p-4">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-3 uppercase tracking-wide">
              Demo Credentials
            </p>
            <div className="grid grid-cols-3 gap-2">
              {DEMO_CREDENTIALS.map((d) => (
                <button
                  key={d.email}
                  onClick={() => fillDemo(d.email)}
                  className="flex flex-col items-center gap-1 p-2.5 rounded-xl hover:bg-primary-50 dark:hover:bg-primary-900/20 border border-slate-100 dark:border-slate-700 transition-all group"
                >
                  <span className="font-display font-bold text-sm text-navy-900 dark:text-white group-hover:text-primary-600">
                    {d.label}
                  </span>
                  <span className="text-[10px] text-slate-400 text-center leading-tight">
                    {d.role}
                  </span>
                </button>
              ))}
            </div>
            <p className="text-[10px] text-slate-400 mt-3 text-center">
              Use any password (e.g. <code className="font-mono bg-slate-100 dark:bg-slate-700 px-1 rounded">demo1234</code>)
            </p>
          </div>

          <p className="text-center text-xs text-slate-400 mt-4">
            Access is assigned by your institution.{" "}
            <Link to="/" className="text-primary-600 hover:underline">
              Learn more
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
