import type { FeedItem } from './definitions';

export function greetingFor(date: Date): string {
  const hour = date.getHours();
  if (hour >= 5 && hour < 12) return 'Good morning';
  if (hour >= 12 && hour < 18) return 'Good afternoon';
  return 'Good evening';
}

export function formatLens(mm: number): string {
  return `${mm} mm`;
}

export function formatAperture(f: number): string {
  return `ƒ / ${f}`;
}

const monthFormat = new Intl.DateTimeFormat('en', {
  month: 'short',
  timeZone: 'UTC',
});

export function formatCapturedAt(iso: string): string {
  const date = new Date(iso);
  const year = String(date.getUTCFullYear()).slice(-2);
  return `${monthFormat.format(date)} '${year}`;
}

export function photoAlt(item: {
  title: string;
  author: { name: string };
}): string {
  return `${item.title} by ${item.author.name}`;
}

export const ALL_FILTER_ID = 'for-you';

export function filterItems(
  items: FeedItem[],
  filter: string | undefined
): FeedItem[] {
  if (filter === undefined || filter === ALL_FILTER_ID) return items;
  return items.filter((item) => item.tags.includes(filter));
}
