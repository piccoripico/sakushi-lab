import { colorParam, defaults, fill, rangeParam } from './common';
import { svgCircle, svgDocument } from '../svg';
import { EXPORT_SIZE, paramColor, paramNumber, type IllusionDefinition, type ParamValues } from '../types';

const schema = [
  rangeParam('centerRadius', 'param.centerRadius', 58, 150, 1, 98, 'px'),
  rangeParam('surroundRadius', 'param.surroundRadius', 32, 170, 1, 92, 'px'),
  rangeParam('leftScale', 'param.leftScale', 0.45, 1.05, 0.01, 0.58),
  rangeParam('rightScale', 'param.rightScale', 0.85, 1.65, 0.01, 1.3),
  rangeParam('surroundCount', 'param.surroundCount', 6, 14, 1, 10),
  rangeParam('gap', 'param.gap', 12, 96, 1, 36, 'px'),
  colorParam('background', 'param.background', '#f8fafc'),
  colorParam('centralColor', 'param.centralColor', '#0f766e'),
  colorParam('surroundColor', 'param.surroundColor', '#3159b7')
] as const;

export const ebbinghaus: IllusionDefinition = {
  id: 'ebbinghaus',
  version: 1,
  titleKey: 'illusion.ebbinghaus.title',
  descriptionKey: 'illusion.ebbinghaus.description',
  supportsAnimation: false,
  defaultParams: defaults(schema),
  paramSchema: schema,
  randomize: (rng) => ({
    centerRadius: rng.int(76, 126),
    surroundRadius: rng.int(54, 132),
    leftScale: rng.float(0.46, 0.76, 2),
    rightScale: rng.float(1.1, 1.58, 2),
    surroundCount: rng.int(7, 12),
    gap: rng.int(18, 72),
    background: rng.pick(['#f8fafc', '#fff7ed', '#eef2ff']),
    centralColor: rng.pick(['#0f766e', '#be123c', '#3159b7']),
    surroundColor: rng.pick(['#3159b7', '#b45309', '#4c1d95'])
  }),
  renderCanvas: (ctx, params) => {
    const width = ctx.canvas.width;
    const scale = width / EXPORT_SIZE;
    fill(ctx, paramColor(params, 'background'));
    drawCluster(ctx, params, width * 0.31, width * 0.5, paramNumber(params, 'leftScale'), scale);
    drawCluster(ctx, params, width * 0.69, width * 0.5, paramNumber(params, 'rightScale'), scale);
  },
  renderSvg: (params) => svgDocument(
    `${svgCluster(params, EXPORT_SIZE * 0.31, EXPORT_SIZE * 0.5, paramNumber(params, 'leftScale'))}${svgCluster(params, EXPORT_SIZE * 0.69, EXPORT_SIZE * 0.5, paramNumber(params, 'rightScale'))}`,
    paramColor(params, 'background')
  )
};

function drawCluster(ctx: CanvasRenderingContext2D, params: ParamValues, cx: number, cy: number, scaleFactor: number, scale: number) {
  const centerRadius = paramNumber(params, 'centerRadius') * scale;
  const surroundRadius = paramNumber(params, 'surroundRadius') * scale * scaleFactor;
  const count = paramNumber(params, 'surroundCount');
  const orbit = centerRadius + surroundRadius + paramNumber(params, 'gap') * scale;

  ctx.save();
  ctx.fillStyle = paramColor(params, 'surroundColor');

  for (let index = 0; index < count; index += 1) {
    const angle = (index / count) * Math.PI * 2 - Math.PI / 2;
    ctx.beginPath();
    ctx.arc(cx + Math.cos(angle) * orbit, cy + Math.sin(angle) * orbit, surroundRadius, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = paramColor(params, 'centralColor');
  ctx.beginPath();
  ctx.arc(cx, cy, centerRadius, 0, Math.PI * 2);
  ctx.fill();
  ctx.lineWidth = 5 * scale;
  ctx.strokeStyle = '#ffffff';
  ctx.stroke();
  ctx.restore();
}

function svgCluster(params: ParamValues, cx: number, cy: number, scaleFactor: number): string {
  const centerRadius = paramNumber(params, 'centerRadius');
  const surroundRadius = paramNumber(params, 'surroundRadius') * scaleFactor;
  const count = paramNumber(params, 'surroundCount');
  const orbit = centerRadius + surroundRadius + paramNumber(params, 'gap');
  const parts: string[] = [];

  for (let index = 0; index < count; index += 1) {
    const angle = (index / count) * Math.PI * 2 - Math.PI / 2;
    parts.push(svgCircle(cx + Math.cos(angle) * orbit, cy + Math.sin(angle) * orbit, surroundRadius, paramColor(params, 'surroundColor')));
  }

  parts.push(svgCircle(cx, cy, centerRadius, paramColor(params, 'centralColor'), '#ffffff', 5));
  return parts.join('');
}
