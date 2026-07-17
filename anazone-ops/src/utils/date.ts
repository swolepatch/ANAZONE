const SHORT_FORMAT = new Intl.DateTimeFormat('en-CA', { month: 'short', day: 'numeric' });
const LONG_FORMAT = new Intl.DateTimeFormat('en-CA', { month: 'short', day: 'numeric', year: 'numeric' });

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function formatDateShort(iso: string): string {
  return SHORT_FORMAT.format(new Date(`${iso}T00:00:00`));
}

export function formatDateLong(iso: string): string {
  return LONG_FORMAT.format(new Date(`${iso}T00:00:00`));
}

export function daysUntil(iso: string): number {
  const target = startOfDay(new Date(`${iso}T00:00:00`));
  const today = startOfDay(new Date());
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.round((target.getTime() - today.getTime()) / msPerDay);
}

export function todayIso(): string {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}
