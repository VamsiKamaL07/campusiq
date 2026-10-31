import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  Brain,
  Upload,
  Users,
  Bell,
  Clock,
  BarChart3,
  ShieldCheck,
  Zap,
  Target,
  MessageSquare,
  ArrowRight,
  ChevronRight,
  Menu,
  X,
  CheckCircle2,
  Sparkles,
  FileText,
  Star,
} from "lucide-react";

// ─── Navbar ───────────────────────────────────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { href: "#features", label: "Features" },
    { href: "#how-it-works", label: "How It Works" },
    { href: "#solutions", label: "Solutions" },
    { href: "#about", label: "About" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/90 dark:bg-navy-950/90 backdrop-blur-xl shadow-sm border-b border-slate-100 dark:border-slate-800"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-18">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-600 to-cyan-500 flex items-center justify-center shadow-glow group-hover:shadow-glow-cyan transition-shadow">
              <Brain size={18} className="text-white" />
            </div>
            <span className="font-display text-xl font-bold text-navy-900 dark:text-white">
              Campus<span className="text-primary-600">IQ</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all duration-200"
              >
                {l.label}
              </a>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/login"
              className="px-4 py-2 text-sm font-semibold text-navy-800 dark:text-slate-200 hover:text-primary-600 transition-colors"
            >
              Log in
            </Link>
            <Link
              to="/login"
              className="btn-primary text-sm py-2 px-5 flex items-center gap-1.5"
            >
              Get Started
              <ArrowRight size={14} />
            </Link>
          </div>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden p-2 rounded-xl hover:bg-surface-subtle"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white dark:bg-navy-950 border-t border-slate-100 dark:border-slate-800"
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  onClick={() => setMobileOpen(false)}
                  className="block px-4 py-2.5 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-600 transition-all"
                >
                  {l.label}
                </a>
              ))}
              <div className="pt-2 flex flex-col gap-2">
                <Link
                  to="/login"
                  className="btn-secondary text-center text-sm"
                  onClick={() => setMobileOpen(false)}
                >
                  Log in
                </Link>
                <Link
                  to="/login"
                  className="btn-primary text-center text-sm"
                  onClick={() => setMobileOpen(false)}
                >
                  Get Started
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

// ─── Hero Workflow Visualizer ─────────────────────────────────────────────────
const workflowSteps = [
  { icon: Upload, label: "Upload Circular", color: "from-blue-500 to-blue-600", detail: "PDF / Image" },
  { icon: Brain, label: "AI Understands", color: "from-violet-500 to-violet-600", detail: "Extracting info…" },
  { icon: Target, label: "Students Identified", color: "from-cyan-500 to-cyan-600", detail: "312 eligible" },
  { icon: ShieldCheck, label: "Faculty Approves", color: "from-emerald-500 to-emerald-600", detail: "Human-in-loop" },
  { icon: Bell, label: "Notifications Sent", color: "from-primary-500 to-primary-600", detail: "Multi-channel" },
  { icon: BarChart3, label: "Results Tracked", color: "from-orange-500 to-orange-600", detail: "Live analytics" },
];

function WorkflowVisualizer() {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % workflowSteps.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      {/* Connection lines */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-700 to-transparent" />
      </div>

      <div className="grid grid-cols-3 md:grid-cols-6 gap-3 relative z-10">
        {workflowSteps.map((step, i) => {
          const Icon = step.icon;
          const isActive = i === activeStep;
          const isPast = i < activeStep;
          return (
            <motion.div
              key={step.label}
              animate={{ scale: isActive ? 1.08 : 1 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center gap-2"
            >
              <div
                className={`relative w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 ${
                  isActive
                    ? `bg-gradient-to-br ${step.color} shadow-glow`
                    : isPast
                    ? "bg-emerald-100 dark:bg-emerald-900/40"
                    : "bg-slate-100 dark:bg-slate-800"
                }`}
              >
                {isPast ? (
                  <CheckCircle2 size={22} className="text-emerald-500" />
                ) : (
                  <Icon
                    size={22}
                    className={isActive ? "text-white" : "text-slate-400 dark:text-slate-500"}
                  />
                )}
                {isActive && (
                  <motion.div
                    className="absolute inset-0 rounded-2xl bg-white/20"
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                )}
              </div>
              <div className="text-center">
                <p
                  className={`text-xs font-semibold leading-tight transition-colors ${
                    isActive
                      ? "text-navy-900 dark:text-white"
                      : isPast
                      ? "text-emerald-600"
                      : "text-slate-400"
                  }`}
                >
                  {step.label}
                </p>
                {isActive && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-xs text-primary-500 font-medium mt-0.5"
                  >
                    {step.detail}
                  </motion.p>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Feature Cards ────────────────────────────────────────────────────────────
const features = [
  {
    icon: Brain,
    title: "AI Circular Intelligence",
    description:
      "Automatically extracts event details, deadlines, venue, and eligibility criteria from uploaded circulars using advanced document understanding.",
    color: "from-violet-500 to-violet-600",
    badge: "Core",
  },
  {
    icon: Target,
    title: "Smart Student Targeting",
    description:
      "Matches faculty-approved eligibility rules against verified student records—department, year, CGPA, and skills—to build precise recipient lists.",
    color: "from-primary-500 to-cyan-500",
    badge: "Precision",
  },
  {
    icon: Bell,
    title: "Personalized Notifications",
    description:
      "Delivers relevant announcements to each student through in-app, push, email, and WhatsApp channels based on priority and consent.",
    color: "from-cyan-500 to-cyan-600",
    badge: "Multi-channel",
  },
  {
    icon: Clock,
    title: "Automated Reminders",
    description:
      "Schedules intelligent reminder sequences for upcoming deadlines so students never miss important events and registrations.",
    color: "from-amber-500 to-orange-500",
    badge: "Automation",
  },
  {
    icon: BarChart3,
    title: "Communication Analytics",
    description:
      "Tracks notification delivery, open rates, acknowledgments, and registrations with beautiful real-time dashboards.",
    color: "from-emerald-500 to-green-500",
    badge: "Insights",
  },
  {
    icon: ShieldCheck,
    title: "Human-in-the-Loop AI",
    description:
      "Faculty review and approve every AI-generated decision before any message is dispatched. AI suggests—people decide.",
    color: "from-rose-500 to-pink-500",
    badge: "Trust",
  },
];

function FeatureCard({ feature, index }: { feature: (typeof features)[0]; index: number }) {
  const Icon = feature.icon;
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="group card-hover p-6 cursor-default"
    >
      <div
        className={`w-11 h-11 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 shadow-sm group-hover:shadow-md transition-shadow`}
      >
        <Icon size={20} className="text-white" />
      </div>
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-display font-semibold text-navy-900 dark:text-white text-[15px]">
          {feature.title}
        </h3>
        <span className="badge-blue text-[10px]">{feature.badge}</span>
      </div>
      <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
        {feature.description}
      </p>
    </motion.div>
  );
}

// ─── How It Works ─────────────────────────────────────────────────────────────
const steps = [
  {
    num: "01",
    icon: Upload,
    title: "Upload",
    description:
      "Faculty uploads a circular—PDF, image, or any document format—directly through the AI Circular Studio.",
  },
  {
    num: "02",
    icon: Brain,
    title: "Understand",
    description:
      "The AI agent reads the document, extracts structured information, and proposes eligibility criteria for review.",
  },
  {
    num: "03",
    icon: ShieldCheck,
    title: "Verify",
    description:
      "Faculty reviews and edits the extracted data and recipient list. No announcement goes out without approval.",
  },
  {
    num: "04",
    icon: CheckCircle2,
    title: "Approve",
    description:
      "One-click faculty approval confirms the announcement details and recipient selection before delivery.",
  },
  {
    num: "05",
    icon: Bell,
    title: "Notify",
    description:
      "Personalized notifications are dispatched to eligible students through their preferred channels.",
  },
  {
    num: "06",
    icon: BarChart3,
    title: "Analyze",
    description:
      "Track delivery rates, acknowledgments, registrations, and engagement in real-time analytics dashboards.",
  },
];

function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  return (
    <section id="how-it-works" className="py-24 bg-surface-muted dark:bg-navy-950" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            className="inline-flex items-center gap-2 badge-blue mb-4 py-1.5 px-3"
          >
            <Zap size={13} />
            <span>Simple & Powerful</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
            className="section-title mb-4"
          >
            From Upload to Analytics in{" "}
            <span className="gradient-text">Six Steps</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.15 }}
            className="section-subtitle mx-auto"
          >
            CampusIQ handles the complexity so faculty can focus on communication, not logistics.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.1 }}
                className="card p-6 relative overflow-hidden group"
              >
                <div className="absolute top-4 right-4 font-display text-5xl font-black text-slate-100 dark:text-slate-800 select-none">
                  {step.num}
                </div>
                <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center mb-4 relative z-10">
                  <Icon size={18} className="text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="font-display font-bold text-navy-900 dark:text-white text-lg mb-2 relative z-10">
                  {step.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed relative z-10">
                  {step.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── Solutions Section ─────────────────────────────────────────────────────────
function Solutions() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  return (
    <section id="solutions" className="py-24 bg-white dark:bg-navy-900" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <div className="badge-blue inline-flex items-center gap-2 mb-4 py-1.5 px-3">
              <Users size={13} />
              <span>Built for Everyone</span>
            </div>
            <h2 className="section-title mb-6">
              One Platform,{" "}
              <span className="gradient-text">Three Experiences</span>
            </h2>
            <div className="space-y-6">
              {[
                {
                  icon: ShieldCheck,
                  title: "For Faculty & Administrators",
                  items: [
                    "Upload circulars and review AI-extracted content",
                    "Approve recipient lists before notifications go out",
                    "Schedule automated reminder sequences",
                    "Track engagement and registration analytics",
                  ],
                  color: "text-primary-600",
                },
                {
                  icon: Star,
                  title: "For Students",
                  items: [
                    "See only announcements relevant to you",
                    "Register for events directly from notifications",
                    "Manage notification preferences",
                    "Never miss a deadline again",
                  ],
                  color: "text-cyan-600",
                },
              ].map((group) => {
                const Icon = group.icon;
                return (
                  <div key={group.title} className="card p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <Icon size={18} className={group.color} />
                      <h3 className="font-display font-semibold text-navy-900 dark:text-white">
                        {group.title}
                      </h3>
                    </div>
                    <ul className="space-y-1.5">
                      {group.items.map((item) => (
                        <li key={item} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                          <CheckCircle2 size={13} className="text-emerald-500 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            {/* Decorative mock dashboard card */}
            <div className="card p-6 shadow-card-hover">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">AI Circular Studio</p>
                  <h4 className="font-display font-bold text-navy-900 dark:text-white">Processing Circular</h4>
                </div>
                <span className="badge-blue animate-pulse">
                  <Zap size={10} />
                  Processing
                </span>
              </div>

              {/* AI Steps mock */}
              {[
                { label: "Document read", done: true },
                { label: "Event details extracted", done: true },
                { label: "Eligibility rules proposed", done: true },
                { label: "Waiting for faculty approval", done: false, active: true },
              ].map((s) => (
                <div key={s.label} className="flex items-center gap-3 mb-3">
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                      s.done
                        ? "bg-emerald-100 dark:bg-emerald-900/40"
                        : s.active
                        ? "bg-primary-100 dark:bg-primary-900/40 animate-pulse"
                        : "bg-slate-100 dark:bg-slate-800"
                    }`}
                  >
                    {s.done ? (
                      <CheckCircle2 size={12} className="text-emerald-500" />
                    ) : s.active ? (
                      <div className="w-2 h-2 bg-primary-500 rounded-full" />
                    ) : (
                      <div className="w-2 h-2 bg-slate-300 rounded-full" />
                    )}
                  </div>
                  <span
                    className={`text-sm ${
                      s.done
                        ? "text-slate-600 dark:text-slate-400"
                        : s.active
                        ? "text-primary-600 dark:text-primary-400 font-medium"
                        : "text-slate-400"
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
              ))}

              <div className="mt-6 p-4 rounded-xl bg-surface-muted dark:bg-navy-800 border border-slate-100 dark:border-slate-700">
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-2 font-medium">Extracted Event</p>
                <p className="font-display font-semibold text-navy-900 dark:text-white text-sm">
                  TCS National Qualifier — Nov 15
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {["CSE", "IT", "ECE"].map((d) => (
                    <span key={d} className="badge-blue text-[10px]">{d}</span>
                  ))}
                  <span className="badge-amber text-[10px]">CGPA ≥ 7.0</span>
                  <span className="badge-green text-[10px]">312 eligible</span>
                </div>
              </div>
            </div>

            {/* Floating mini-cards */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute -top-6 -right-4 card p-3 shadow-card-hover w-36"
            >
              <div className="flex items-center gap-2 mb-1">
                <Bell size={12} className="text-primary-600" />
                <span className="text-xs font-semibold text-navy-900 dark:text-white">Notification</span>
              </div>
              <p className="text-xs text-slate-500">Sent to 312 students</p>
              <div className="mt-1.5 flex gap-1">
                {["in-app", "push", "email"].map((c) => (
                  <span key={c} className="text-[9px] bg-primary-50 dark:bg-primary-900/30 text-primary-600 px-1.5 py-0.5 rounded-full">{c}</span>
                ))}
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 3.5, repeat: Infinity }}
              className="absolute -bottom-4 -left-4 card p-3 shadow-card-hover w-40"
            >
              <div className="flex items-center gap-2 mb-1">
                <BarChart3 size={12} className="text-emerald-600" />
                <span className="text-xs font-semibold text-navy-900 dark:text-white">Analytics</span>
              </div>
              <p className="text-xs text-slate-500">85% delivery rate</p>
              <div className="mt-2 w-full h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "85%" }}
                  transition={{ duration: 2, delay: 1 }}
                  className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full"
                />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─── CTA Section ──────────────────────────────────────────────────────────────
function CTASection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  return (
    <section className="py-24 relative overflow-hidden" ref={ref}>
      <div className="absolute inset-0 bg-gradient-to-br from-navy-900 via-navy-800 to-primary-900" />
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary-500 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-cyan-500 rounded-full blur-3xl" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 badge bg-white/10 text-white border border-white/20 mb-8 py-1.5 px-4">
            <Sparkles size={13} />
            <span>Agentic AI Platform</span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-6">
            Make Every Campus
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-blue-300">
              Announcement Count.
            </span>
          </h2>
          <p className="text-slate-300 text-lg mb-10 max-w-2xl mx-auto">
            Stop forwarding PDFs to group chats. Start delivering targeted, trackable, intelligent campus communications.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/login"
              className="btn-primary bg-white text-navy-900 hover:bg-slate-100 shadow-xl text-base px-8 py-3.5 flex items-center justify-center gap-2"
            >
              Start with CampusIQ
              <ArrowRight size={16} />
            </Link>
            <a
              href="#how-it-works"
              className="btn-outline border-white/30 text-white hover:bg-white/10 text-base px-8 py-3.5 flex items-center justify-center gap-2"
            >
              See How It Works
              <ChevronRight size={16} />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="bg-navy-950 text-slate-400 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-600 to-cyan-500 flex items-center justify-center">
                <Brain size={18} className="text-white" />
              </div>
              <span className="font-display text-xl font-bold text-white">
                Campus<span className="text-primary-400">IQ</span>
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              One Circular. Right Students. Right Time. CampusIQ transforms college announcements into personalized, AI-powered communication workflows.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Product</h4>
            <ul className="space-y-2">
              {["Features", "How It Works", "Solutions", "Analytics"].map((item) => (
                <li key={item}>
                  <a href={`#${item.toLowerCase().replace(/ /g, "-")}`} className="text-sm hover:text-white transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Company</h4>
            <ul className="space-y-2">
              {["About", "Privacy", "Terms", "Contact"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm hover:text-white transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm">© 2024 CampusIQ. All rights reserved.</p>
          <div className="flex items-center gap-2 text-xs">
            <MessageSquare size={12} className="text-primary-400" />
            <span>Powered by Agentic AI</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── Main Landing Page ────────────────────────────────────────────────────────
export default function Landing() {
  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const featuresInView = useInView(featuresRef, { once: true });

  return (
    <div className="min-h-screen bg-white dark:bg-navy-950">
      <Navbar />

      {/* Hero */}
      <section ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden pt-16">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/30 to-cyan-50/20 dark:from-navy-950 dark:via-navy-900 dark:to-navy-950" />
        <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-primary-100/40 dark:bg-primary-900/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-cyan-100/30 dark:bg-cyan-900/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10 w-full">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 badge border border-primary-200 dark:border-primary-800 bg-primary-50/80 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 mb-8 py-1.5 px-4"
            >
              <Sparkles size={13} className="text-primary-600 dark:text-primary-400" />
              <span>Powered by Agentic AI</span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-display text-5xl md:text-6xl lg:text-7xl font-black text-navy-900 dark:text-white leading-tight mb-6"
            >
              From Circulars to{" "}
              <span className="gradient-text block md:inline">Intelligent Actions.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed"
            >
              CampusIQ transforms college announcements into personalized, AI-powered communication workflows—ensuring the right information reaches the right students at the right time.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
            >
              <Link
                to="/login"
                className="btn-primary text-base px-8 py-3.5 flex items-center justify-center gap-2 shadow-glow"
              >
                Get Started
                <ArrowRight size={16} />
              </Link>
              <a
                href="#how-it-works"
                className="btn-secondary text-base px-8 py-3.5 flex items-center justify-center gap-2"
              >
                Explore Platform
                <ChevronRight size={16} />
              </a>
            </motion.div>

            {/* Workflow visualization */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="card p-8 shadow-card-hover max-w-3xl mx-auto"
            >
              <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-6 text-center">
                Intelligent Workflow
              </p>
              <WorkflowVisualizer />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Capabilities pills */}
      <section className="py-12 bg-white dark:bg-navy-900 border-y border-slate-100 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { icon: Brain, label: "Intelligent Circular Processing" },
              { icon: Target, label: "Personalized Student Targeting" },
              { icon: MessageSquare, label: "Multi-Channel Communication" },
              { icon: ShieldCheck, label: "Human-in-the-Loop Approval" },
              { icon: BarChart3, label: "Real-Time Analytics" },
              { icon: FileText, label: "Automated Reminders" },
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-surface-muted dark:bg-navy-800 border border-slate-100 dark:border-slate-700 text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                <Icon size={14} className="text-primary-600 dark:text-primary-400" />
                {label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 bg-surface-muted dark:bg-navy-950" ref={featuresRef}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={featuresInView ? { opacity: 1, y: 0 } : {}}
              className="badge-cyan inline-flex items-center gap-2 mb-4 py-1.5 px-3"
            >
              <Zap size={13} />
              <span>Platform Features</span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={featuresInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 }}
              className="section-title mb-4"
            >
              Everything You Need to Communicate{" "}
              <span className="gradient-text">Smarter</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={featuresInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.15 }}
              className="section-subtitle mx-auto"
            >
              Six interconnected capabilities that work together to make campus communication effortless.
            </motion.p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <FeatureCard key={f.title} feature={f} index={i} />
            ))}
          </div>
        </div>
      </section>

      <HowItWorks />
      <Solutions />
      <CTASection />
      <Footer />
    </div>
  );
}
