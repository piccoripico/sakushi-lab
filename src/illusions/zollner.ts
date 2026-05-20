import { colorParam, defaults, rangeParam } from './common';
import { canvasLine, renderScaled } from './v02Helpers';
import { svgDocument, svgLine } from '../svg';
import { EXPORT_SIZE, paramColor, paramNumber, type IllusionDefinition } from '../types';

const schema = [
  rangeParam('stripeCount', 'param.stripeCount', 5, 15, 1, 9),
  rangeParam('segmentCount', 'param.segmentCount', 5, 15, 1, 9),
  rangeParam('angle', 'param.angle', 24, 72, 1, 48, '°'),
  rangeParam('lineWidth', 'param.lineWidth', 3, 18, 1, 8, 'px'),
  colorParam('background', 'param.background', '#f8fafc'),
  colorParam('foreground', 'param.foreground', '#111827'),
  colorParam('accentColor', 'param.accentColor', '#0f766e')
] as const;

export const zollner: IllusionDefinition = {
  id: 'zollner',
  version: 1,
  titleKey: 'illusion.zollner.title',
  descriptionKey: 'illusion.zollner.description',
  supportsAnimation: false,
  defaultParams: defaults(schema),
  paramSchema: schema,
  randomize: (rng) => ({
    stripeCount: rng.int(7, 13),
    segmentCount: rng.int(7, 13),
    angle: rng.int(34, 64),
    lineWidth: rng.int(5, 13),
    background: rng.pick(['#f8fafc', '#fff7ed', '#f0fdfa']),
    foreground: rng.pick(['#111827', '#172554', '#3f1d1d']),
    accentColor: rng.pick(['#0f766e', '#3159b7', '#b45309'])
  }),
  renderCanvas: (ctx, params) => {
    renderScaled(ctx, paramColor(params, 'background'), (scaled) => {
      for (const line of lines(params)) {
        canvasLine(scaled, ...line);
      }
    });
  },
  renderSvg: (params) => svgDocument(lines(params).map((line) => svgLine(...line)).join(''), paramColor(params, 'background'))
};

function lines(params: Record<string, unknown>): [number, number, number, number, string, number][] {
  const stripeCount = Number(params.stripeCount);
  const segmentCount = Number(params.segmentCount);
  const width = Number(params.lineWidth);
  const baseAngle = (-22 * Math.PI) / 180;
  const hatchAngle = (Number(params.angle) * Math.PI) / 180;
  const spacing = EXPORT_SIZE / (stripeCount + 1);
  const parts: [number, number, number, number, string, number][] = [];
  const foreground = String(params.foreground);
  const accent = String(params.accentColor);

  for (let row = 1; row <= stripeCount; row += 1) {
    const cy = spacing * row;
    const cx = EXPORT_SIZE / 2;
    const length = 1680;
    const dx = Math.cos(baseAngle) * length / 2;
    const dy = Math.sin(baseAngle) * length / 2;
    parts.push([cx - dx, cy - dy, cx + dx, cy + dy, foreground, width]);

    for (let index = 0; index < segmentCount; index += 1) {
      const t = (index + 0.5) / segmentCount - 0.5;
      const hx = cx + Math.cos(baseAngle) * t * 1220;
      const hy = cy + Math.sin(baseAngle) * t * 1220;
      const direction = baseAngle + (row % 2 === 0 ? hatchAngle : -hatchAngle);
      const hdx = Math.cos(direction) * 70;
      const hdy = Math.sin(direction) * 70;
      parts.push([hx - hdx, hy - hdy, hx + hdx, hy + hdy, accent, Math.max(2, width * 0.78)]);
    }
  }

  return parts;
}
