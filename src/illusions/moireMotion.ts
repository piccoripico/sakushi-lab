import { colorParam, defaults, fill, rangeParam } from './common';
import { svgDocument, svgLine } from '../svg';
import { EXPORT_SIZE, paramColor, paramNumber, type IllusionDefinition, type ParamValues, type RenderFrame } from '../types';

const schema = [
  rangeParam('stripeCount', 'param.stripeCount', 18, 80, 1, 44),
  rangeParam('ringCount', 'param.ringCount', 4, 18, 1, 9),
  rangeParam('lineWidth', 'param.lineWidth', 2, 16, 1, 7, 'px'),
  rangeParam('angle', 'param.angle', 4, 34, 1, 16, '°'),
  rangeParam('driftSpeed', 'param.driftSpeed', 0.15, 1.2, 0.01, 0.45),
  rangeParam('contrast', 'param.contrast', 0.25, 0.85, 0.01, 0.62),
  colorParam('background', 'param.background', '#f8fafc'),
  colorParam('colorA', 'param.colorA', '#111827'),
  colorParam('colorB', 'param.colorB', '#0f766e')
] as const;

export const moireMotion: IllusionDefinition = {
  id: 'moire-motion',
  version: 1,
  titleKey: 'illusion.moire-motion.title',
  descriptionKey: 'illusion.moire-motion.description',
  supportsAnimation: true,
  defaultParams: defaults(schema),
  paramSchema: schema,
  randomize: (rng) => ({
    stripeCount: rng.int(28, 68),
    ringCount: rng.int(6, 15),
    lineWidth: rng.int(4, 12),
    angle: rng.int(8, 28),
    driftSpeed: rng.float(0.25, 0.85, 2),
    contrast: rng.float(0.4, 0.76, 2),
    background: rng.pick(['#f8fafc', '#eef2ff', '#f0fdfa']),
    colorA: rng.pick(['#111827', '#172554', '#3f1d1d']),
    colorB: rng.pick(['#0f766e', '#3159b7', '#be123c'])
  }),
  renderCanvas: (ctx, params, frame) => {
    fill(ctx, paramColor(params, 'background'));
    drawMoire(ctx, params, frame);
  },
  renderSvg: (params) => {
    const parts = svgStripes(params, 0).join('');
    const rings = svgRings(params).join('');
    return svgDocument(`${parts}${rings}`, paramColor(params, 'background'));
  }
};

function drawMoire(ctx: CanvasRenderingContext2D, params: ParamValues, frame: RenderFrame) {
  const size = ctx.canvas.width;
  const stripeCount = paramNumber(params, 'stripeCount');
  const lineWidth = paramNumber(params, 'lineWidth') * (size / EXPORT_SIZE);
  const angle = (paramNumber(params, 'angle') * Math.PI) / 180;
  const phase = frame.progress * Math.PI * 2 * paramNumber(params, 'driftSpeed');
  const spacing = size / stripeCount;

  ctx.save();
  ctx.globalAlpha = paramNumber(params, 'contrast');
  ctx.lineWidth = lineWidth;
  ctx.lineCap = 'square';
  drawStripeSet(ctx, size, spacing, angle, phase, paramColor(params, 'colorA'));
  drawStripeSet(ctx, size, spacing, -angle, -phase * 0.75, paramColor(params, 'colorB'));

  ctx.strokeStyle = paramColor(params, 'colorA');
  ctx.lineWidth = Math.max(1, lineWidth * 0.55);
  ctx.globalAlpha = paramNumber(params, 'contrast') * 0.45;

  const rings = paramNumber(params, 'ringCount');
  for (let index = 1; index <= rings; index += 1) {
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, (size * 0.43 * index) / rings, 0, Math.PI * 2);
    ctx.stroke();
  }

  ctx.restore();
}

function drawStripeSet(ctx: CanvasRenderingContext2D, size: number, spacing: number, angle: number, phase: number, color: string) {
  ctx.save();
  ctx.translate(size / 2, size / 2);
  ctx.rotate(angle);
  ctx.strokeStyle = color;

  const extent = size * 0.82;
  for (let index = -Math.ceil(size / spacing); index <= Math.ceil(size / spacing); index += 1) {
    const x = index * spacing + Math.sin(phase + index * 0.24) * spacing * 0.28;
    ctx.beginPath();
    ctx.moveTo(x, -extent);
    ctx.lineTo(x, extent);
    ctx.stroke();
  }

  ctx.restore();
}

function svgStripes(params: ParamValues, phase: number): string[] {
  const stripeCount = paramNumber(params, 'stripeCount');
  const spacing = EXPORT_SIZE / stripeCount;
  const lineWidth = paramNumber(params, 'lineWidth');
  const angle = paramNumber(params, 'angle');
  const parts: string[] = [];

  for (const [sign, color] of [[1, paramColor(params, 'colorA')], [-1, paramColor(params, 'colorB')]] as const) {
    for (let index = -stripeCount; index <= stripeCount; index += 1) {
      const x = index * spacing + Math.sin(phase + index * 0.24) * spacing * 0.28;
      parts.push(svgLine(x, -EXPORT_SIZE * 0.82, x, EXPORT_SIZE * 0.82, color, lineWidth, `transform="translate(${EXPORT_SIZE / 2} ${EXPORT_SIZE / 2}) rotate(${angle * sign})"`));
    }
  }

  return [`<g opacity="${paramNumber(params, 'contrast')}">`, ...parts, '</g>'];
}

function svgRings(params: ParamValues): string[] {
  const rings = paramNumber(params, 'ringCount');
  const parts: string[] = [`<g opacity="${paramNumber(params, 'contrast') * 0.45}" fill="none" stroke="${paramColor(params, 'colorA')}">`];

  for (let index = 1; index <= rings; index += 1) {
    parts.push(`<circle cx="${EXPORT_SIZE / 2}" cy="${EXPORT_SIZE / 2}" r="${(EXPORT_SIZE * 0.43 * index) / rings}" stroke-width="${Math.max(1, paramNumber(params, 'lineWidth') * 0.55)}"/>`);
  }

  parts.push('</g>');
  return parts;
}
