export function createExportBaseName(illusionId: string, seed: string, now = new Date()): string {
  return `${slugPart(illusionId)}-${slugPart(seed)}-${formatTimestamp(now)}`;
}

export function formatTimestamp(date: Date): string {
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());
  return `${year}${month}${day}-${hours}${minutes}${seconds}`;
}

function slugPart(value: string): string {
  return value.replace(/[^a-z0-9-]+/gi, '-').replace(/^-+|-+$/g, '').toLowerCase() || 'illusion';
}

function pad(value: number): string {
  return String(value).padStart(2, '0');
}
