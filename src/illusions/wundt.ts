import { colorParam, defaults, rangeParam } from './common';
import { canvasLine, renderScaled } from './v02Helpers';
import { svgDocument, svgLine } from '../svg';
import { EXPORT_SIZE, paramColor, type IllusionDefinition } from '../types';

const schema = [
  rangeParam('stripeCount', 'param.stripeCount', 10, 36, 1, 22),
  rangeParam('separation', 'param.separation', 260, 720, 10, 430, 'px'),
  rangeParam('lineWidth', 'param.lineWidth', 3, 22, 1, 9, 'px'),
  rangeParam('contrast', 'param.contrast', 0.2, 0.85, 0.01, 0.5),
  colorParam('background', 'param.background', '#f8fafc'),
  colorParam('foreground', 'param.foreground', '#111827'),
  colorParam('accentColor', 'param.accentColor', '#0f766e')
] as const;

export const wundt: IllusionDefinition = {
  id: 'wundt',
  version: 1,
  titleKey: 'illusion.wundt.title',
  descriptionKey: 'illusion.wundt.description',
  supportsAnimation: false,
  defaultParams: defaults(schema),
  paramSchema: schema,
  randomize: (rng) => ({
    stripeCount: rng.int(16, 32),
    separation: rng.int(320, 620),
    lineWidth: rng.int(5, 15),
    contrast: rng.float(0.32, 0.72, 2),
    background: rng.pick(['#f8fafc', '#fff7ed', '#eef2ff']),
    foreground: rng.pick(['#111827', '#172554', '#3f1d1d']),
    accentColor: rng.pick(['#0f766e', '#3159b7', '#be123c'])
  }),
  renderCanvas: (ctx, params) => {
    renderScaled(ctx, paramColor(params, 'background'), (scaled) => {
      for (const line of fieldLines(params)) {
        canvasLine(scaled, ...line);
      }
    });
  },
  renderSvg: (params) => svgDocument(fieldLines(params).map((line) => svgLine(...line)).join(''), paramColor(params, 'background'))
};

function fieldLines(params: Record<string, unknown>): [number, number, number, number, string, number][] {
  const count = Number(params.stripeCount);
  const sep = Number(params.separation);
  const width = Number(params.lineWidth);
  const foreground = String(params.foreground);
  const accent = String(params.accentColor);
  const lines: [number, number, number, number, string, number][] = [];
  const top = 210;
  const bottom = 1390;

  for (let index = 0; index <= count; index += 1) {
    const x = 100 + (1400 * index) / count;
    const target = index % 2 === 0 ? 250 : 1350;
    lines.push([x, top, target, EXPORT_SIZE / 2, foreground, Math.max(1.5, width * Number(params.contrast))]);
    lines.push([x, bottom, EXPORT_SIZE - target, EXPORT_SIZE / 2, foreground, Math.max(1.5, width * Number(params.contrast))]);
  }

  lines.push([EXPORT_SIZE / 2 - sep / 2, 170, EXPORT_SIZE / 2 - sep / 2, 1430, accent, width * 1.35]);
  lines.push([EXPORT_SIZE / 2 + sep / 2, 170, EXPORT_SIZE / 2 + sep / 2, 1430, accent, width * 1.35]);
  return lines;
}
