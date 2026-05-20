import { colorParam, defaults, rangeParam } from './common';
import { canvasAnnularSector, renderScaled, svgAnnularSector } from './v02Helpers';
import { svgDocument } from '../svg';
import { EXPORT_SIZE, paramColor, paramNumber, type IllusionDefinition } from '../types';

const schema = [
  rangeParam('separation', 'param.separation', 120, 360, 10, 220, 'px'),
  rangeParam('lineWidth', 'param.lineWidth', 90, 210, 5, 150, 'px'),
  rangeParam('angle', 'param.angle', 90, 150, 1, 118, '°'),
  colorParam('background', 'param.background', '#f8fafc'),
  colorParam('foreground', 'param.foreground', '#111827'),
  colorParam('accentColor', 'param.accentColor', '#0f766e')
] as const;

export const jastrow: IllusionDefinition = {
  id: 'jastrow',
  version: 1,
  titleKey: 'illusion.jastrow.title',
  descriptionKey: 'illusion.jastrow.description',
  supportsAnimation: false,
  defaultParams: defaults(schema),
  paramSchema: schema,
  randomize: (rng) => ({
    separation: rng.int(160, 310),
    lineWidth: rng.int(110, 190),
    angle: rng.int(104, 138),
    background: rng.pick(['#f8fafc', '#fff7ed', '#f1f5f9']),
    foreground: rng.pick(['#111827', '#172554', '#3f1d1d']),
    accentColor: rng.pick(['#0f766e', '#3159b7', '#b45309'])
  }),
  renderCanvas: (ctx, params) => {
    renderScaled(ctx, paramColor(params, 'background'), (scaled) => {
      for (const arc of arcs(params)) {
        canvasAnnularSector(scaled, ...arc);
      }
    });
  },
  renderSvg: (params) => svgDocument(arcs(params).map((arc) => svgAnnularSector(...arc)).join(''), paramColor(params, 'background'))
};

function arcs(params: Record<string, unknown>): [number, number, number, number, number, number, string][] {
  const thickness = Number(params.lineWidth);
  const separation = Number(params.separation);
  const halfSpan = (Number(params.angle) * Math.PI) / 360;
  const radius = 650;
  const start = Math.PI * 1.5 - halfSpan;
  const end = Math.PI * 1.5 + halfSpan;

  return [
    [EXPORT_SIZE / 2 - 100, EXPORT_SIZE / 2 + 230 - separation / 2, radius, radius - thickness, start, end, String(params.foreground)],
    [EXPORT_SIZE / 2 + 100, EXPORT_SIZE / 2 + 230 + separation / 2, radius, radius - thickness, start, end, String(params.accentColor)]
  ];
}
