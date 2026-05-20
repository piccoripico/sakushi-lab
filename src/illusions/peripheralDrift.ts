import { colorParam, defaults, rangeParam } from './common';
import { canvasAnnularSector, renderScaled, svgAnnularSector } from './v02Helpers';
import { svgDocument } from '../svg';
import { EXPORT_SIZE, paramColor, paramNumber, type IllusionDefinition, type ParamValues, type RenderFrame } from '../types';

const schema = [
  rangeParam('ringCount', 'param.ringCount', 3, 10, 1, 6),
  rangeParam('segmentCount', 'param.segmentCount', 24, 96, 4, 56),
  rangeParam('driftSpeed', 'param.driftSpeed', 0.1, 0.9, 0.01, 0.38),
  rangeParam('contrast', 'param.contrast', 0.3, 0.9, 0.01, 0.68),
  colorParam('background', 'param.background', '#f8fafc'),
  colorParam('foreground', 'param.foreground', '#111827'),
  colorParam('accentColor', 'param.accentColor', '#0f766e'),
  colorParam('colorB', 'param.colorB', '#fbbf24')
] as const;

export const peripheralDrift: IllusionDefinition = {
  id: 'peripheral-drift',
  version: 1,
  titleKey: 'illusion.peripheral-drift.title',
  descriptionKey: 'illusion.peripheral-drift.description',
  supportsAnimation: true,
  defaultParams: defaults(schema),
  paramSchema: schema,
  randomize: (rng) => ({
    ringCount: rng.int(4, 8),
    segmentCount: rng.int(36, 84),
    driftSpeed: rng.float(0.22, 0.68, 2),
    contrast: rng.float(0.48, 0.84, 2),
    background: rng.pick(['#f8fafc', '#fff7ed', '#f1f5f9']),
    foreground: rng.pick(['#111827', '#172554', '#3f1d1d']),
    accentColor: rng.pick(['#0f766e', '#3159b7', '#be123c']),
    colorB: rng.pick(['#fbbf24', '#fb7185', '#22c55e'])
  }),
  renderCanvas: (ctx, params, frame) => {
    renderScaled(ctx, paramColor(params, 'background'), (scaled) => {
      scaled.globalAlpha = paramNumber(params, 'contrast');
      for (const sector of sectors(params, frame.progress)) {
        canvasAnnularSector(scaled, ...sector);
      }
      scaled.globalAlpha = 1;
    });
  },
  renderSvg: (params) => svgDocument(sectors(params, 0).map((sector) => svgAnnularSector(...sector)).join(''), paramColor(params, 'background'))
};

function sectors(params: ParamValues, progress: number): [number, number, number, number, number, number, string][] {
  const rings = paramNumber(params, 'ringCount');
  const segments = paramNumber(params, 'segmentCount');
  const speed = paramNumber(params, 'driftSpeed');
  const colors = [paramColor(params, 'foreground'), paramColor(params, 'colorB'), paramColor(params, 'background'), paramColor(params, 'accentColor')];
  const result: [number, number, number, number, number, number, string][] = [];
  const innerBase = 180;
  const thickness = 520 / rings;
  const segmentAngle = (Math.PI * 2) / segments;

  for (let ring = 0; ring < rings; ring += 1) {
    const inner = innerBase + ring * thickness;
    const outer = inner + thickness * 0.72;
    const phase = progress * Math.PI * 2 * speed * (ring % 2 === 0 ? 1 : -1) + ring * 0.28;

    for (let segment = 0; segment < segments; segment += 1) {
      const start = segment * segmentAngle + phase;
      const color = colors[(segment + ring) % colors.length];
      result.push([EXPORT_SIZE / 2, EXPORT_SIZE / 2, outer, inner, start, start + segmentAngle * 0.72, color]);
    }
  }

  return result;
}
