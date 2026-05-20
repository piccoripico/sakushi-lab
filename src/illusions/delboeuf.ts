import { colorParam, defaults, rangeParam } from './common';
import { canvasCircle, renderScaled, svgCircleStroke } from './v02Helpers';
import { svgDocument } from '../svg';
import { EXPORT_SIZE, paramColor, paramNumber, type IllusionDefinition } from '../types';

const schema = [
  rangeParam('centerRadius', 'param.centerRadius', 70, 190, 5, 125, 'px'),
  rangeParam('surroundRadius', 'param.surroundRadius', 190, 420, 5, 300, 'px'),
  rangeParam('separation', 'param.separation', 460, 820, 10, 620, 'px'),
  rangeParam('lineWidth', 'param.lineWidth', 5, 30, 1, 13, 'px'),
  colorParam('background', 'param.background', '#f8fafc'),
  colorParam('foreground', 'param.foreground', '#111827'),
  colorParam('accentColor', 'param.accentColor', '#0f766e')
] as const;

export const delboeuf: IllusionDefinition = {
  id: 'delboeuf',
  version: 1,
  titleKey: 'illusion.delboeuf.title',
  descriptionKey: 'illusion.delboeuf.description',
  supportsAnimation: false,
  defaultParams: defaults(schema),
  paramSchema: schema,
  randomize: (rng) => ({
    centerRadius: rng.int(95, 165),
    surroundRadius: rng.int(230, 390),
    separation: rng.int(540, 760),
    lineWidth: rng.int(8, 22),
    background: rng.pick(['#f8fafc', '#fff7ed', '#eef2ff']),
    foreground: rng.pick(['#111827', '#172554', '#3f1d1d']),
    accentColor: rng.pick(['#0f766e', '#3159b7', '#b45309'])
  }),
  renderCanvas: (ctx, params) => {
    renderScaled(ctx, paramColor(params, 'background'), (scaled) => {
      for (const circle of circles(params)) {
        canvasCircle(scaled, ...circle);
      }
    });
  },
  renderSvg: (params) => svgDocument(circles(params).map((circle) => svgCircleStroke(circle[0], circle[1], circle[2], circle[4], circle[5])).join(''), paramColor(params, 'background'))
};

function circles(params: Record<string, unknown>): [number, number, number, string, string, number][] {
  const centerRadius = Number(params.centerRadius);
  const surroundRadius = Number(params.surroundRadius);
  const separation = Number(params.separation);
  const lineWidth = Number(params.lineWidth);
  const leftX = EXPORT_SIZE / 2 - separation / 2;
  const rightX = EXPORT_SIZE / 2 + separation / 2;
  const y = EXPORT_SIZE / 2;
  const foreground = String(params.foreground);
  const accent = String(params.accentColor);

  return [
    [leftX, y, surroundRadius, 'transparent', foreground, lineWidth],
    [leftX, y, centerRadius, 'transparent', accent, lineWidth],
    [rightX, y, centerRadius + lineWidth * 2.2, 'transparent', foreground, lineWidth],
    [rightX, y, centerRadius, 'transparent', accent, lineWidth]
  ];
}
