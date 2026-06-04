import { colorParam, defaults, rangeParam, toggleParam } from './common';
import { canvasCircle, canvasLine, mixHex, point, renderScaled, svgCircleStroke } from './v02Helpers';
import { svgCircle, svgDocument, svgLine } from '../svg';
import { EXPORT_SIZE, paramBoolean, paramColor, paramNumber, type IllusionDefinition, type ParamValues } from '../types';

const schema = [
  rangeParam('ringCount', 'param.ringCount', 6, 28, 1, 12),
  rangeParam('dotRadius', 'param.dotRadius', 24, 150, 1, 78, 'px'),
  rangeParam('dotOpacity', 'param.dotOpacity', 0.1, 1, 0.01, 0.62),
  rangeParam('driftSpeed', 'param.driftSpeed', 0.03, 1.1, 0.01, 0.36),
  toggleParam('showGuide', 'param.showGuide', false),
  colorParam('background', 'param.background', '#f8fafc'),
  colorParam('foreground', 'param.foreground', '#111827'),
  colorParam('accentColor', 'param.accentColor', '#c084fc')
] as const;

export const lilacChaser: IllusionDefinition = {
  id: 'lilac-chaser',
  version: 1,
  titleKey: 'illusion.lilac-chaser.title',
  descriptionKey: 'illusion.lilac-chaser.description',
  supportsAnimation: true,
  defaultParams: defaults(schema),
  paramSchema: schema,
  randomize: (rng) => ({
    ringCount: rng.int(10, 18),
    dotRadius: rng.int(55, 105),
    dotOpacity: rng.float(0.42, 0.82, 2),
    driftSpeed: rng.float(0.22, 0.62, 2),
    showGuide: rng.next() > 0.78,
    background: rng.pick(['#f8fafc', '#fff7ed', '#f1f5f9']),
    foreground: rng.pick(['#111827', '#172554', '#3f1d1d']),
    accentColor: rng.pick(['#c084fc', '#f0abfc', '#fb7185'])
  }),
  renderCanvas: (ctx, params, frame) => {
    renderScaled(ctx, paramColor(params, 'background'), (scaled) => {
      drawDots(scaled, params, frame.progress);
      if (paramBoolean(params, 'showGuide')) {
        drawGuide(scaled, params, frame.progress);
      }
      canvasLine(scaled, 760, 800, 840, 800, paramColor(params, 'foreground'), 8);
      canvasLine(scaled, 800, 760, 800, 840, paramColor(params, 'foreground'), 8);
    });
  },
  renderSvg: (params) => {
    const dots = dotData(params, 0).map((dot) => `<g opacity="${dot.opacity}">${svgCircle(dot.x, dot.y, dot.r, dot.color)}</g>`);
    if (paramBoolean(params, 'showGuide')) {
      dots.push(...svgGuide(params, 0));
    }
    dots.push(svgLine(760, 800, 840, 800, paramColor(params, 'foreground'), 8));
    dots.push(svgLine(800, 760, 800, 840, paramColor(params, 'foreground'), 8));
    return svgDocument(dots.join(''), paramColor(params, 'background'));
  }
};

function drawDots(ctx: CanvasRenderingContext2D, params: ParamValues, progress: number): void {
  for (const dot of dotData(params, progress)) {
    ctx.globalAlpha = dot.opacity;
    canvasCircle(ctx, dot.x, dot.y, dot.r, dot.color);
  }
  ctx.globalAlpha = 1;
}

function dotData(params: ParamValues, progress: number): { x: number; y: number; r: number; color: string; opacity: number }[] {
  const count = paramNumber(params, 'ringCount');
  const hidden = hiddenIndex(params, progress);
  const radius = 475;
  const result = [];

  for (let index = 0; index < count; index += 1) {
    const [x, y] = point(EXPORT_SIZE / 2, EXPORT_SIZE / 2, radius, -Math.PI / 2 + (Math.PI * 2 * index) / count);
    result.push({
      x,
      y,
      r: paramNumber(params, 'dotRadius'),
      color: paramColor(params, 'accentColor'),
      opacity: index === hidden ? 0 : paramNumber(params, 'dotOpacity')
    });
  }

  return result;
}

function hiddenIndex(params: ParamValues, progress: number): number {
  return Math.floor(progress * paramNumber(params, 'ringCount') * paramNumber(params, 'driftSpeed') * 2) % paramNumber(params, 'ringCount');
}

function hiddenPoint(params: ParamValues, progress: number): [number, number] {
  const count = paramNumber(params, 'ringCount');
  return point(EXPORT_SIZE / 2, EXPORT_SIZE / 2, 475, -Math.PI / 2 + (Math.PI * 2 * hiddenIndex(params, progress)) / count);
}

function guideColor(params: ParamValues): string {
  return mixHex(paramColor(params, 'foreground'), paramColor(params, 'background'), 0.45);
}

function drawGuide(ctx: CanvasRenderingContext2D, params: ParamValues, progress: number): void {
  const center = EXPORT_SIZE / 2;
  const guide = guideColor(params);
  const background = paramColor(params, 'background');
  const [x, y] = hiddenPoint(params, progress);
  const radius = Math.max(18, paramNumber(params, 'dotRadius') + 24);

  ctx.save();
  ctx.setLineDash([20, 22]);
  canvasCircle(ctx, center, center, 475, 'transparent', guide, 4);
  canvasLine(ctx, center, center, x, y, guide, 3);
  ctx.restore();

  canvasCircle(ctx, x, y, radius, background, guide, 5);
  canvasCircle(ctx, center, center, 24, background, guide, 5);
}

function svgGuide(params: ParamValues, progress: number): string[] {
  const center = EXPORT_SIZE / 2;
  const guide = guideColor(params);
  const background = paramColor(params, 'background');
  const [x, y] = hiddenPoint(params, progress);
  const radius = Math.max(18, paramNumber(params, 'dotRadius') + 24);

  return [
    svgCircleStroke(center, center, 475, guide, 4).replace('/>', ' stroke-dasharray="20 22"/>'),
    svgLine(center, center, x, y, guide, 3, 'stroke-dasharray="20 22"'),
    svgCircle(x, y, radius, background, guide, 5),
    svgCircle(center, center, 24, background, guide, 5)
  ];
}
