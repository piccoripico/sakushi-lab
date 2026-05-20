import { colorParam, defaults, rangeParam, toggleParam } from './common';
import { canvasLine, renderScaled } from './v02Helpers';
import { svgDocument, svgLine } from '../svg';
import { EXPORT_SIZE, paramBoolean, paramColor, paramNumber, type IllusionDefinition } from '../types';

const schema = [
  rangeParam('arrowLength', 'param.arrowLength', 420, 1000, 10, 720, 'px'),
  rangeParam('lineWidth', 'param.lineWidth', 6, 34, 1, 16, 'px'),
  rangeParam('gap', 'param.gap', 80, 240, 10, 130, 'px'),
  toggleParam('showGuide', 'param.showGuide', true),
  colorParam('background', 'param.background', '#f8fafc'),
  colorParam('foreground', 'param.foreground', '#111827'),
  colorParam('accentColor', 'param.accentColor', '#0f766e')
] as const;

export const verticalHorizontal: IllusionDefinition = {
  id: 'vertical-horizontal',
  version: 1,
  titleKey: 'illusion.vertical-horizontal.title',
  descriptionKey: 'illusion.vertical-horizontal.description',
  supportsAnimation: false,
  defaultParams: defaults(schema),
  paramSchema: schema,
  randomize: (rng) => ({
    arrowLength: rng.int(560, 900),
    lineWidth: rng.int(10, 26),
    gap: rng.int(100, 200),
    showGuide: rng.next() > 0.35,
    background: rng.pick(['#f8fafc', '#fff7ed', '#f0fdfa']),
    foreground: rng.pick(['#111827', '#172554', '#3f1d1d']),
    accentColor: rng.pick(['#0f766e', '#3159b7', '#b45309'])
  }),
  renderCanvas: (ctx, params) => {
    renderScaled(ctx, paramColor(params, 'background'), (scaled) => {
      const geometry = lines(params);
      for (const line of geometry) {
        canvasLine(scaled, ...line);
      }
    });
  },
  renderSvg: (params) => svgDocument(lines(params).map((line) => svgLine(...line)).join(''), paramColor(params, 'background'))
};

function lines(params: Record<string, unknown>): [number, number, number, number, string, number][] {
  const length = Number(params.arrowLength);
  const gap = Number(params.gap);
  const width = Number(params.lineWidth);
  const foreground = String(params.foreground);
  const accent = String(params.accentColor);
  const centerX = EXPORT_SIZE / 2;
  const centerY = EXPORT_SIZE / 2 + gap;
  const result: [number, number, number, number, string, number][] = [
    [centerX, centerY, centerX, centerY - length, foreground, width],
    [centerX - length / 2, centerY, centerX + length / 2, centerY, foreground, width]
  ];

  if (params.showGuide === true) {
    result.push([centerX - length / 2, centerY - length, centerX + length / 2, centerY - length, accent, Math.max(2, width * 0.35)]);
  }

  return result;
}
