import { colorParam, defaults, rangeParam, toggleParam } from './common';
import { measurementGridSegments } from './guideHelpers';
import { canvasLine, renderScaled } from './v02Helpers';
import { svgDocument, svgLine } from '../svg';
import { EXPORT_SIZE, paramBoolean, paramColor, paramNumber, type IllusionDefinition, type ParamValues } from '../types';

const schema = [
  rangeParam('arrowLength', 'param.arrowLength', 260, 1120, 10, 720, 'px'),
  rangeParam('lineWidth', 'param.lineWidth', 3, 42, 1, 16, 'px'),
  rangeParam('gap', 'param.gap', 20, 320, 10, 130, 'px'),
  toggleParam('showGuide', 'param.showGuide', false),
  colorParam('background', 'param.background', '#f8fafc'),
  colorParam('foreground', 'param.foreground', '#111827'),
  colorParam('accentColor', 'param.guideColor', '#0f766e')
] as const;

export const verticalHorizontal: IllusionDefinition = {
  id: 'vertical-horizontal',
  version: 1,
  titleKey: 'illusion.vertical-horizontal.title',
  descriptionKey: 'illusion.vertical-horizontal.description',
  supportsAnimation: false,
  defaultParams: defaults(schema),
  paramSchema: schema,
  randomize: (rng) => ({
    arrowLength: rng.int(560, 900),
    lineWidth: rng.int(10, 26),
    gap: rng.int(100, 200),
    showGuide: rng.next() > 0.35,
    background: rng.pick(['#f8fafc', '#fff7ed', '#f0fdfa']),
    foreground: rng.pick(['#111827', '#172554', '#3f1d1d']),
    accentColor: rng.pick(['#0f766e', '#3159b7', '#b45309'])
  }),
  renderCanvas: (ctx, params) => {
    renderScaled(ctx, paramColor(params, 'background'), (scaled) => {
      const geometry = lines(params);
      for (const line of geometry) {
        drawLine(scaled, line);
      }
    });
  },
  renderSvg: (params) => svgDocument(lines(params).map((line) => svgLine(...line)).join(''), paramColor(params, 'background'))
};

type Segment = [number, number, number, number, string, number, string?];

function drawLine(ctx: CanvasRenderingContext2D, line: Segment): void {
  const [x1, y1, x2, y2, color, width, extra] = line;

  if (extra?.includes('stroke-dasharray')) {
    ctx.save();
    ctx.setLineDash([24, 18]);
    canvasLine(ctx, x1, y1, x2, y2, color, width);
    ctx.restore();
    return;
  }

  canvasLine(ctx, x1, y1, x2, y2, color, width);
}

function lines(params: ParamValues): Segment[] {
  const length = paramNumber(params, 'arrowLength');
  const gap = paramNumber(params, 'gap');
  const width = paramNumber(params, 'lineWidth');
  const foreground = paramColor(params, 'foreground');
  const centerX = EXPORT_SIZE / 2;
  const centerY = EXPORT_SIZE / 2 + gap;
  const left = centerX - length / 2;
  const right = centerX + length / 2;
  const result: Segment[] = [
    ...(paramBoolean(params, 'showGuide') ? measurementGridSegments(params) : []),
    [centerX, centerY, centerX, centerY - length, foreground, width],
    [left, centerY, right, centerY, foreground, width]
  ];

  return result;
}
