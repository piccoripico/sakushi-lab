export const PREVIEW_SIZE = 900;
export const EXPORT_SIZE = 1600;
export const WEBM_DURATION_MS = 4000;
export const WEBM_FRAME_RATE = 30;
export const DEFAULT_PREVIEW_DISPLAY_SIZE = 'medium';
export const PREVIEW_DISPLAY_SIZES = Object.freeze(['small', 'medium', 'large'] as const);

export type ParamValue = number | string | boolean;
export type ParamValues = Record<string, ParamValue>;
export type PreviewDisplaySize = (typeof PREVIEW_DISPLAY_SIZES)[number];

export interface RenderFrame {
  width: number;
  height: number;
  time: number;
  progress: number;
}

export interface RangeParam {
  kind: 'range';
  key: string;
  labelKey: string;
  min: number;
  max: number;
  step: number;
  defaultValue: number;
  unit?: string;
}

export interface ColorParam {
  kind: 'color';
  key: string;
  labelKey: string;
  defaultValue: string;
}

export interface ToggleParam {
  kind: 'toggle';
  key: string;
  labelKey: string;
  defaultValue: boolean;
}

export type ParamControl = RangeParam | ColorParam | ToggleParam;

export interface Rng {
  next: () => number;
  float: (min: number, max: number, decimals?: number) => number;
  int: (min: number, max: number) => number;
  pick: <T>(items: readonly T[]) => T;
}

export interface IllusionDefinition {
  id: string;
  version: number;
  titleKey: string;
  descriptionKey: string;
  supportsAnimation: boolean;
  defaultParams: ParamValues;
  paramSchema: readonly ParamControl[];
  randomize: (rng: Rng) => ParamValues;
  renderCanvas: (ctx: CanvasRenderingContext2D, params: ParamValues, frame: RenderFrame) => void;
  renderSvg: (params: ParamValues) => string;
}

export function sanitizeParams(definition: IllusionDefinition, raw: unknown): ParamValues {
  const source = isRecord(raw) ? raw : {};
  const sanitized: ParamValues = {};

  for (const control of definition.paramSchema) {
    const fallback = definition.defaultParams[control.key] ?? control.defaultValue;
    const value = source[control.key];

    if (control.kind === 'color') {
      sanitized[control.key] = isHexColor(value) ? value : fallback;
      continue;
    }

    if (control.kind === 'toggle') {
      sanitized[control.key] = typeof value === 'boolean' ? value : fallback;
      continue;
    }

    if (typeof value !== 'number' || !Number.isFinite(value)) {
      sanitized[control.key] = fallback;
      continue;
    }

    const stepped = Math.round(value / control.step) * control.step;
    const clamped = Math.min(control.max, Math.max(control.min, stepped));
    sanitized[control.key] = Number(clamped.toFixed(decimalsForStep(control.step)));
  }

  return sanitized;
}

export function paramNumber(params: ParamValues, key: string): number {
  const value = params[key];
  return typeof value === 'number' && Number.isFinite(value) ? value : 0;
}

export function paramColor(params: ParamValues, key: string): string {
  const value = params[key];
  return typeof value === 'string' ? value : '#000000';
}

export function paramBoolean(params: ParamValues, key: string): boolean {
  return params[key] === true;
}

export function isPreviewDisplaySize(value: string): value is PreviewDisplaySize {
  return (PREVIEW_DISPLAY_SIZES as readonly string[]).includes(value);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isHexColor(value: unknown): value is string {
  return typeof value === 'string' && /^#[0-9a-f]{6}$/i.test(value);
}

function decimalsForStep(step: number): number {
  const text = String(step);
  return text.includes('.') ? text.split('.')[1].length : 0;
}
