import { colorParam, defaults, rangeParam, toggleParam } from './common';
import { drawGuideSegments, measurementGridSegments, svgGuideSegments } from './guideHelpers';
import { canvasLine, renderScaled } from './v02Helpers';
import { svgDocument, svgLine } from '../svg';
import { EXPORT_SIZE, paramBoolean, paramColor, paramNumber, type IllusionDefinition, type ParamValues } from '../types';

const schema = [
  rangeParam('stripeCount', 'param.stripeCount', 4, 52, 1, 24),
  rangeParam('separation', 'param.separation', 160, 880, 10, 430, 'px'),
  rangeParam('lineWidth', 'param.lineWidth', 1, 32, 1, 9, 'px'),
  rangeParam('contrast', 'param.contrast', 0.05, 1, 0.01, 0.48),
  toggleParam('showContext', 'param.showContext', true),
  toggleParam('showGuide', 'param.showGuide', false),
  colorParam('background', 'param.background', '#f8fafc'),
  colorParam('foreground', 'param.foreground', '#111827'),
  colorParam('accentColor', 'param.accentColor', '#0f766e')
] as const;

export const hering: IllusionDefinition = {
  id: 'hering',
  version: 1,
  titleKey: 'illusion.hering.title',
  descriptionKey: 'illusion.hering.description',
  supportsAnimation: false,
  defaultParams: defaults(schema),
  paramSchema: schema,
  randomize: (rng) => ({
    stripeCount: rng.int(16, 34),
    separation: rng.int(330, 610),
    lineWidth: rng.int(5, 16),
    contrast: rng.float(0.3, 0.7, 2),
    showContext: true,
    showGuide: rng.next() > 0.78,
    background: rng.pick(['#f8fafc', '#fff7ed', '#eef2ff']),
    foreground: rng.pick(['#111827', '#172554', '#3f1d1d']),
    accentColor: rng.pick(['#0f766e', '#3159b7', '#be123c'])
  }),
  renderCanvas: (ctx, params) => {
    renderScaled(ctx, paramColor(params, 'background'), (scaled) => {
      for (const line of fieldLines(params)) {
        canvasLine(scaled, ...line);
      }
      if (paramBoolean(params, 'showGuide')) {
        drawGuideSegments(scaled, measurementGridSegments(params));
      }
    });
  },
  renderSvg: (params) => svgDocument(
    `${fieldLines(params).map((line) => svgLine(...line)).join('')}${paramBoolean(params, 'showGuide') ? svgGuideSegments(measurementGridSegments(params)).join('') : ''}`,
    paramColor(params, 'background')
  )
};

function fieldLines(params: ParamValues): [number, number, number, number, string, number][] {
  const count = paramNumber(params, 'stripeCount');
  const sep = paramNumber(params, 'separation');
  const width = paramNumber(params, 'lineWidth');
  const lines: [number, number, number, number, string, number][] = [];
  const foreground = paramColor(params, 'foreground');
  const accent = paramColor(params, 'accentColor');
  const fadeWidth = Math.max(1.5, width * paramNumber(params, 'contrast'));
  const leftX = EXPORT_SIZE / 2 - sep / 2;
  const rightX = EXPORT_SIZE / 2 + sep / 2;

  if (paramBoolean(params, 'showContext')) {
    for (let index = 0; index < count; index += 1) {
      const angle = (Math.PI * index) / count;
      const x = Math.cos(angle) * 1200;
      const y = Math.sin(angle) * 1200;
      lines.push([EXPORT_SIZE / 2 - x, EXPORT_SIZE / 2 - y, EXPORT_SIZE / 2 + x, EXPORT_SIZE / 2 + y, foreground, fadeWidth]);
    }
  }

  lines.push([leftX, 170, leftX, 1430, accent, width * 1.35]);
  lines.push([rightX, 170, rightX, 1430, accent, width * 1.35]);

  return lines;
}
