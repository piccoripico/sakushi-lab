import { colorParam, defaults, rangeParam, toggleParam } from './common';
import { measurementGridSegments, type GuideSegment } from './guideHelpers';
import { canvasCircle, canvasLine, renderScaled } from './v02Helpers';
import { svgCircle, svgDocument, svgLine } from '../svg';
import { EXPORT_SIZE, paramBoolean, paramColor, paramNumber, type IllusionDefinition, type ParamValues } from '../types';

const schema = [
  rangeParam('arrowLength', 'param.arrowLength', 220, 940, 10, 560, 'px'),
  rangeParam('separation', 'param.separation', 160, 760, 10, 420, 'px'),
  rangeParam('lineWidth', 'param.lineWidth', 2, 32, 1, 10, 'px'),
  rangeParam('contrast', 'param.contrast', 0.1, 1, 0.01, 0.82),
  toggleParam('showVanishingPoint', 'param.showVanishingPoint', false),
  toggleParam('showHorizon', 'param.showHorizon', false),
  toggleParam('showDepthGuides', 'param.showDepthGuides', true),
  toggleParam('showTargets', 'param.showTargets', true),
  toggleParam('showGuide', 'param.showGuide', false),
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
    showVanishingPoint: rng.next() > 0.75,
    showHorizon: rng.next() > 0.7,
    showDepthGuides: true,
    showTargets: true,
    showGuide: rng.next() > 0.76,
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
    if (params.showVanishingPoint === true) {
      parts.push(svgCircle(EXPORT_SIZE / 2, 150, 18, paramColor(params, 'accentColor'), paramColor(params, 'background'), 5));
    }
    return svgDocument(parts.join(''), paramColor(params, 'background'));
  }
};

function draw(ctx: CanvasRenderingContext2D, params: ParamValues): void {
  for (const [x1, y1, x2, y2, color, width] of geometry(params)) {
    canvasLine(ctx, x1, y1, x2, y2, color, width);
  }

  if (params.showVanishingPoint === true) {
    canvasCircle(ctx, EXPORT_SIZE / 2, 150, 18, String(params.accentColor), String(params.background), 5);
  }
}

function geometry(params: ParamValues): GuideSegment[] {
  const lineWidth = paramNumber(params, 'lineWidth');
  const barLength = paramNumber(params, 'arrowLength');
  const separation = paramNumber(params, 'separation');
  const foreground = paramColor(params, 'foreground');
  const accent = paramColor(params, 'accentColor');
  const contrast = paramNumber(params, 'contrast');
  const railWidth = Math.max(2, lineWidth * 0.8);
  const barWidth = Math.max(3, lineWidth * 1.25);
  const upperY = EXPORT_SIZE / 2 - separation / 2;
  const lowerY = EXPORT_SIZE / 2 + separation / 2;
  const left = EXPORT_SIZE / 2 - barLength / 2;
  const right = EXPORT_SIZE / 2 + barLength / 2;
  const lines: GuideSegment[] = [];

  if (paramBoolean(params, 'showHorizon')) {
    lines.push([160, 150, 1440, 150, foreground, railWidth * 0.55]);
  }

  if (paramBoolean(params, 'showDepthGuides')) {
    lines.push(
      [380, 1440, 695, 150, foreground, railWidth],
      [1220, 1440, 905, 150, foreground, railWidth]
    );
  }

  if (paramBoolean(params, 'showTargets')) {
    lines.push(
      [left, upperY, right, upperY, accent, barWidth],
      [left, lowerY, right, lowerY, accent, barWidth]
    );
  }

  if (paramBoolean(params, 'showGuide')) {
    lines.push(...measurementGridSegments(params));
  }

  return lines.map((line) => [line[0], line[1], line[2], line[3], line[4], line[5] * contrast, line[6]]);
}
