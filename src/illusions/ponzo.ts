import { colorParam, defaults, rangeParam } from './common';
import { canvasLine, renderScaled } from './v02Helpers';
import { svgDocument, svgLine } from '../svg';
import { EXPORT_SIZE, paramColor, paramNumber, type IllusionDefinition } from '../types';

const schema = [
  rangeParam('arrowLength', 'param.arrowLength', 360, 820, 10, 560, 'px'),
  rangeParam('separation', 'param.separation', 260, 620, 10, 420, 'px'),
  rangeParam('lineWidth', 'param.lineWidth', 4, 22, 1, 10, 'px'),
  rangeParam('contrast', 'param.contrast', 0.35, 1, 0.01, 0.82),
  colorParam('background', 'param.background', '#f8fafc'),
  colorParam('foreground', 'param.foreground', '#111827'),
  colorParam('accentColor', 'param.accentColor', '#0f766e')
] as const;

export const ponzo: IllusionDefinition = {
  id: 'ponzo',
  version: 1,
  titleKey: 'illusion.ponzo.title',
  descriptionKey: 'illusion.ponzo.description',
  supportsAnimation: false,
  defaultParams: defaults(schema),
  paramSchema: schema,
  randomize: (rng) => ({
    arrowLength: rng.int(440, 740),
    separation: rng.int(320, 560),
    lineWidth: rng.int(6, 18),
    contrast: rng.float(0.55, 0.95, 2),
    background: rng.pick(['#f8fafc', '#fff7ed', '#eff6ff']),
    foreground: rng.pick(['#111827', '#172554', '#3f1d1d']),
    accentColor: rng.pick(['#0f766e', '#3159b7', '#b45309'])
  }),
  renderCanvas: (ctx, params) => {
    renderScaled(ctx, paramColor(params, 'background'), (scaled) => {
      draw(scaled, params);
    });
  },
  renderSvg: (params) => {
    const parts = geometry(params).map((line) => svgLine(...line));
    return svgDocument(parts.join(''), paramColor(params, 'background'));
  }
};

function draw(ctx: CanvasRenderingContext2D, params: Record<string, unknown>): void {
  for (const [x1, y1, x2, y2, color, width] of geometry(params)) {
    canvasLine(ctx, x1, y1, x2, y2, color, width);
  }
}

function geometry(params: Record<string, unknown>): [number, number, number, number, string, number][] {
  const lineWidth = Number(params.lineWidth);
  const barLength = Number(params.arrowLength);
  const separation = Number(params.separation);
  const foreground = String(params.foreground);
  const accent = String(params.accentColor);
  const contrast = Number(params.contrast);
  const railWidth = Math.max(2, lineWidth * 0.8);
  const barWidth = Math.max(3, lineWidth * 1.25);
  const upperY = EXPORT_SIZE / 2 - separation / 2;
  const lowerY = EXPORT_SIZE / 2 + separation / 2;
  const lines: [number, number, number, number, string, number][] = [
    [380, 1440, 695, 150, foreground, railWidth],
    [1220, 1440, 905, 150, foreground, railWidth],
    [EXPORT_SIZE / 2 - barLength / 2, upperY, EXPORT_SIZE / 2 + barLength / 2, upperY, accent, barWidth],
    [EXPORT_SIZE / 2 - barLength / 2, lowerY, EXPORT_SIZE / 2 + barLength / 2, lowerY, accent, barWidth]
  ];

  return lines.map((line) => [...line.slice(0, 4), line[4], line[5] * contrast] as [number, number, number, number, string, number]);
}
