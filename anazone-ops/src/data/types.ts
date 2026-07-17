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
