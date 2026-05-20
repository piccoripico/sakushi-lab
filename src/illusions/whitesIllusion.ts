import { colorParam, defaults, rangeParam } from './common';
import { renderScaled } from './v02Helpers';
import { svgDocument, svgRect } from '../svg';
import { EXPORT_SIZE, paramColor, paramNumber, type IllusionDefinition } from '../types';

const schema = [
  rangeParam('stripeCount', 'param.stripeCount', 6, 22, 1, 12),
  rangeParam('lineWidth', 'param.lineWidth', 70, 190, 5, 120, 'px'),
  rangeParam('contrast', 'param.contrast', 0.25, 0.95, 0.01, 0.74),
  colorParam('background', 'param.background', '#f8fafc'),
  colorParam('colorA', 'param.colorA', '#111827'),
  colorParam('colorB', 'param.colorB', '#f8fafc'),
  colorParam('centralColor', 'param.centralColor', '#9ca3af')
] as const;

export const whitesIllusion: IllusionDefinition = {
  id: 'whites-illusion',
  version: 1,
  titleKey: 'illusion.whites-illusion.title',
  descriptionKey: 'illusion.whites-illusion.description',
  supportsAnimation: false,
  defaultParams: defaults(schema),
  paramSchema: schema,
  randomize: (rng) => ({
    stripeCount: rng.int(9, 18),
    lineWidth: rng.int(90, 160),
    contrast: rng.float(0.55, 0.9, 2),
    background: rng.pick(['#f8fafc', '#fff7ed', '#f1f5f9']),
    colorA: rng.pick(['#111827', '#172554', '#3f1d1d']),
    colorB: rng.pick(['#f8fafc', '#fef3c7', '#dbeafe']),
    centralColor: rng.pick(['#9ca3af', '#a8a29e', '#94a3b8'])
  }),
  renderCanvas: (ctx, params) => {
    renderScaled(ctx, paramColor(params, 'background'), (scaled) => {
      for (const rect of rects(params)) {
        scaled.globalAlpha = rect.opacity;
        scaled.fillStyle = rect.color;
        scaled.fillRect(rect.x, rect.y, rect.width, rect.height);
      }
      scaled.globalAlpha = 1;
    });
  },
  renderSvg: (params) => svgDocument(rects(params).map((rect) => `<g opacity="${rect.opacity}">${svgRect(rect.x, rect.y, rect.width, rect.height, rect.color)}</g>`).join(''), paramColor(params, 'background'))
};

function rects(params: Record<string, unknown>): { x: number; y: number; width: number; height: number; color: string; opacity: number }[] {
  const count = Number(params.stripeCount);
  const barWidth = Number(params.lineWidth);
  const rowH = 1180 / count;
  const x0 = 150;
  const y0 = 210;
  const result: { x: number; y: number; width: number; height: number; color: string; opacity: number }[] = [];

  for (let row = 0; row < count; row += 1) {
    result.push({
      x: x0,
      y: y0 + row * rowH,
      width: 1300,
      height: rowH,
      color: row % 2 === 0 ? String(params.colorA) : String(params.colorB),
      opacity: Number(params.contrast)
    });
  }

  for (let row = 0; row < count; row += 1) {
    const y = y0 + row * rowH;
    const x = row % 2 === 0 ? 515 : 945;
    result.push({ x: x - barWidth / 2, y, width: barWidth, height: rowH, color: String(params.centralColor), opacity: 1 });
  }

  return result;
}
