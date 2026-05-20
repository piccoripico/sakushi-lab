import { colorParam, defaults, rangeParam } from './common';
import { canvasRotatedRect, renderScaled, svgRotatedRect } from './v02Helpers';
import { svgDocument } from '../svg';
import { EXPORT_SIZE, paramColor, paramNumber, type IllusionDefinition, type ParamValues } from '../types';

const schema = [
  rangeParam('ringCount', 'param.ringCount', 3, 10, 1, 6),
  rangeParam('segmentCount', 'param.segmentCount', 18, 72, 2, 42),
  rangeParam('angle', 'param.angle', 12, 48, 1, 28, '°'),
  rangeParam('driftSpeed', 'param.driftSpeed', 0.1, 0.8, 0.01, 0.3),
  rangeParam('contrast', 'param.contrast', 0.3, 0.9, 0.01, 0.7),
  colorParam('background', 'param.background', '#f8fafc'),
  colorParam('foreground', 'param.foreground', '#111827'),
  colorParam('accentColor', 'param.accentColor', '#0f766e')
] as const;

export const pinnaBrelstaff: IllusionDefinition = {
  id: 'pinna-brelstaff',
  version: 1,
  titleKey: 'illusion.pinna-brelstaff.title',
  descriptionKey: 'illusion.pinna-brelstaff.description',
  supportsAnimation: true,
  defaultParams: defaults(schema),
  paramSchema: schema,
  randomize: (rng) => ({
    ringCount: rng.int(4, 8),
    segmentCount: rng.int(28, 62),
    angle: rng.int(18, 40),
    driftSpeed: rng.float(0.18, 0.56, 2),
    contrast: rng.float(0.48, 0.82, 2),
    background: rng.pick(['#f8fafc', '#fff7ed', '#f1f5f9']),
    foreground: rng.pick(['#111827', '#172554', '#3f1d1d']),
    accentColor: rng.pick(['#0f766e', '#3159b7', '#be123c'])
  }),
  renderCanvas: (ctx, params, frame) => {
    renderScaled(ctx, paramColor(params, 'background'), (scaled) => {
      scaled.globalAlpha = paramNumber(params, 'contrast');
      for (const block of blocks(params, frame.progress)) {
        canvasRotatedRect(scaled, block.x, block.y, block.w, block.h, block.angle, block.color);
      }
      scaled.globalAlpha = 1;
    });
  },
  renderSvg: (params) => {
    const parts = blocks(params, 0).map((block) => svgRotatedRect(block.x, block.y, block.w, block.h, (block.angle * 180) / Math.PI, block.color));
    return svgDocument(`<g opacity="${paramNumber(params, 'contrast')}">${parts.join('')}</g>`, paramColor(params, 'background'));
  }
};

function blocks(params: ParamValues, progress: number): { x: number; y: number; w: number; h: number; angle: number; color: string }[] {
  const rings = paramNumber(params, 'ringCount');
  const segments = paramNumber(params, 'segmentCount');
  const tilt = (paramNumber(params, 'angle') * Math.PI) / 180;
  const result = [];

  for (let ring = 0; ring < rings; ring += 1) {
    const radius = 170 + ring * (520 / rings);
    const phase = progress * Math.PI * 2 * paramNumber(params, 'driftSpeed') * (ring % 2 === 0 ? 1 : -1);
    const blockW = Math.max(32, radius * 0.12);
    const blockH = 24;

    for (let segment = 0; segment < segments; segment += 1) {
      const theta = phase + (Math.PI * 2 * segment) / segments;
      const x = EXPORT_SIZE / 2 + Math.cos(theta) * radius;
      const y = EXPORT_SIZE / 2 + Math.sin(theta) * radius;
      result.push({
        x,
        y,
        w: blockW,
        h: blockH,
        angle: theta + Math.PI / 2 + (segment % 2 === 0 ? tilt : -tilt),
        color: segment % 2 === 0 ? paramColor(params, 'foreground') : paramColor(params, 'accentColor')
      });
    }
  }

  return result;
}
