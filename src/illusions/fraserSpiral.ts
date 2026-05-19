import { colorParam, defaults, fill, polar, rangeParam } from './common';
import { svgDocument, svgLine } from '../svg';
import { EXPORT_SIZE, paramColor, paramNumber, type IllusionDefinition } from '../types';

const schema = [
  rangeParam('bandCount', 'param.bandCount', 5, 18, 1, 11),
  rangeParam('segmentCount', 'param.segmentCount', 24, 96, 1, 56),
  rangeParam('twist', 'param.twist', 6, 34, 1, 18, '°'),
  rangeParam('strokeWidth', 'param.strokeWidth', 7, 28, 1, 15, 'px'),
  rangeParam('contrast', 'param.contrast', 0.35, 1, 0.01, 0.88),
  colorParam('background', 'param.background', '#f8fafc'),
  colorParam('colorA', 'param.colorA', '#111827'),
  colorParam('colorB', 'param.colorB', '#f59e0b'),
  colorParam('accentColor', 'param.accentColor', '#0f766e')
] as const;

export const fraserSpiral: IllusionDefinition = {
  id: 'fraser-spiral',
  version: 1,
  titleKey: 'illusion.fraser-spiral.title',
  descriptionKey: 'illusion.fraser-spiral.description',
  supportsAnimation: false,
  defaultParams: defaults(schema),
  paramSchema: schema,
  randomize: (rng) => ({
    bandCount: rng.int(8, 15),
    segmentCount: rng.int(38, 82),
    twist: rng.int(10, 28),
    strokeWidth: rng.int(10, 24),
    contrast: rng.float(0.62, 0.98, 2),
    background: rng.pick(['#f8fafc', '#fff7ed', '#f0fdfa']),
    colorA: rng.pick(['#111827', '#172554', '#3f1d1d']),
    colorB: rng.pick(['#f59e0b', '#0ea5e9', '#e11d48']),
    accentColor: rng.pick(['#0f766e', '#4c1d95', '#166534'])
  }),
  renderCanvas: (ctx, params) => {
    const size = ctx.canvas.width;
    const scale = size / EXPORT_SIZE;
    fill(ctx, paramColor(params, 'background'));
    ctx.save();
    ctx.globalAlpha = paramNumber(params, 'contrast');
    renderSegments({
      size,
      bandCount: paramNumber(params, 'bandCount'),
      segmentCount: paramNumber(params, 'segmentCount'),
      twist: (paramNumber(params, 'twist') * Math.PI) / 180,
      strokeWidth: paramNumber(params, 'strokeWidth') * scale,
      draw: (x1, y1, x2, y2, color, width) => {
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      },
      colors: [paramColor(params, 'colorA'), paramColor(params, 'colorB'), paramColor(params, 'accentColor')]
    });
    ctx.restore();
  },
  renderSvg: (params) => {
    const parts: string[] = [];
    renderSegments({
      size: EXPORT_SIZE,
      bandCount: paramNumber(params, 'bandCount'),
      segmentCount: paramNumber(params, 'segmentCount'),
      twist: (paramNumber(params, 'twist') * Math.PI) / 180,
      strokeWidth: paramNumber(params, 'strokeWidth'),
      colors: [paramColor(params, 'colorA'), paramColor(params, 'colorB'), paramColor(params, 'accentColor')],
      draw: (x1, y1, x2, y2, color, width) => {
        parts.push(svgLine(x1, y1, x2, y2, color, width));
      }
    });

    return svgDocument(`<g opacity="${paramNumber(params, 'contrast')}">${parts.join('')}</g>`, paramColor(params, 'background'));
  }
};

interface SegmentInput {
  size: number;
  bandCount: number;
  segmentCount: number;
  twist: number;
  strokeWidth: number;
  colors: readonly [string, string, string];
  draw: (x1: number, y1: number, x2: number, y2: number, color: string, width: number) => void;
}

function renderSegments(input: SegmentInput) {
  const center = input.size / 2;
  const minRadius = input.size * 0.12;
  const maxRadius = input.size * 0.45;
  const radiusStep = (maxRadius - minRadius) / Math.max(1, input.bandCount - 1);

  for (let ring = 0; ring < input.bandCount; ring += 1) {
    const radius = minRadius + radiusStep * ring;
    const chord = (Math.PI * 2 * radius) / input.segmentCount * 0.82;

    for (let index = 0; index < input.segmentCount; index += 1) {
      const angle = (index / input.segmentCount) * Math.PI * 2 + ring * 0.09;
      const tilt = ((index + ring) % 2 === 0 ? 1 : -1) * input.twist;
      const orientation = angle + Math.PI / 2 + tilt;
      const [x, y] = polar(center, center, radius, angle);
      const dx = Math.cos(orientation) * chord * 0.5;
      const dy = Math.sin(orientation) * chord * 0.5;
      const color = input.colors[(index + ring) % input.colors.length];
      input.draw(x - dx, y - dy, x + dx, y + dy, color, input.strokeWidth);
    }
  }
}
