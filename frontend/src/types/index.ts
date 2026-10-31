// ─── User & Auth ──────────────────────────────────────────────────────────────
export type UserRole = "student" | "faculty" | "super_admin";

export interface User {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
  avatarUrl?: string;
  institutionId: string;
  departmentId?: string;
}

// ─── Circular & Announcement ──────────────────────────────────────────────────
export type AnnouncementCategory =
  | "placement"
  | "internship"
  | "scholarship"
  | "seminar"
  | "workshop"
  | "exam"
  | "sports"
  | "cultural"
  | "general";

export type AnnouncementStatus = "draft" | "pending_approval" | "approved" | "live" | "expired" | "cancelled";
export type AnnouncementPriority = "low" | "medium" | "high" | "urgent";

export interface ExtractedAnnouncement {
  title: string;
  category: AnnouncementCategory;
  description: string;
  eventDate?: string;
  eventTime?: string;
  venue?: string;
  registrationDeadline?: string;
  eligibleDepartments: string[];
  eligibleYears: number[];
  minCGPA?: number;
  requiredSkills: string[];
  registrationLink?: string;
  confidenceScore?: number;
  missingFields?: string[];
}

export interface Announcement {
  id: string;
  title: string;
  category: AnnouncementCategory;
  description: string;
  priority: AnnouncementPriority;
  status: AnnouncementStatus;
  eventDate?: string;
  eventTime?: string;
  venue?: string;
  registrationDeadline?: string;
  registrationLink?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  recipientCount?: number;
  isRegistered?: boolean;
  isAcknowledged?: boolean;
}

// ─── Student ──────────────────────────────────────────────────────────────────
export type EligibilityStatus = "eligible" | "ineligible" | "review_required";
export type EnrollmentStatus = "active" | "on_leave" | "graduated" | "dropped";

export interface Student {
  id: string;
  name: string;
  email: string;
  studentId: string;
  department: string;
  year: number;
  section: string;
  cgpa: number;
  skills: string[];
  enrollmentStatus: EnrollmentStatus;
  eligibilityStatus?: EligibilityStatus;
}

// ─── AI Processing ────────────────────────────────────────────────────────────
export type AIStepStatus = "pending" | "running" | "completed" | "needs_review" | "failed";

export interface AIProcessingStep {
  id: string;
  label: string;
  status: AIStepStatus;
  detail?: string;
  completedAt?: string;
}

export interface AIProcessingState {
  circularId: string;
  steps: AIProcessingStep[];
  currentStep: number;
  isComplete: boolean;
  needsReview: boolean;
  extractedData?: ExtractedAnnouncement;
}

// ─── Notification ─────────────────────────────────────────────────────────────
export type NotificationChannel = "in_app" | "push" | "email" | "whatsapp";
export type NotificationStatus = "queued" | "sent" | "delivered" | "failed" | "opened";

export interface NotificationCampaign {
  id: string;
  announcementId: string;
  title: string;
  message: string;
  channels: NotificationChannel[];
  priority: AnnouncementPriority;
  scheduledAt?: string;
  sentAt?: string;
  status: "draft" | "scheduled" | "sending" | "sent" | "failed";
  recipientCount: number;
  deliveredCount: number;
  openedCount: number;
  estimatedCost?: number;
}

export interface StudentNotification {
  id: string;
  title: string;
  message: string;
  channel: NotificationChannel;
  status: NotificationStatus;
  isRead: boolean;
  priority: AnnouncementPriority;
  announcementId?: string;
  createdAt: string;
  readAt?: string;
}

// ─── Analytics ────────────────────────────────────────────────────────────────
export interface AnalyticsSummary {
  totalAnnouncements: number;
  totalRecipients: number;
  notificationsQueued: number;
  notificationsSent: number;
  deliveryConfirmed: number;
  deliveryFailed: number;
  acknowledgmentRate: number;
  registrationRate: number;
  estimatedSpend: number;
}

export interface ChartDataPoint {
  name: string;
  value?: number;
  [key: string]: string | number | undefined;
}

// ─── Reminder ─────────────────────────────────────────────────────────────────
export type ReminderStatus = "scheduled" | "sent" | "paused" | "cancelled";

export interface Reminder {
  id: string;
  announcementId: string;
  announcementTitle: string;
  message: string;
  channels: NotificationChannel[];
  scheduledAt: string;
  status: ReminderStatus;
  recipientCount: number;
}

// ─── API Responses ────────────────────────────────────────────────────────────
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export interface ApiError {
  message: string;
  code?: string;
  field?: string;
}

// ─── Form Types ───────────────────────────────────────────────────────────────
export interface EligibilityFilter {
  departments: string[];
  years: number[];
  sections: string[];
  minCgpa: number | null;
  skills: string[];
  enrollmentStatus: EnrollmentStatus[];
}

export interface CampaignForm {
  title: string;
  message: string;
  priority: AnnouncementPriority;
  channels: NotificationChannel[];
  scheduledAt?: string;
  registrationLink?: string;
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
export interface FacultyDashboardStats {
  totalStudents: number;
  activeAnnouncements: number;
  pendingApprovals: number;
  notificationsSent: number;
}

export interface ImportRecord {
  studentId: string;
  name: string;
  email: string;
  department: string;
  year: number;
  section: string;
  status: "valid" | "invalid" | "duplicate" | "updated";
  errors?: string[];
}
