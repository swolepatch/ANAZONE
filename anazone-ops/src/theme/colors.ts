export const colors = {
  bg: '#0A0A0D',
  surface: '#141419',
  border: 'rgba(243,244,247,0.1)',
  ink: '#F3F4F7',
  muted: '#8B8D98',
  cyan: '#2FE8DC',
  pink: '#FF3EA5',
  mint: '#7BF3EA',
  violet: '#C792EA',
  amber: '#FFB84D',
} as const;

export const gradient = {
  accent: [colors.cyan, colors.pink] as const,
};

const CATEGORY_COLORS: Record<string, string> = {
  Branding: colors.pink,
  Marketing: colors.pink,
  Equipment: colors.cyan,
  Cardio: colors.cyan,
  Software: colors.cyan,
  Financials: colors.mint,
  Licensing: colors.mint,
  Staffing: colors.violet,
  Misc: colors.muted,
  Reserve: colors.muted,
  Buildout: colors.amber,
  // staff roles
  Coach: colors.violet,
  Trainer: colors.cyan,
  'Front Desk': colors.mint,
  Manager: colors.pink,
  Cleaner: colors.amber,
  // incident severity
  low: colors.mint,
  medium: colors.amber,
  high: colors.pink,
  // maintenance status
  open: colors.pink,
  'in-progress': colors.amber,
  resolved: colors.cyan,
  // cleaning frequency
  daily: colors.cyan,
  weekly: colors.violet,
  // feed post type
  announcement: colors.cyan,
  handoff: colors.violet,
};

export function categoryColor(category: string): string {
  return CATEGORY_COLORS[category] ?? colors.muted;
}
