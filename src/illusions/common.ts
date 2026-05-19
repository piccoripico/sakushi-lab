import { EXPORT_SIZE, type ParamControl, type ParamValues } from '../types';

export const classicColors = Object.freeze([
  '#111827',
  '#f8fafc',
  '#0f766e',
  '#3159b7',
  '#b45309',
  '#be123c',
  '#4c1d95',
  '#166534'
]);

export function rangeParam(
  key: string,
  labelKey: string,
  min: number,
  max: number,
  step: number,
  defaultValue: number,
  unit?: string
): ParamControl {
  return { kind: 'range', key, labelKey, min, max, step, defaultValue, unit };
}

export function colorParam(key: string, labelKey: string, defaultValue: string): ParamControl {
  return { kind: 'color', key, labelKey, defaultValue };
}

export function toggleParam(key: string, labelKey: string, defaultValue: boolean): ParamControl {
  return { kind: 'toggle', key, labelKey, defaultValue };
}

export function defaults(schema: readonly ParamControl[]): ParamValues {
  return Object.fromEntries(schema.map((control) => [control.key, control.defaultValue]));
}

export function fill(ctx: CanvasRenderingContext2D, color: string): void {
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

export function svgScale(value: number, size = EXPORT_SIZE): number {
  return value * (size / EXPORT_SIZE);
}

export function polar(cx: number, cy: number, radius: number, angle: number): [number, number] {
  return [cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius];
}

export function hexToRgba(hex: string, alpha: number): string {
  const value = hex.replace('#', '');
  const r = Number.parseInt(value.slice(0, 2), 16);
  const g = Number.parseInt(value.slice(2, 4), 16);
  const b = Number.parseInt(value.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function rounded(value: number, decimals = 2): number {
  return Number(value.toFixed(decimals));
}

export function chooseColorPair(index: number): [string, string] {
  const pairs: [string, string][] = [
    ['#f8fafc', '#111827'],
    ['#fef3c7', '#7f1d1d'],
    ['#dbeafe', '#1e3a8a'],
    ['#dcfce7', '#14532d'],
    ['#f5e8ff', '#4c1d95']
  ];
  return pairs[index % pairs.length];
}
