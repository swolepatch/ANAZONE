import { generateId } from '@/utils/id';
import type { BudgetItem, ChecklistItem, EquipmentItem, Milestone } from './types';

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
