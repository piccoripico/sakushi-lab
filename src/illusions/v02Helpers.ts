import { escapeAttr, n, svgCircle, svgLine, svgPath, svgRect } from '../svg';
import { EXPORT_SIZE, type ParamValues } from '../types';
import { fill } from './common';

export const MID = EXPORT_SIZE / 2;

export function renderScaled(ctx: CanvasRenderingContext2D, background: string, draw: (ctx: CanvasRenderingContext2D) => void): void {
  fill(ctx, background);
  ctx.save();
  const scale = ctx.canvas.width / EXPORT_SIZE;
  ctx.scale(scale, scale);
  draw(ctx);
  ctx.restore();
}

export function canvasLine(
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  color: string,
  width: number,
  cap: CanvasLineCap = 'round'
): void {
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineCap = cap;
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

export function canvasCircle(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  radius: number,
  fillColor: string,
  strokeColor = 'none',
  strokeWidth = 0
): void {
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.fillStyle = fillColor;
  ctx.fill();
  if (strokeColor !== 'none' && strokeWidth > 0) {
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = strokeWidth;
    ctx.stroke();
  }
}

export function canvasPolygon(ctx: CanvasRenderingContext2D, points: readonly [number, number][], fillColor: string, strokeColor = 'none', strokeWidth = 0): void {
  ctx.beginPath();
  for (const [index, point] of points.entries()) {
    if (index === 0) {
      ctx.moveTo(point[0], point[1]);
    } else {
      ctx.lineTo(point[0], point[1]);
    }
  }
  ctx.closePath();
  ctx.fillStyle = fillColor;
  ctx.fill();
  if (strokeColor !== 'none' && strokeWidth > 0) {
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = strokeWidth;
    ctx.lineJoin = 'round';
    ctx.stroke();
  }
}

export function canvasRotatedRect(ctx: CanvasRenderingContext2D, cx: number, cy: number, width: number, height: number, angle: number, fillColor: string): void {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(angle);
  ctx.fillStyle = fillColor;
  ctx.fillRect(-width / 2, -height / 2, width, height);
  ctx.restore();
}

export function svgPolygon(points: readonly [number, number][], fillColor: string, strokeColor = 'none', strokeWidth = 0, extra = ''): string {
  const strokePart = strokeColor === 'none' ? '' : ` stroke="${escapeAttr(strokeColor)}" stroke-width="${n(strokeWidth)}"`;
  return `<polygon points="${points.map(([x, y]) => `${n(x)},${n(y)}`).join(' ')}" fill="${escapeAttr(fillColor)}"${strokePart} ${extra}/>`;
}

export function svgRotatedRect(cx: number, cy: number, width: number, height: number, angleDegrees: number, fillColor: string): string {
  return svgRect(cx - width / 2, cy - height / 2, width, height, fillColor).replace('/>', ` transform="rotate(${n(angleDegrees)} ${n(cx)} ${n(cy)})"/>`);
}

export function gray(value: number): string {
  const channel = Math.max(0, Math.min(255, Math.round(value)));
  const hex = channel.toString(16).padStart(2, '0');
  return `#${hex}${hex}${hex}`;
}

export function mixHex(a: string, b: string, amount: number): string {
  const av = parseHex(a);
  const bv = parseHex(b);
  const t = Math.max(0, Math.min(1, amount));
  return `#${av.map((channel, index) => Math.round(channel + (bv[index] - channel) * t).toString(16).padStart(2, '0')).join('')}`;
}

export function svgOpenGroup(extra = ''): string {
  return `<g ${extra}>`;
}

export function svgStrokeLine(x1: number, y1: number, x2: number, y2: number, params: ParamValues, colorKey = 'foreground', widthKey = 'lineWidth'): string {
  return svgLine(x1, y1, x2, y2, String(params[colorKey]), Number(params[widthKey]));
}

export function svgAnnularSector(cx: number, cy: number, outer: number, inner: number, start: number, end: number, fillColor: string): string {
  const largeArc = end - start > Math.PI ? 1 : 0;
  const p1 = point(cx, cy, outer, start);
  const p2 = point(cx, cy, outer, end);
  const p3 = point(cx, cy, inner, end);
  const p4 = point(cx, cy, inner, start);
  const d = [
    `M ${n(p1[0])} ${n(p1[1])}`,
    `A ${n(outer)} ${n(outer)} 0 ${largeArc} 1 ${n(p2[0])} ${n(p2[1])}`,
    `L ${n(p3[0])} ${n(p3[1])}`,
    `A ${n(inner)} ${n(inner)} 0 ${largeArc} 0 ${n(p4[0])} ${n(p4[1])}`,
    'Z'
  ].join(' ');
  return svgPath(d, 'none', 0, fillColor);
}

export function canvasAnnularSector(ctx: CanvasRenderingContext2D, cx: number, cy: number, outer: number, inner: number, start: number, end: number, fillColor: string): void {
  ctx.beginPath();
  ctx.arc(cx, cy, outer, start, end);
  ctx.arc(cx, cy, inner, end, start, true);
  ctx.closePath();
  ctx.fillStyle = fillColor;
  ctx.fill();
}

export function point(cx: number, cy: number, radius: number, angle: number): [number, number] {
  return [cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius];
}

export function svgCircleStroke(cx: number, cy: number, radius: number, stroke: string, width: number): string {
  return svgCircle(cx, cy, radius, 'none', stroke, width);
}

function parseHex(hex: string): [number, number, number] {
  const value = hex.replace('#', '');
  return [
    Number.parseInt(value.slice(0, 2), 16),
    Number.parseInt(value.slice(2, 4), 16),
    Number.parseInt(value.slice(4, 6), 16)
  ];
}
