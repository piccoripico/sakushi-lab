import { colorParam, defaults, rangeParam } from './common';
import { canvasLine, renderScaled } from './v02Helpers';
import { svgDocument, svgLine } from '../svg';
import { EXPORT_SIZE, paramColor, paramNumber, type IllusionDefinition, type ParamValues, type RenderFrame } from '../types';

const schema = [
  rangeParam('stripeCount', 'param.stripeCount', 12, 48, 1, 26),
  rangeParam('centerRadius', 'param.centerRadius', 230, 520, 5, 365, 'px'),
  rangeParam('lineWidth', 'param.lineWidth', 8, 42, 1, 20, 'px'),
  rangeParam('angle', 'param.angle', 0, 28, 1, 10, '°'),
  rangeParam('driftSpeed', 'param.driftSpeed', 0.1, 0.8, 0.01, 0.34),
  rangeParam('contrast', 'param.contrast', 0.25, 0.9, 0.01, 0.68),
  colorParam('background', 'param.background', '#f8fafc'),
  colorParam('foreground', 'param.foreground', '#111827'),
  colorParam('accentColor', 'param.accentColor', '#e2e8f0')
] as const;

export const ouchiIllusion: IllusionDefinition = {
  id: 'ouchi-illusion',
  version: 1,
  titleKey: 'illusion.ouchi-illusion.title',
  descriptionKey: 'illusion.ouchi-illusion.description',
  supportsAnimation: true,
  defaultParams: defaults(schema),
  paramSchema: schema,
  randomize: (rng) => ({
    stripeCount: rng.int(18, 40),
    centerRadius: rng.int(280, 460),
    lineWidth: rng.int(12, 34),
    angle: rng.int(4, 22),
    driftSpeed: rng.float(0.2, 0.62, 2),
    contrast: rng.float(0.48, 0.82, 2),
    background: rng.pick(['#f8fafc', '#fff7ed', '#f1f5f9']),
    foreground: rng.pick(['#111827', '#172554', '#3f1d1d']),
    accentColor: rng.pick(['#e2e8f0', '#fde68a', '#dbeafe'])
  }),
  renderCanvas: (ctx, params, frame) => {
    renderScaled(ctx, paramColor(params, 'background'), (scaled) => {
      drawStripes(scaled, params, 0, false);
      scaled.save();
      scaled.beginPath();
      scaled.arc(EXPORT_SIZE / 2, EXPORT_SIZE / 2, paramNumber(params, 'centerRadius'), 0, Math.PI * 2);
      scaled.clip();
      scaled.fillStyle = paramColor(params, 'accentColor');
      scaled.fillRect(220, 220, 1160, 1160);
      drawStripes(scaled, params, frame.progress, true);
      scaled.restore();
    });
  },
  renderSvg: (params) => {
    const clipId = 'ouchiClip';
    const parts = [
      '<defs>',
      `<clipPath id="${clipId}"><circle cx="${EXPORT_SIZE / 2}" cy="${EXPORT_SIZE / 2}" r="${paramNumber(params, 'centerRadius')}"/></clipPath>`,
      '</defs>',
      ...stripeLines(params, 0, false).map((line) => svgLine(...line)),
      `<g clip-path="url(#${clipId})"><rect x="220" y="220" width="1160" height="1160" fill="${paramColor(params, 'accentColor')}"/>`,
      ...stripeLines(params, 0, true).map((line) => svgLine(...line)),
      '</g>'
    ];
    return svgDocument(parts.join(''), paramColor(params, 'background'));
  }
};

function drawStripes(ctx: CanvasRenderingContext2D, params: ParamValues, progress: number, central: boolean): void {
  for (const line of stripeLines(params, progress, central)) {
    canvasLine(ctx, ...line, 'square');
  }
}

function stripeLines(params: ParamValues, progress: number, central: boolean): [number, number, number, number, string, number][] {
  const count = paramNumber(params, 'stripeCount');
  const spacing = EXPORT_SIZE / count;
  const width = paramNumber(params, 'lineWidth');
  const phase = progress * spacing * count * paramNumber(params, 'driftSpeed');
  const angle = ((central ? 90 + paramNumber(params, 'angle') : paramNumber(params, 'angle')) * Math.PI) / 180;
  const color = paramColor(params, 'foreground');
  const result: [number, number, number, number, string, number][] = [];

  for (let index = -count; index <= count * 2; index += 1) {
    const offset = index * spacing + (central ? phase : -phase * 0.3);
    const cx = EXPORT_SIZE / 2 + Math.cos(angle + Math.PI / 2) * (offset - EXPORT_SIZE / 2);
    const cy = EXPORT_SIZE / 2 + Math.sin(angle + Math.PI / 2) * (offset - EXPORT_SIZE / 2);
    const dx = Math.cos(angle) * EXPORT_SIZE;
    const dy = Math.sin(angle) * EXPORT_SIZE;
    result.push([cx - dx, cy - dy, cx + dx, cy + dy, color, width * paramNumber(params, 'contrast')]);
  }

  return result;
}
