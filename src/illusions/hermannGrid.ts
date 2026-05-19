import { colorParam, defaults, fill, hexToRgba, rangeParam } from './common';
import { svgCircle, svgDocument, svgLine } from '../svg';
import { EXPORT_SIZE, paramColor, paramNumber, type IllusionDefinition } from '../types';

const schema = [
  rangeParam('gridCount', 'param.gridCount', 5, 16, 1, 9),
  rangeParam('lineWidth', 'param.lineWidth', 8, 48, 1, 22, 'px'),
  rangeParam('dotRadius', 'param.dotRadius', 4, 34, 1, 13, 'px'),
  rangeParam('dotOpacity', 'param.dotOpacity', 0.15, 1, 0.01, 0.82),
  rangeParam('contrast', 'param.contrast', 0.35, 1, 0.01, 0.9),
  colorParam('background', 'param.background', '#111827'),
  colorParam('foreground', 'param.foreground', '#f8fafc'),
  colorParam('accentColor', 'param.accentColor', '#cbd5e1')
] as const;

export const hermannGrid: IllusionDefinition = {
  id: 'hermann-grid',
  version: 1,
  titleKey: 'illusion.hermann-grid.title',
  descriptionKey: 'illusion.hermann-grid.description',
  supportsAnimation: false,
  defaultParams: defaults(schema),
  paramSchema: schema,
  randomize: (rng) => ({
    gridCount: rng.int(6, 14),
    lineWidth: rng.int(12, 38),
    dotRadius: rng.int(7, 24),
    dotOpacity: rng.float(0.42, 0.95, 2),
    contrast: rng.float(0.65, 1, 2),
    background: rng.pick(['#111827', '#0f172a', '#1f2937']),
    foreground: rng.pick(['#f8fafc', '#f1f5f9', '#fff7ed']),
    accentColor: rng.pick(['#cbd5e1', '#bae6fd', '#fecdd3'])
  }),
  renderCanvas: (ctx, params) => {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    const count = paramNumber(params, 'gridCount');
    const lineWidth = paramNumber(params, 'lineWidth') * (width / EXPORT_SIZE);
    const dotRadius = paramNumber(params, 'dotRadius') * (width / EXPORT_SIZE);
    const margin = width * 0.11;
    const step = (width - margin * 2) / (count - 1);

    fill(ctx, paramColor(params, 'background'));
    ctx.save();
    ctx.globalAlpha = paramNumber(params, 'contrast');
    ctx.strokeStyle = paramColor(params, 'foreground');
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';

    for (let index = 0; index < count; index += 1) {
      const pos = margin + step * index;
      ctx.beginPath();
      ctx.moveTo(margin, pos);
      ctx.lineTo(width - margin, pos);
      ctx.moveTo(pos, margin);
      ctx.lineTo(pos, height - margin);
      ctx.stroke();
    }

    ctx.fillStyle = hexToRgba(paramColor(params, 'accentColor'), paramNumber(params, 'dotOpacity'));

    for (let x = 1; x < count - 1; x += 1) {
      for (let y = 1; y < count - 1; y += 1) {
        ctx.beginPath();
        ctx.arc(margin + step * x, margin + step * y, dotRadius, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    ctx.restore();
  },
  renderSvg: (params) => {
    const count = paramNumber(params, 'gridCount');
    const lineWidth = paramNumber(params, 'lineWidth');
    const dotRadius = paramNumber(params, 'dotRadius');
    const margin = EXPORT_SIZE * 0.11;
    const step = (EXPORT_SIZE - margin * 2) / (count - 1);
    const parts: string[] = [];

    for (let index = 0; index < count; index += 1) {
      const pos = margin + step * index;
      parts.push(svgLine(margin, pos, EXPORT_SIZE - margin, pos, paramColor(params, 'foreground'), lineWidth));
      parts.push(svgLine(pos, margin, pos, EXPORT_SIZE - margin, paramColor(params, 'foreground'), lineWidth));
    }

    for (let x = 1; x < count - 1; x += 1) {
      for (let y = 1; y < count - 1; y += 1) {
        parts.push(svgCircle(margin + step * x, margin + step * y, dotRadius, paramColor(params, 'accentColor')));
      }
    }

    return svgDocument(
      `<g opacity="${paramNumber(params, 'contrast')}">${parts.join('')}</g>`,
      paramColor(params, 'background')
    );
  }
};
