import { EXPORT_SIZE } from './types';

export function svgDocument(content: string, background = '#ffffff'): string {
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${EXPORT_SIZE}" height="${EXPORT_SIZE}" viewBox="0 0 ${EXPORT_SIZE} ${EXPORT_SIZE}" role="img">`,
    `<rect width="${EXPORT_SIZE}" height="${EXPORT_SIZE}" fill="${escapeAttr(background)}"/>`,
    content,
    '</svg>'
  ].join('');
}

export function svgLine(x1: number, y1: number, x2: number, y2: number, stroke: string, width: number, extra = ''): string {
  return `<line x1="${n(x1)}" y1="${n(y1)}" x2="${n(x2)}" y2="${n(y2)}" stroke="${escapeAttr(stroke)}" stroke-width="${n(width)}" stroke-linecap="round" ${extra}/>`;
}

export function svgCircle(cx: number, cy: number, r: number, fill: string, stroke = 'none', strokeWidth = 0): string {
  const strokePart = stroke === 'none' ? '' : ` stroke="${escapeAttr(stroke)}" stroke-width="${n(strokeWidth)}"`;
  return `<circle cx="${n(cx)}" cy="${n(cy)}" r="${n(r)}" fill="${escapeAttr(fill)}"${strokePart}/>`;
}

export function svgRect(x: number, y: number, width: number, height: number, fill: string): string {
  return `<rect x="${n(x)}" y="${n(y)}" width="${n(width)}" height="${n(height)}" fill="${escapeAttr(fill)}"/>`;
}

export function svgPath(d: string, stroke: string, width: number, fill = 'none', extra = ''): string {
  return `<path d="${d}" fill="${escapeAttr(fill)}" stroke="${escapeAttr(stroke)}" stroke-width="${n(width)}" stroke-linecap="round" stroke-linejoin="round" ${extra}/>`;
}

export function escapeAttr(value: string): string {
  return value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
}

export function n(value: number): string {
  return Number(value.toFixed(3)).toString();
}
