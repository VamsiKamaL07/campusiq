import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Users,
  CheckCircle2,
  Clock,
  Download,
  Search,
  Filter,
  Check,
  X,
  Send,
  Building,
  GraduationCap,
  Sparkles,
  QrCode,
  FileSpreadsheet,
  AlertCircle,
  ExternalLink,
  ChevronDown,
} from "lucide-react";
import { demoAnnouncements, demoStudents, DEMO_DEPARTMENTS } from "../../lib/demoData";
import { cn } from "../../lib/utils";

type RegStatus = "confirmed" | "attended" | "waitlisted" | "cancelled";

interface StudentRegistration {
  id: string;
  studentId: string;
  studentName: string;
  rollNo: string;
  email: string;
  department: string;
  year: number;
  cgpa: number;
  announcementId: string;
  announcementTitle: string;
  registeredAt: string;
  status: RegStatus;
  checkInTime?: string;
  notes?: string;
}

const INITIAL_REGISTRATIONS: StudentRegistration[] = [
  {
    id: "reg-1",
    studentId: "s-1",
    studentName: "Aarav Sharma",
    rollNo: "21AD001",
    email: "aarav.sharma@college.edu",
    department: "AI & DS",
    year: 4,
    cgpa: 8.8,
    announcementId: "ann-1",
    announcementTitle: "TCS National Qualifier 2024 — On-Campus Drive",
    registeredAt: "2024-10-21T09:15:00Z",
    status: "confirmed",
  },
  {
    id: "reg-2",
    studentId: "s-2",
    studentName: "Diya Patel",
    rollNo: "21CS045",
    email: "diya.patel@college.edu",
    department: "CSE",
    year: 4,
    cgpa: 9.1,
    announcementId: "ann-1",
    announcementTitle: "TCS National Qualifier 2024 — On-Campus Drive",
    registeredAt: "2024-10-21T10:30:00Z",
    status: "attended",
    checkInTime: "09:05 AM",
  },
  {
    id: "reg-3",
    studentId: "s-3",
    studentName: "Rohan Verma",
    rollNo: "22IT012",
    email: "rohan.v@college.edu",
    department: "IT",
    year: 3,
    cgpa: 7.9,
    announcementId: "ann-2",
    announcementTitle: "GATE 2025 Preparation Workshop — AI & DS Track",
    registeredAt: "2024-10-19T14:20:00Z",
    status: "attended",
    checkInTime: "09:55 AM",
  },
  {
    id: "reg-4",
    studentId: "s-4",
    studentName: "Ananya Iyer",
    rollNo: "22AD033",
    email: "ananya.i@college.edu",
    department: "AI & DS",
    year: 3,
    cgpa: 8.4,
    announcementId: "ann-2",
    announcementTitle: "GATE 2025 Preparation Workshop — AI & DS Track",
    registeredAt: "2024-10-20T11:45:00Z",
    status: "confirmed",
  },
  {
    id: "reg-5",
    studentId: "s-5",
    studentName: "Karthik Nair",
    rollNo: "21CS102",
    email: "karthik.n@college.edu",
    department: "CSE",
    year: 4,
    cgpa: 7.4,
    announcementId: "ann-5",
    announcementTitle: "Infosys InfyTQ Hackathon — Register Your Team",
    registeredAt: "2024-10-22T16:10:00Z",
    status: "waitlisted",
  },
  {
    id: "reg-6",
    studentId: "s-6",
    studentName: "Pooja Reddy",
    rollNo: "23EC089",
    email: "pooja.r@college.edu",
    department: "ECE",
    year: 2,
    cgpa: 8.6,
    announcementId: "ann-3",
    announcementTitle: "National Science Scholarship — Apply Now",
    registeredAt: "2024-10-18T12:00:00Z",
    status: "confirmed",
  },
  {
    id: "reg-7",
    studentId: "s-7",
    studentName: "Siddharth Joshi",
    rollNo: "21AD055",
    email: "siddharth.j@college.edu",
    department: "AI & DS",
    year: 4,
    cgpa: 8.9,
    announcementId: "ann-1",
    announcementTitle: "TCS National Qualifier 2024 — On-Campus Drive",
    registeredAt: "2024-10-21T18:22:00Z",
    status: "confirmed",
  },
  {
    id: "reg-8",
    studentId: "s-8",
    studentName: "Meera Krishnan",
    rollNo: "22CS077",
    email: "meera.k@college.edu",
    department: "CSE",
    year: 3,
    cgpa: 9.3,
    announcementId: "ann-2",
    announcementTitle: "GATE 2025 Preparation Workshop — AI & DS Track",
    registeredAt: "2024-10-20T15:30:00Z",
    status: "attended",
    checkInTime: "10:02 AM",
  },
];

export default function FacultyRegistrations() {
  const [registrations, setRegistrations] = useState<StudentRegistration[]>(INITIAL_REGISTRATIONS);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [quickCheckInModal, setQuickCheckInModal] = useState(false);
  const [checkInRoll, setCheckInRoll] = useState("");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Filtered registrations
  const filtered = useMemo(() => {
    return registrations.filter((r) => {
      if (selectedAnnouncement !== "all" && r.announcementId !== selectedAnnouncement) return false;
      if (statusFilter !== "all" && r.status !== statusFilter) return false;
      if (departmentFilter !== "all" && r.department !== departmentFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          r.studentName.toLowerCase().includes(q) ||
          r.rollNo.toLowerCase().includes(q) ||
          r.email.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [registrations, selectedAnnouncement, statusFilter, departmentFilter, searchQuery]);

  // Metrics
  const stats = useMemo(() => {
    const total = registrations.length;
    const attended = registrations.filter((r) => r.status === "attended").length;
    const confirmed = registrations.filter((r) => r.status === "confirmed").length;
    const waitlisted = registrations.filter((r) => r.status === "waitlisted").length;
    const rate = total > 0 ? Math.round((attended / total) * 100) : 0;
    return { total, attended, confirmed, waitlisted, rate };
  }, [registrations]);

  // Status changer
  const updateStatus = (id: string, newStatus: RegStatus) => {
    setRegistrations((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          return {
            ...r,
            status: newStatus,
            checkInTime: newStatus === "attended" ? new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : r.checkInTime,
          };
        }
        return r;
      })
    );
    showToast(`Registration status updated to "${newStatus}".`);
  };

  // Quick Check-in by roll number
  const handleQuickCheckIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkInRoll.trim()) return;
    const found = registrations.find(
      (r) => r.rollNo.toLowerCase() === checkInRoll.trim().toLowerCase()
    );
    if (found) {
      updateStatus(found.id, "attended");
      showToast(`Checked in: ${found.studentName} (${found.rollNo})`);
      setCheckInRoll("");
      setQuickCheckInModal(false);
    } else {
      showToast(`Roll number "${checkInRoll}" not found in current registrations.`);
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = ["Roll No", "Student Name", "Email", "Department", "Year", "CGPA", "Announcement", "Registration Date", "Status"];
    const rows = filtered.map((r) => [
      r.rollNo,
      `"${r.studentName}"`,
      r.email,
      `"${r.department}"`,
      r.year,
      r.cgpa,
      `"${r.announcementTitle}"`,
      new Date(r.registeredAt).toLocaleDateString(),
      r.status,
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `campusiq_registrations_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Registration list downloaded as CSV.");
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Toast Alert */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-12 right-6 z-50 bg-navy-900 text-white px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 border border-primary-500/30 text-sm font-medium"
          >
            <CheckCircle2 size={16} className="text-emerald-400" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="badge badge-primary">Faculty Portal</span>
            <span className="badge badge-cyan">Live Sync</span>
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-navy-900 dark:text-white flex items-center gap-2.5">
            <BookOpen size={28} className="text-primary-600" />
            Registration Management
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">
            Track student applications, manage attendance check-ins, and export participant records.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setQuickCheckInModal(true)}
            className="btn-secondary flex items-center gap-1.5 text-xs py-2 px-3"
          >
            <QrCode size={15} />
            Quick Check-in
          </button>
          <button
            onClick={handleExportCSV}
            className="btn-primary flex items-center gap-1.5 text-xs py-2 px-3"
          >
            <Download size={15} />
            Export CSV
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          whileHover={{ y: -2 }}
          className="card p-4 bg-gradient-to-br from-primary-50 to-white dark:from-primary-950/20 dark:to-navy-900 border-primary-100 dark:border-primary-900/40"
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold text-primary-700 dark:text-primary-300 uppercase tracking-wider">
              Total Registrations
            </p>
            <div className="w-8 h-8 rounded-lg bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center">
              <Users size={16} className="text-primary-600" />
            </div>
          </div>
          <p className="font-display text-3xl font-bold text-navy-900 dark:text-white">
            {stats.total}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Across all active circulars</p>
        </motion.div>

        <motion.div
          whileHover={{ y: -2 }}
          className="card p-4 bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-950/20 dark:to-navy-900 border-emerald-100 dark:border-emerald-900/40"
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider">
              Verified Attended
            </p>
            <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center">
              <CheckCircle2 size={16} className="text-emerald-600" />
            </div>
          </div>
          <p className="font-display text-3xl font-bold text-navy-900 dark:text-white">
            {stats.attended}
          </p>
          <div className="flex items-center gap-1.5 mt-1">
            <div className="flex-1 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full"
                style={{ width: `${stats.rate}%` }}
              />
            </div>
            <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
              {stats.rate}%
            </span>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -2 }}
          className="card p-4 bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/20 dark:to-navy-900 border-blue-100 dark:border-blue-900/40"
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold text-blue-700 dark:text-blue-300 uppercase tracking-wider">
              Confirmed / Ready
            </p>
            <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
              <Sparkles size={16} className="text-blue-600" />
            </div>
          </div>
          <p className="font-display text-3xl font-bold text-navy-900 dark:text-white">
            {stats.confirmed}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Awaiting event check-in</p>
        </motion.div>

        <motion.div
          whileHover={{ y: -2 }}
          className="card p-4 bg-gradient-to-br from-amber-50 to-white dark:from-amber-950/20 dark:to-navy-900 border-amber-100 dark:border-amber-900/40"
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold text-amber-700 dark:text-amber-300 uppercase tracking-wider">
              Waitlisted
            </p>
            <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center">
              <Clock size={16} className="text-amber-600" />
            </div>
          </div>
          <p className="font-display text-3xl font-bold text-navy-900 dark:text-white">
            {stats.waitlisted}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Pending capacity expansion</p>
        </motion.div>
      </div>

      {/* Filter and Search Bar */}
      <div className="card p-4 space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search input */}
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              className="input pl-9 text-sm"
              placeholder="Search by student name, roll number, or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Announcement selector */}
          <div className="w-full md:w-64">
            <select
              className="input text-sm"
              value={selectedAnnouncement}
              onChange={(e) => setSelectedAnnouncement(e.target.value)}
            >
              <option value="all">All Announcements ({demoAnnouncements.length})</option>
              {demoAnnouncements.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.title.length > 32 ? a.title.slice(0, 32) + "…" : a.title}
                </option>
              ))}
            </select>
          </div>

          {/* Department selector */}
          <div className="w-full md:w-44">
            <select
              className="input text-sm"
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
            >
              <option value="all">All Departments</option>
              {DEMO_DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          {/* Status selector */}
          <div className="w-full md:w-36">
            <select
              className="input text-sm capitalize"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="confirmed">Confirmed</option>
              <option value="attended">Attended</option>
              <option value="waitlisted">Waitlisted</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Active announcement capacity ribbon */}
        {selectedAnnouncement !== "all" && (
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-navy-800 dark:text-slate-200">
                Event: {demoAnnouncements.find((a) => a.id === selectedAnnouncement)?.title}
              </span>
              <span>•</span>
              <span>Deadline: {demoAnnouncements.find((a) => a.id === selectedAnnouncement)?.registrationDeadline ?? "Open"}</span>
            </div>
            <div className="flex items-center gap-2">
              <span>Capacity: {filtered.length} / 120 seats filled</span>
            </div>
          </div>
        )}
      </div>

      {/* Registrations Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-navy-950/60 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider font-semibold border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="px-4 py-3.5">Student</th>
                <th className="px-4 py-3.5">Roll No & Dept</th>
                <th className="px-4 py-3.5">Announcement</th>
                <th className="px-4 py-3.5">CGPA</th>
                <th className="px-4 py-3.5">Registered</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-slate-400">
                    <BookOpen size={36} className="mx-auto mb-2 opacity-40" />
                    <p className="font-medium">No registrations found</p>
                    <p className="text-xs mt-1">Try adjusting your search criteria or filters.</p>
                  </td>
                </tr>
              ) : (
                filtered.map((r) => {
                  return (
                    <motion.tr
                      key={r.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-slate-50/70 dark:hover:bg-navy-800/40 transition-colors"
                    >
                      {/* Student info */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-600 to-cyan-600 text-white font-bold text-xs flex items-center justify-center flex-shrink-0">
                            {r.studentName.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium text-navy-900 dark:text-white leading-tight">
                              {r.studentName}
                            </p>
                            <p className="text-xs text-slate-400">{r.email}</p>
                          </div>
                        </div>
                      </td>

                      {/* Roll & Dept */}
                      <td className="px-4 py-3.5">
                        <span className="font-mono text-xs font-semibold text-slate-700 dark:text-slate-300">
                          {r.rollNo}
                        </span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="badge badge-primary text-[10px] py-0 px-1.5">
                            {r.department}
                          </span>
                          <span className="text-[11px] text-slate-400">Yr {r.year}</span>
                        </div>
                      </td>

                      {/* Announcement */}
                      <td className="px-4 py-3.5 max-w-xs">
                        <p className="truncate text-navy-800 dark:text-slate-200 font-medium">
                          {r.announcementTitle}
                        </p>
                        {r.checkInTime && (
                          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-0.5">
                            <Check size={10} /> Checked in at {r.checkInTime}
                          </span>
                        )}
                      </td>

                      {/* CGPA */}
                      <td className="px-4 py-3.5">
                        <span
                          className={cn(
                            "font-semibold text-xs px-2 py-0.5 rounded-md",
                            r.cgpa >= 8.5
                              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300"
                              : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                          )}
                        >
                          {r.cgpa.toFixed(1)}
                        </span>
                      </td>

                      {/* Registered Date */}
                      <td className="px-4 py-3.5 text-xs text-slate-500 whitespace-nowrap">
                        {new Date(r.registeredAt).toLocaleDateString([], {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3.5">
                        <span
                          className={cn(
                            "badge text-xs capitalize",
                            r.status === "attended" && "badge-green",
                            r.status === "confirmed" && "badge-blue",
                            r.status === "waitlisted" && "badge-amber",
                            r.status === "cancelled" && "badge-red"
                          )}
                        >
                          {r.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3.5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {r.status !== "attended" ? (
                            <button
                              onClick={() => updateStatus(r.id, "attended")}
                              title="Mark Attended"
                              className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-colors"
                            >
                              <CheckCircle2 size={16} />
                            </button>
                          ) : (
                            <button
                              onClick={() => updateStatus(r.id, "confirmed")}
                              title="Revert to Confirmed"
                              className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            >
                              <Clock size={16} />
                            </button>
                          )}

                          {r.status === "waitlisted" ? (
                            <button
                              onClick={() => updateStatus(r.id, "confirmed")}
                              title="Confirm Registration"
                              className="p-1.5 rounded-lg text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-950/30 transition-colors text-xs font-semibold px-2"
                            >
                              Promote
                            </button>
                          ) : (
                            <button
                              onClick={() => updateStatus(r.id, "waitlisted")}
                              title="Move to Waitlist"
                              className="p-1.5 rounded-lg text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/30 transition-colors"
                            >
                              <Clock size={15} />
                            </button>
                          )}

                          <button
                            onClick={() => updateStatus(r.id, "cancelled")}
                            title="Cancel Registration"
                            className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                          >
                            <X size={15} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Check-In Modal */}
      <AnimatePresence>
        {quickCheckInModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="card p-6 max-w-md w-full shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 flex items-center justify-center">
                    <QrCode size={18} />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-navy-900 dark:text-white">
                      Desk Check-In
                    </h3>
                    <p className="text-xs text-slate-400">Scan barcode or enter roll number</p>
                  </div>
                </div>
                <button
                  onClick={() => setQuickCheckInModal(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleQuickCheckIn} className="space-y-4 pt-2">
                <div>
                  <label className="label text-xs uppercase" htmlFor="check-in-input">
                    Student Roll Number
                  </label>
                  <input
                    id="check-in-input"
                    type="text"
                    className="input text-base uppercase font-mono tracking-wider font-bold"
                    placeholder="e.g. 21AD001"
                    value={checkInRoll}
                    onChange={(e) => setCheckInRoll(e.target.value)}
                    autoFocus
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Press Enter to verify and instantly mark attendance.
                  </p>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setQuickCheckInModal(false)}
                    className="btn-secondary text-xs py-2"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary text-xs py-2 flex items-center gap-1.5">
                    <CheckCircle2 size={14} />
                    Confirm Attendance
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
