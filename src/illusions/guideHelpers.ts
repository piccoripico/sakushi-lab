import { svgLine } from '../svg';
import { EXPORT_SIZE, paramColor, type ParamValues } from '../types';
import { canvasLine, mixHex } from './v02Helpers';

export type GuideSegment = [number, number, number, number, string, number, string?];
export const MEASUREMENT_GRID_WIDTH = 2;

export function measurementGridSegments(params: ParamValues, spacing = 100): GuideSegment[] {
  const background = paramColor(params, 'background');
  const accent = guideAccent(params);
  const color = mixHex(accent, background, 0.66);
  const width = MEASUREMENT_GRID_WIDTH;
  const segments: GuideSegment[] = [];

  for (let x = 0; x <= EXPORT_SIZE; x += spacing) {
    segments.push([x, 0, x, EXPORT_SIZE, color, width]);
  }

  for (let y = 0; y <= EXPORT_SIZE; y += spacing) {
    segments.push([0, y, EXPORT_SIZE, y, color, width]);
  }

  return segments;
}

function guideAccent(params: ParamValues): string {
  if (typeof params.accentColor === 'string') {
    return params.accentColor;
  }

  if (typeof params.centralColor === 'string') {
    return params.centralColor;
  }

  return paramColor(params, 'foreground');
}

export function targetBoxSegments(
  x: number,
  y: number,
  width: number,
  height: number,
  color: string,
  strokeWidth: number,
  dashed = true
): GuideSegment[] {
  const extra = dashed ? 'stroke-dasharray="22 18"' : undefined;
  return [
    [x, y, x + width, y, color, strokeWidth, extra],
    [x + width, y, x + width, y + height, color, strokeWidth, extra],
    [x + width, y + height, x, y + height, color, strokeWidth, extra],
    [x, y + height, x, y, color, strokeWidth, extra]
  ];
}

export function drawGuideSegments(ctx: CanvasRenderingContext2D, segments: readonly GuideSegment[]): void {
  for (const segment of segments) {
    const [x1, y1, x2, y2, color, width, extra] = segment;
    ctx.save();
    if (extra?.includes('stroke-dasharray')) {
      ctx.setLineDash([22, 18]);
    }
    canvasLine(ctx, x1, y1, x2, y2, color, width);
    ctx.restore();
  }
}

export function svgGuideSegments(segments: readonly GuideSegment[]): string[] {
  return segments.map((segment) => svgLine(...segment));
}

export function sameColorDiagonalSegments(color: string, spacing = 150, width = 12): GuideSegment[] {
  const margin = EXPORT_SIZE;
  const span = EXPORT_SIZE + margin * 2;
  const segments: GuideSegment[] = [];

  for (let x = -EXPORT_SIZE * 2; x <= 0; x += spacing) {
    segments.push([x, -margin, x + span, EXPORT_SIZE + margin, color, width]);
  }

  return segments;
}
