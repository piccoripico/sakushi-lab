import { colorParam, defaults, fill, polar, rangeParam, toggleParam } from './common';
import { svgDocument, svgLine } from '../svg';
import { EXPORT_SIZE, paramBoolean, paramColor, paramNumber, type IllusionDefinition, type ParamValues } from '../types';

const schema = [
  rangeParam('arrowLength', 'param.arrowLength', 520, 1080, 10, 780, 'px'),
  rangeParam('finLength', 'param.finLength', 80, 260, 5, 160, 'px'),
  rangeParam('finAngle', 'param.finAngle', 18, 58, 1, 34, '°'),
  rangeParam('lineWidth', 'param.lineWidth', 8, 34, 1, 17, 'px'),
  rangeParam('separation', 'param.separation', 260, 560, 10, 380, 'px'),
  toggleParam('showGuide', 'param.showGuide', true),
  colorParam('background', 'param.background', '#f8fafc'),
  colorParam('foreground', 'param.foreground', '#111827'),
  colorParam('accentColor', 'param.accentColor', '#0f766e')
] as const;

export const mullerLyer: IllusionDefinition = {
  id: 'muller-lyer',
  version: 1,
  titleKey: 'illusion.muller-lyer.title',
  descriptionKey: 'illusion.muller-lyer.description',
  supportsAnimation: false,
  defaultParams: defaults(schema),
  paramSchema: schema,
  randomize: (rng) => ({
    arrowLength: rng.int(620, 980),
    finLength: rng.int(110, 230),
    finAngle: rng.int(24, 50),
    lineWidth: rng.int(11, 26),
    separation: rng.int(300, 500),
    showGuide: rng.next() > 0.35,
    background: rng.pick(['#f8fafc', '#fff7ed', '#f0fdf4']),
    foreground: rng.pick(['#111827', '#172554', '#3f1d1d']),
    accentColor: rng.pick(['#0f766e', '#3159b7', '#b45309'])
  }),
  renderCanvas: (ctx, params) => {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    const scale = width / EXPORT_SIZE;
    fill(ctx, paramColor(params, 'background'));
    drawFigure(ctx, params, width / 2, height / 2 - paramNumber(params, 'separation') * scale / 2, true, scale);
    drawFigure(ctx, params, width / 2, height / 2 + paramNumber(params, 'separation') * scale / 2, false, scale);
  },
  renderSvg: (params) => {
    const cx = EXPORT_SIZE / 2;
    const cy = EXPORT_SIZE / 2;
    const separation = paramNumber(params, 'separation');
    const upper = svgFigure(params, cx, cy - separation / 2, true);
    const lower = svgFigure(params, cx, cy + separation / 2, false);
    return svgDocument(`${upper}${lower}`, paramColor(params, 'background'));
  }
};

function drawFigure(
  ctx: CanvasRenderingContext2D,
  params: ParamValues,
  cx: number,
  cy: number,
  inward: boolean,
  scale: number
) {
  const length = paramNumber(params, 'arrowLength') * scale;
  const finLength = paramNumber(params, 'finLength') * scale;
  const angle = (paramNumber(params, 'finAngle') * Math.PI) / 180;
  const x1 = cx - length / 2;
  const x2 = cx + length / 2;

  ctx.save();
  ctx.strokeStyle = paramColor(params, 'foreground');
  ctx.lineWidth = paramNumber(params, 'lineWidth') * scale;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(x1, cy);
  ctx.lineTo(x2, cy);
  ctx.stroke();
  drawFins(ctx, x1, cy, inward ? 0 : Math.PI, finLength, angle);
  drawFins(ctx, x2, cy, inward ? Math.PI : 0, finLength, angle);
  if (paramBoolean(params, 'showGuide')) {
    ctx.strokeStyle = paramColor(params, 'accentColor');
    ctx.lineWidth = Math.max(2, paramNumber(params, 'lineWidth') * scale * 0.28);
    ctx.beginPath();
    ctx.moveTo(x1, cy + 38 * scale);
    ctx.lineTo(x2, cy + 38 * scale);
    ctx.stroke();
  }
  ctx.restore();
}

function drawFins(ctx: CanvasRenderingContext2D, x: number, y: number, direction: number, length: number, angle: number) {
  for (const sign of [-1, 1]) {
    const [tx, ty] = polar(x, y, length, direction + sign * angle);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(tx, ty);
    ctx.stroke();
  }
}

function svgFigure(params: ParamValues, cx: number, cy: number, inward: boolean): string {
  const length = paramNumber(params, 'arrowLength');
  const finLength = paramNumber(params, 'finLength');
  const angle = (paramNumber(params, 'finAngle') * Math.PI) / 180;
  const x1 = cx - length / 2;
  const x2 = cx + length / 2;
  const width = paramNumber(params, 'lineWidth');
  const stroke = paramColor(params, 'foreground');
  const parts = [svgLine(x1, cy, x2, cy, stroke, width)];
  parts.push(...svgFins(x1, cy, inward ? 0 : Math.PI, finLength, angle, stroke, width));
  parts.push(...svgFins(x2, cy, inward ? Math.PI : 0, finLength, angle, stroke, width));
  if (paramBoolean(params, 'showGuide')) {
    parts.push(svgLine(x1, cy + 38, x2, cy + 38, paramColor(params, 'accentColor'), Math.max(2, width * 0.28)));
  }
  return parts.join('');
}

function svgFins(x: number, y: number, direction: number, length: number, angle: number, stroke: string, width: number): string[] {
  return [-1, 1].map((sign) => {
    const [tx, ty] = polar(x, y, length, direction + sign * angle);
    return svgLine(x, y, tx, ty, stroke, width);
  });
}
