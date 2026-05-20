import { colorParam, defaults, rangeParam, toggleParam } from './common';
import { canvasLine, renderScaled, svgPolygon } from './v02Helpers';
import { svgDocument, svgLine } from '../svg';
import { EXPORT_SIZE, paramBoolean, paramColor, paramNumber, type IllusionDefinition } from '../types';

const schema = [
  rangeParam('angle', 'param.angle', 18, 48, 1, 30, '°'),
  rangeParam('separation', 'param.separation', 180, 420, 10, 280, 'px'),
  rangeParam('lineWidth', 'param.lineWidth', 5, 26, 1, 12, 'px'),
  toggleParam('showGuide', 'param.showGuide', false),
  colorParam('background', 'param.background', '#f8fafc'),
  colorParam('foreground', 'param.foreground', '#111827'),
  colorParam('accentColor', 'param.accentColor', '#0f766e')
] as const;

export const sanderParallelogram: IllusionDefinition = {
  id: 'sander-parallelogram',
  version: 1,
  titleKey: 'illusion.sander-parallelogram.title',
  descriptionKey: 'illusion.sander-parallelogram.description',
  supportsAnimation: false,
  defaultParams: defaults(schema),
  paramSchema: schema,
  randomize: (rng) => ({
    angle: rng.int(22, 42),
    separation: rng.int(220, 360),
    lineWidth: rng.int(8, 20),
    showGuide: rng.next() > 0.65,
    background: rng.pick(['#f8fafc', '#fff7ed', '#eef2ff']),
    foreground: rng.pick(['#111827', '#172554', '#3f1d1d']),
    accentColor: rng.pick(['#0f766e', '#3159b7', '#b45309'])
  }),
  renderCanvas: (ctx, params) => {
    renderScaled(ctx, paramColor(params, 'background'), (scaled) => {
      const { outline, segments } = geometry(params);
      scaled.strokeStyle = paramColor(params, 'foreground');
      scaled.lineWidth = paramNumber(params, 'lineWidth');
      scaled.lineJoin = 'round';
      scaled.beginPath();
      outline.forEach(([x, y], index) => (index === 0 ? scaled.moveTo(x, y) : scaled.lineTo(x, y)));
      scaled.closePath();
      scaled.stroke();
      for (const segment of segments) {
        canvasLine(scaled, ...segment);
      }
    });
  },
  renderSvg: (params) => {
    const { outline, segments } = geometry(params);
    return svgDocument([
      svgPolygon(outline, 'none', paramColor(params, 'foreground'), paramNumber(params, 'lineWidth')),
      ...segments.map((segment) => svgLine(...segment))
    ].join(''), paramColor(params, 'background'));
  }
};

function geometry(params: Record<string, unknown>) {
  const angle = (Number(params.angle) * Math.PI) / 180;
  const shear = Math.cos(angle) * 300;
  const sep = Number(params.separation);
  const width = Number(params.lineWidth);
  const foreground = String(params.foreground);
  const accent = String(params.accentColor);
  const outline: [number, number][] = [
    [260, 1180],
    [820, 1180],
    [1340, 420],
    [780, 420]
  ];
  const left: [number, number, number, number, string, number] = [395, 1080, 395 + shear, 520, accent, width * 1.4];
  const right: [number, number, number, number, string, number] = [770 + sep, 1080, 770 + sep + shear, 520, accent, width * 1.4];
  const segments = [left, right];

  if (params.showGuide === true) {
    segments.push([left[0], left[1], right[0], right[1], foreground, Math.max(2, width * 0.35)]);
    segments.push([left[2], left[3], right[2], right[3], foreground, Math.max(2, width * 0.35)]);
  }

  return { outline, segments };
}
