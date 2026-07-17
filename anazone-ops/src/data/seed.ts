import { addDays, todayIso } from '@/utils/date';
import { generateId } from '@/utils/id';
import type {
  BudgetItem,
  ChecklistItem,
  CleaningTask,
  DailyTaskCompletion,
  DailyTaskTemplate,
  EquipmentItem,
  FeedPost,
  IncidentReport,
  MaintenanceEntry,
  Milestone,
  Shift,
} from './types';

export function seedChecklist(): ChecklistItem[] {
  const rows: Array<[ChecklistItem['category'], string, boolean]> = [
    ['Branding', 'Finalize logo & brand guidelines', true],
    ['Branding', 'Order signage for storefront', false],
    ['Branding', 'Register trademark for "Anazone Strength Labs"', false],
    ['Equipment', 'Get quotes from 3 rack manufacturers', true],
    ['Equipment', 'Finalize cardio equipment order', false],
    ['Equipment', 'Source competition platforms', false],
    ['Licensing', 'File business registration with the Registraire des entreprises', true],
    ['Licensing', 'Apply for CNESST liability coverage', false],
    ['Licensing', 'Get zoning permit for commercial gym use', false],
    ['Financials', 'Open business bank account', true],
    ['Financials', 'Set up accounting software', true],
    ['Financials', 'Secure startup loan / line of credit', false],
    ['Financials', 'Set up payment processor for memberships', false],
    ['Staffing', 'Post job listing for head coach', false],
    ['Staffing', 'Interview front desk staff', false],
    ['Staffing', 'Draft staff handbook', false],
    ['Marketing', 'Launch Instagram + website teaser', true],
    ['Marketing', 'Plan founding member pre-sale campaign', false],
    ['Marketing', 'Book local influencer partnerships', false],
    ['Software', 'Choose gym management platform', true],
    ['Software', 'Set up class booking system', false],
    ['Software', 'Configure door access system', false],
  ];
  return rows.map(([category, text, done]) => ({ id: generateId(), category, text, done }));
}

export function seedEquipment(): EquipmentItem[] {
  const rows: Array<[EquipmentItem['category'], string, string, number]> = [
    ['Cardio', 'Assault AirBike (x6)', 'Rogue Fitness', 9000],
    ['Cardio', 'RowErg (x4)', 'Concept2', 4200],
    ['Cardio', 'SkiErg (x2)', 'Concept2', 1800],
    ['Strength', 'Power Racks (x6)', 'Rogue Fitness', 10800],
    ['Strength', 'Competition Barbells (x20)', 'Rogue Fitness', 6000],
    ['Free Weights', 'Bumper Plate Set', 'Eleiko', 14500],
    ['Free Weights', 'Dumbbell Set 5-100lb', 'Eleiko', 12000],
    ['Flooring', 'Rubber Gym Flooring (4,000 sqft)', 'Bravo Flooring Montréal', 22000],
    ['Flooring', 'Platform Turf Strip', 'TurfMTL', 3200],
    ['Recovery', 'NormaTec Recovery Boots (x2)', 'Hyperice', 1600],
    ['Recovery', 'Percussion Massagers (x4)', 'Theragun', 2400],
    ['Software', 'POS + Door Access Terminal', 'Brivo', 1200],
  ];
  return rows.map(([category, item, vendor, price]) => ({
    id: generateId(),
    category,
    item,
    vendor,
    price,
  }));
}

export function seedBudget(): BudgetItem[] {
  const rows: Array<[BudgetItem['category'], string, number]> = [
    ['Buildout', 'Leasehold improvements', 180000],
    ['Buildout', 'HVAC upgrade', 35000],
    ['Buildout', 'Locker room renovation', 28000],
    ['Equipment', 'Strength equipment package', 65000],
    ['Equipment', 'Cardio equipment package', 20000],
    ['Licensing', 'Business registration & permits', 2500],
    ['Licensing', 'Insurance (Year 1)', 6000],
    ['Marketing', 'Pre-launch campaign', 8000],
    ['Marketing', 'Signage & branding', 5500],
    ['Staffing', 'Hiring & onboarding', 4000],
    ['Software', 'Gym management platform (Year 1)', 3600],
    ['Reserve', 'Contingency reserve', 25000],
  ];
  return rows.map(([category, label, amount]) => ({ id: generateId(), category, label, amount }));
}

export function seedMilestones(): Milestone[] {
  const rows: Array<[string, Milestone['category'], string]> = [
    ['2026-07-25', 'Licensing', 'Submit zoning permit application'],
    ['2026-08-01', 'Financials', 'Close startup financing round'],
    ['2026-08-15', 'Buildout', 'Begin leasehold improvements'],
    ['2026-09-05', 'Equipment', 'Equipment order deadline (lead time)'],
    ['2026-09-20', 'Staffing', 'Head coach hire finalized'],
    ['2026-10-10', 'Marketing', 'Founding member pre-sale opens'],
    ['2026-10-25', 'Buildout', 'Flooring & rack installation'],
    ['2026-11-01', 'Software', 'Gym management + access systems live'],
    ['2026-11-15', 'Branding', 'Signage installation complete'],
    ['2026-12-01', 'Marketing', 'Grand opening event'],
  ];
  return rows.map(([date, category, title]) => ({ id: generateId(), date, category, title }));
}

export function seedShifts(): Shift[] {
  const today = todayIso();
  const rows: Array<[string, Shift['role'], string, string, string]> = [
    ['Jess Tremblay', 'Manager', today, '06:00', '14:00'],
    ['Marc-André Bissonnette', 'Coach', today, '07:00', '15:00'],
    ['Sofia Nguyen', 'Front Desk', today, '14:00', '22:00'],
    ['Liam Fortin', 'Trainer', addDays(today, 1), '06:00', '14:00'],
    ['Priya Chandra', 'Cleaner', addDays(today, 1), '05:00', '09:00'],
    ['Jess Tremblay', 'Manager', addDays(today, 2), '06:00', '14:00'],
  ];
  return rows.map(([staffName, role, date, startTime, endTime]) => ({
    id: generateId(),
    staffName,
    role,
    date,
    startTime,
    endTime,
  }));
}

export function seedDailyTaskTemplates(): DailyTaskTemplate[] {
  const rows: Array<[DailyTaskTemplate['checklistType'], string, number]> = [
    ['opening', 'Unlock doors & disable alarm', 1],
    ['opening', 'Turn on lights & sound system', 2],
    ['opening', 'Check HVAC and thermostat settings', 3],
    ['opening', 'Wipe down equipment from overnight', 4],
    ['closing', 'Lock all doors & windows', 1],
    ['closing', 'Re-rack weights & tidy floor', 2],
    ['closing', 'Turn off lights & sound system', 3],
    ['closing', 'Set alarm & submit closing report', 4],
  ];
  return rows.map(([checklistType, text, order]) => ({ id: generateId(), checklistType, text, order }));
}

export function seedDailyTaskCompletions(): DailyTaskCompletion[] {
  return [];
}

export function seedIncidents(): IncidentReport[] {
  const today = todayIso();
  const rows: Array<[string, string, string, IncidentReport['severity'], string, string, boolean]> = [
    [
      'Torn cable on lat pulldown',
      'Cable frayed near the pulley, unsafe under load.',
      'Strength Floor',
      'high',
      'Marc-André Bissonnette',
      addDays(today, -2),
      false,
    ],
    [
      'Slippery floor near water fountain',
      'Condensation pooling, minor slip risk.',
      'Front Lobby',
      'medium',
      'Sofia Nguyen',
      addDays(today, -1),
      false,
    ],
    [
      'Locker room hook broken',
      'One coat hook snapped off in the locker room.',
      'Locker Room',
      'low',
      'Priya Chandra',
      addDays(today, -5),
      true,
    ],
    [
      'Member slipped on turf',
      'Minor fall during sled push, no injury reported.',
      'Turf Strip',
      'medium',
      'Jess Tremblay',
      addDays(today, -7),
      true,
    ],
  ];
  return rows.map(([title, description, location, severity, reportedBy, date, resolved]) => ({
    id: generateId(),
    title,
    description,
    location,
    severity,
    reportedBy,
    date,
    resolved,
  }));
}

export function seedFeedPosts(): FeedPost[] {
  const today = todayIso();
  const rows: Array<[FeedPost['type'], string, string, string]> = [
    [
      'announcement',
      'Jess Tremblay',
      'New assault bikes arrive Thursday — please clear space near the cardio wall.',
      addDays(today, -3),
    ],
    [
      'handoff',
      'Sofia Nguyen',
      'Ran out of paper towels at the front desk, restock ordered for tomorrow.',
      addDays(today, -1),
    ],
    [
      'announcement',
      'Jess Tremblay',
      'Founding member pre-sale opens next week — expect extra tour requests.',
      addDays(today, -1),
    ],
    [
      'handoff',
      'Marc-André Bissonnette',
      'Torn cable on lat pulldown is flagged out of service, do not let members use it.',
      today,
    ],
  ];
  return rows.map(([type, author, message, date]) => ({ id: generateId(), type, author, message, date }));
}

export function seedMaintenance(): MaintenanceEntry[] {
  const today = todayIso();
  const rows: Array<[string, string, string, string | null, MaintenanceEntry['status'], string]> = [
    ['Lat Pulldown Cable', 'Cable frayed near the pulley', addDays(today, -2), null, 'open', 'Parts on order from Rogue Fitness.'],
    ['RowErg #3', 'Monitor flickering intermittently', addDays(today, -6), null, 'in-progress', 'Concept2 support ticket open.'],
    [
      'HVAC Unit',
      'Annual inspection & filter change',
      addDays(today, -20),
      addDays(today, -18),
      'resolved',
      'Serviced by Climatisation MTL.',
    ],
    ['Door Access Reader', 'Front door reader unresponsive to fobs', addDays(today, -1), null, 'open', 'Brivo support contacted.'],
  ];
  return rows.map(([equipmentName, issue, dateReported, dateServiced, status, notes]) => ({
    id: generateId(),
    equipmentName,
    issue,
    dateReported,
    dateServiced,
    status,
    notes,
  }));
}

export function seedCleaningTasks(): CleaningTask[] {
  const today = todayIso();
  const rows: Array<[string, CleaningTask['frequency'], string, string | null]> = [
    ['Cardio Equipment Wipe-down', 'daily', 'Priya Chandra', today],
    ['Locker Rooms & Showers', 'daily', 'Priya Chandra', addDays(today, -1)],
    ['Strength Floor & Mats', 'daily', 'Sofia Nguyen', addDays(today, -1)],
    ['Deep Clean Turf Strip', 'weekly', 'Priya Chandra', addDays(today, -6)],
    ['Windows & Front Entrance Glass', 'weekly', 'Sofia Nguyen', null],
  ];
  return rows.map(([area, frequency, assignedTo, lastCompleted]) => ({
    id: generateId(),
    area,
    frequency,
    assignedTo,
    lastCompleted,
  }));
}
