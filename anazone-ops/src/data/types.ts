export const CHECKLIST_CATEGORIES = [
  'Branding',
  'Equipment',
  'Licensing',
  'Financials',
  'Staffing',
  'Marketing',
  'Software',
] as const;
export type ChecklistCategory = (typeof CHECKLIST_CATEGORIES)[number];

export interface ChecklistItem {
  id: string;
  category: ChecklistCategory;
  text: string;
  done: boolean;
}

export const EQUIPMENT_CATEGORIES = [
  'Cardio',
  'Strength',
  'Free Weights',
  'Flooring',
  'Recovery',
  'Software',
  'Misc',
] as const;
export type EquipmentCategory = (typeof EQUIPMENT_CATEGORIES)[number];

export interface EquipmentItem {
  id: string;
  category: EquipmentCategory;
  item: string;
  vendor: string;
  price: number;
}

export const BUDGET_CATEGORIES = [
  'Buildout',
  'Equipment',
  'Licensing',
  'Marketing',
  'Staffing',
  'Software',
  'Reserve',
] as const;
export type BudgetCategory = (typeof BUDGET_CATEGORIES)[number];

export interface BudgetItem {
  id: string;
  category: BudgetCategory;
  label: string;
  amount: number;
}

export const MILESTONE_CATEGORIES = [
  'Branding',
  'Equipment',
  'Licensing',
  'Financials',
  'Staffing',
  'Marketing',
  'Software',
  'Buildout',
] as const;
export type MilestoneCategory = (typeof MILESTONE_CATEGORIES)[number];

export interface Milestone {
  id: string;
  date: string;
  category: MilestoneCategory;
  title: string;
}

export const STAFF_ROLES = ['Coach', 'Trainer', 'Front Desk', 'Manager', 'Cleaner'] as const;
export type StaffRole = (typeof STAFF_ROLES)[number];

// Supabase-backed (Part 4 sync upgrade) — see the "Supabase-backed domain
// types" section below for the shape that replaced the old local-only one.

export const CHECKLIST_TYPES = ['opening', 'closing'] as const;
export type DailyChecklistType = (typeof CHECKLIST_TYPES)[number];

export interface DailyTaskTemplate {
  id: string;
  checklistType: DailyChecklistType;
  text: string;
  order: number;
}

export interface DailyTaskCompletion {
  id: string;
  taskId: string;
  date: string;
  done: boolean;
}

export const INCIDENT_SEVERITIES = ['low', 'medium', 'high'] as const;
export type IncidentSeverity = (typeof INCIDENT_SEVERITIES)[number];

export interface IncidentReport {
  id: string;
  title: string;
  description: string;
  location: string;
  severity: IncidentSeverity;
  reportedById: string;
  date: string;
  resolved: boolean;
}

export const FEED_POST_TYPES = ['announcement', 'handoff'] as const;
export type FeedPostType = (typeof FEED_POST_TYPES)[number];
// FeedPost itself is Supabase-backed (Part 4 sync upgrade) — see below.

export const MAINTENANCE_STATUSES = ['open', 'in-progress', 'resolved'] as const;
export type MaintenanceStatus = (typeof MAINTENANCE_STATUSES)[number];

export interface MaintenanceEntry {
  id: string;
  equipmentName: string;
  issue: string;
  dateReported: string;
  dateServiced: string | null;
  status: MaintenanceStatus;
  notes: string;
}

export const CLEANING_FREQUENCIES = ['daily', 'weekly'] as const;
export type CleaningFrequency = (typeof CLEANING_FREQUENCIES)[number];

export interface CleaningTask {
  id: string;
  area: string;
  frequency: CleaningFrequency;
  assignedTo: string;
  lastCompleted: string | null;
}

// ---- Supabase-backed domain types (Parts 1-4) ----

export const CONVERSATION_TYPES = ['group', 'dm'] as const;
export type ConversationType = (typeof CONVERSATION_TYPES)[number];

export interface Conversation {
  id: string;
  type: ConversationType;
  name: string | null;
  created_at: string;
}

export interface ConversationParticipant {
  conversation_id: string;
  staff_id: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  text: string;
  created_at: string;
}

export interface MessageRead {
  message_id: string;
  staff_id: string;
  read_at: string;
}

export interface ConversationSummary {
  id: string;
  type: ConversationType;
  name: string | null;
  otherParticipant: { id: string; name: string; avatar_url: string | null } | null;
  lastMessage: { text: string; created_at: string; sender_id: string } | null;
  unread: boolean;
}

export interface Shift {
  id: string;
  staff_id: string;
  role: StaffRole;
  date: string;
  start_time: string;
  end_time: string;
  created_at: string;
}

export interface FeedPost {
  id: string;
  type: FeedPostType;
  author_id: string;
  message: string;
  created_at: string;
}
