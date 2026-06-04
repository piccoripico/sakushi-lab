import { colorParam, defaults, rangeParam, toggleParam } from './common';
import { drawGuideSegments, measurementGridSegments, svgGuideSegments } from './guideHelpers';
import { canvasLine, mixHex, renderScaled, svgPolygon } from './v02Helpers';
import { svgDocument, svgLine } from '../svg';
import { paramBoolean, paramColor, paramNumber, type IllusionDefinition, type ParamValues } from '../types';

const schema = [
  rangeParam('angle', 'param.angle', 8, 60, 1, 30, 'deg'),
  rangeParam('separation', 'param.separation', 100, 520, 10, 280, 'px'),
  rangeParam('lineWidth', 'param.lineWidth', 2, 34, 1, 12, 'px'),
  toggleParam('showContext', 'param.showContext', true),
  toggleParam('showTargets', 'param.showTargets', true),
  toggleParam('showGuide', 'param.showGuide', false),
  colorParam('background', 'param.background', '#f8fafc'),
  colorParam('foreground', 'param.foreground', '#111827'),
  colorParam('accentColor', 'param.accentColor', '#0f766e')
] as const;

export const sanderParallelogram: IllusionDefinition = {
  id: 'sander-parallelogram',
  version: 1,
  titleKey: 'illusion.sander-parallelogram.title',
  descriptionKey: 'illusion.sander-parallelogram.description',
  supportsAnimation: false,
  defaultParams: defaults(schema),
  paramSchema: schema,
  randomize: (rng) => ({
    angle: rng.int(22, 42),
    separation: rng.int(220, 360),
    lineWidth: rng.int(8, 20),
    showContext: rng.next() > 0.12,
    showTargets: true,
    showGuide: rng.next() > 0.65,
    background: rng.pick(['#f8fafc', '#fff7ed', '#eef2ff']),
    foreground: rng.pick(['#111827', '#172554', '#3f1d1d']),
    accentColor: rng.pick(['#0f766e', '#3159b7', '#b45309'])
  }),
  renderCanvas: (ctx, params) => {
    renderScaled(ctx, paramColor(params, 'background'), (scaled) => {
      const { frames, targets, guides } = geometry(params);

      if (paramBoolean(params, 'showContext')) {
        for (const frame of frames) {
          drawPolygon(scaled, frame.points, frame.fill, frame.stroke, frame.width);
        }
      }

      if (paramBoolean(params, 'showTargets')) {
        for (const target of targets) {
          canvasLine(scaled, ...target);
        }
      }

      if (paramBoolean(params, 'showGuide')) {
        drawGuideSegments(scaled, guides);
      }
    });
  },
  renderSvg: (params) => {
    const { frames, targets, guides } = geometry(params);
    return svgDocument([
      ...(paramBoolean(params, 'showContext')
        ? frames.map((frame) => svgPolygon(frame.points, frame.fill, frame.stroke, frame.width))
        : []),
      ...(paramBoolean(params, 'showTargets')
        ? targets.map((target) => svgLine(...target))
        : []),
      ...(paramBoolean(params, 'showGuide')
        ? svgGuideSegments(guides)
        : [])
    ].join(''), paramColor(params, 'background'));
  }
};

type Point = [number, number];
type CanvasSegment = [number, number, number, number, string, number];

function drawPolygon(ctx: CanvasRenderingContext2D, points: readonly Point[], fill: string, stroke: string, width: number): void {
  ctx.beginPath();
  points.forEach(([x, y], index) => (index === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)));
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
  ctx.strokeStyle = stroke;
  ctx.lineWidth = width;
  ctx.lineJoin = 'round';
  ctx.stroke();
}

function geometry(params: ParamValues) {
  const angle = ((38 + paramNumber(params, 'angle') * 0.45) * Math.PI) / 180;
  const separation = paramNumber(params, 'separation');
  const width = paramNumber(params, 'lineWidth');
  const background = paramColor(params, 'background');
  const foreground = paramColor(params, 'foreground');
  const accent = paramColor(params, 'accentColor');
  const lineLength = 520;
  const dx = Math.cos(angle) * lineLength;
  const dy = Math.sin(angle) * lineLength;
  const spacingShift = (separation - 280) * 0.12;
  const leftStart: Point = [430 - spacingShift, 1050];
  const rightStart: Point = [910 + spacingShift, 1050];
  const leftBase = 540 + (separation - 280) * 0.18;
  const rightBase = 255 - (separation - 280) * 0.06;
  const leftEnd: Point = [leftStart[0] + dx, leftStart[1] - dy];
  const rightEnd: Point = [rightStart[0] + dx, rightStart[1] - dy];
  const frameStroke = mixHex(foreground, background, 0.18);
  const frameWidth = Math.max(2, width * 0.85);
  const targetWidth = width * 1.8;
  const targets: CanvasSegment[] = [
    [leftStart[0], leftStart[1], leftEnd[0], leftEnd[1], accent, targetWidth],
    [rightStart[0], rightStart[1], rightEnd[0], rightEnd[1], accent, targetWidth]
  ];

  return {
    frames: [
      {
        points: frame(leftStart, leftEnd, leftBase),
        fill: mixHex(background, accent, 0.08),
        stroke: frameStroke,
        width: frameWidth
      },
      {
        points: frame(rightStart, rightEnd, rightBase),
        fill: mixHex(background, foreground, 0.04),
        stroke: frameStroke,
        width: frameWidth
      }
    ],
    targets,
    guides: measurementGridSegments(params)
  };
}

function frame(start: Point, end: Point, base: number): Point[] {
  return [
    start,
    [start[0] + base, start[1]],
    end,
    [end[0] - base, end[1]]
  ];
}
