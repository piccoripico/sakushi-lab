import { colorParam, defaults, rangeParam, toggleParam } from './common';
import { drawGuideSegments, measurementGridSegments, svgGuideSegments } from './guideHelpers';
import { canvasLine, renderScaled } from './v02Helpers';
import { svgDocument, svgLine } from '../svg';
import { EXPORT_SIZE, paramBoolean, paramColor, paramNumber, type IllusionDefinition, type ParamValues } from '../types';

const schema = [
  rangeParam('stripeCount', 'param.stripeCount', 3, 20, 1, 9),
  rangeParam('segmentCount', 'param.segmentCount', 3, 22, 1, 9),
  rangeParam('angle', 'param.angle', 10, 82, 1, 48, '°'),
  rangeParam('lineWidth', 'param.lineWidth', 1, 26, 1, 8, 'px'),
  toggleParam('showContext', 'param.showContext', true),
  toggleParam('showGuide', 'param.showGuide', false),
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
    showContext: true,
    showGuide: rng.next() > 0.8,
    background: rng.pick(['#f8fafc', '#fff7ed', '#f0fdfa']),
    foreground: rng.pick(['#111827', '#172554', '#3f1d1d']),
    accentColor: rng.pick(['#0f766e', '#3159b7', '#b45309'])
  }),
  renderCanvas: (ctx, params) => {
    renderScaled(ctx, paramColor(params, 'background'), (scaled) => {
      for (const line of lines(params)) {
        canvasLine(scaled, ...line);
      }
      if (paramBoolean(params, 'showGuide')) {
        drawGuideSegments(scaled, measurementGridSegments(params));
      }
    });
  },
  renderSvg: (params) => svgDocument(
    `${paramBoolean(params, 'showGuide') ? svgGuideSegments(measurementGridSegments(params)).join('') : ''}${lines(params).map((line) => svgLine(...line)).join('')}`,
    paramColor(params, 'background')
  )
};

function lines(params: ParamValues): [number, number, number, number, string, number][] {
  const stripeCount = paramNumber(params, 'stripeCount');
  const segmentCount = paramNumber(params, 'segmentCount');
  const width = paramNumber(params, 'lineWidth');
  const baseAngle = (-22 * Math.PI) / 180;
  const hatchAngle = (paramNumber(params, 'angle') * Math.PI) / 180;
  const spacing = EXPORT_SIZE / (stripeCount + 1);
  const parts: [number, number, number, number, string, number][] = [];
  const foreground = paramColor(params, 'foreground');
  const accent = paramColor(params, 'accentColor');
  const length = 1680;
  const dx = Math.cos(baseAngle) * length / 2;
  const dy = Math.sin(baseAngle) * length / 2;

  for (let row = 1; row <= stripeCount; row += 1) {
    const cy = spacing * row;
    const cx = EXPORT_SIZE / 2;
    parts.push([cx - dx, cy - dy, cx + dx, cy + dy, foreground, width]);

    for (let index = 0; index < segmentCount; index += 1) {
      const t = (index + 0.5) / segmentCount - 0.5;
      const hx = cx + Math.cos(baseAngle) * t * 1220;
      const hy = cy + Math.sin(baseAngle) * t * 1220;
      if (paramBoolean(params, 'showContext')) {
        const direction = baseAngle + (row % 2 === 0 ? hatchAngle : -hatchAngle);
        const hdx = Math.cos(direction) * 70;
        const hdy = Math.sin(direction) * 70;
        parts.push([hx - hdx, hy - hdy, hx + hdx, hy + hdy, accent, Math.max(2, width * 0.78)]);
      }
    }
  }

  return parts;
}
