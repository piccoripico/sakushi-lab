import { colorParam, defaults, fill, rangeParam, toggleParam } from './common';
import { svgCircle, svgDocument, svgLine } from '../svg';
import { EXPORT_SIZE, paramBoolean, paramColor, paramNumber, type IllusionDefinition } from '../types';

const schema = [
  rangeParam('gridCount', 'param.gridCount', 4, 22, 1, 9),
  rangeParam('lineWidth', 'param.lineWidth', 4, 64, 1, 22, 'px'),
  rangeParam('contrast', 'param.contrast', 0.15, 1, 0.01, 0.9),
  toggleParam('showGuide', 'param.showGuide', false),
  colorParam('background', 'param.background', '#111827'),
  colorParam('foreground', 'param.foreground', '#f8fafc'),
  colorParam('accentColor', 'param.guideColor', '#cbd5e1')
] as const;

export const hermannGrid: IllusionDefinition = {
  id: 'hermann-grid',
  version: 1,
  titleKey: 'illusion.hermann-grid.title',
  descriptionKey: 'illusion.hermann-grid.description',
  supportsAnimation: false,
  defaultParams: defaults(schema),
  paramSchema: schema,
  randomize: (rng) => ({
    gridCount: rng.int(6, 14),
    lineWidth: rng.int(12, 38),
    contrast: rng.float(0.65, 1, 2),
    showGuide: rng.next() > 0.8,
    background: rng.pick(['#111827', '#0f172a', '#1f2937']),
    foreground: rng.pick(['#f8fafc', '#f1f5f9', '#fff7ed']),
    accentColor: rng.pick(['#cbd5e1', '#bae6fd', '#fecdd3'])
  }),
  renderCanvas: (ctx, params) => {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    const count = paramNumber(params, 'gridCount');
    const lineWidth = paramNumber(params, 'lineWidth') * (width / EXPORT_SIZE);
    const margin = width * 0.11;
    const step = (width - margin * 2) / (count - 1);

    fill(ctx, paramColor(params, 'background'));
    ctx.save();
    ctx.globalAlpha = paramNumber(params, 'contrast');
    ctx.strokeStyle = paramColor(params, 'foreground');
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';

    for (let index = 0; index < count; index += 1) {
      const pos = margin + step * index;
      ctx.beginPath();
      ctx.moveTo(margin, pos);
      ctx.lineTo(width - margin, pos);
      ctx.moveTo(pos, margin);
      ctx.lineTo(pos, height - margin);
      ctx.stroke();
    }

    if (paramBoolean(params, 'showGuide')) {
      drawIntersectionGuides(
        ctx,
        count,
        margin,
        step,
        lineWidth,
        paramColor(params, 'foreground'),
        paramColor(params, 'accentColor')
      );
    }

    ctx.restore();
  },
  renderSvg: (params) => {
    const count = paramNumber(params, 'gridCount');
    const lineWidth = paramNumber(params, 'lineWidth');
    const margin = EXPORT_SIZE * 0.11;
    const step = (EXPORT_SIZE - margin * 2) / (count - 1);
    const parts: string[] = [];

    for (let index = 0; index < count; index += 1) {
      const pos = margin + step * index;
      parts.push(svgLine(margin, pos, EXPORT_SIZE - margin, pos, paramColor(params, 'foreground'), lineWidth));
      parts.push(svgLine(pos, margin, pos, EXPORT_SIZE - margin, paramColor(params, 'foreground'), lineWidth));
    }

    if (paramBoolean(params, 'showGuide')) {
      parts.push(...intersectionGuideSvg(
        count,
        margin,
        step,
        lineWidth,
        paramColor(params, 'foreground'),
        paramColor(params, 'accentColor')
      ));
    }

    return svgDocument(
      `<g opacity="${paramNumber(params, 'contrast')}">${parts.join('')}</g>`,
      paramColor(params, 'background')
    );
  }
};

function drawIntersectionGuides(
  ctx: CanvasRenderingContext2D,
  count: number,
  margin: number,
  step: number,
  lineWidth: number,
  fillColor: string,
  strokeColor: string
): void {
  const radius = Math.max(8, lineWidth * 0.66);
  const markerWidth = Math.max(1.5, lineWidth * 0.1);

  ctx.save();
  ctx.globalAlpha = 0.95;
  ctx.fillStyle = fillColor;
  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = markerWidth;

  for (let x = 0; x < count; x += 1) {
    for (let y = 0; y < count; y += 1) {
      const cx = margin + step * x;
      const cy = margin + step * y;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }
  }

  ctx.restore();
}

function intersectionGuideSvg(
  count: number,
  margin: number,
  step: number,
  lineWidth: number,
  fillColor: string,
  strokeColor: string
): string[] {
  const radius = Math.max(8, lineWidth * 0.66);
  const markerWidth = Math.max(1.5, lineWidth * 0.1);
  const parts: string[] = [];

  for (let x = 0; x < count; x += 1) {
    for (let y = 0; y < count; y += 1) {
      const cx = margin + step * x;
      const cy = margin + step * y;
      parts.push(svgCircle(cx, cy, radius, fillColor, strokeColor, markerWidth));
    }
  }

  return parts;
}
