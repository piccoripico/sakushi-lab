import { colorParam, defaults, rangeParam, toggleParam } from './common';
import { mixHex, renderScaled } from './v02Helpers';
import { escapeAttr, n, svgCircle, svgDocument, svgLine, svgPath } from '../svg';
import { paramBoolean, paramColor, paramNumber, type IllusionDefinition, type ParamValues } from '../types';

type Point = [number, number];
type FeatureId = 'forehead' | 'brow' | 'eye' | 'nose' | 'upperLip' | 'lowerLip' | 'chin';

const schema = [
  rangeParam('vaseWidth', 'param.vaseWidth', 260, 720, 10, 520, 'px'),
  rangeParam('profileDepth', 'param.profileDepth', 0.25, 1.6, 0.01, 1),
  rangeParam('neckWidth', 'param.neckWidth', 70, 280, 5, 150, 'px'),
  toggleParam('showGuide', 'param.showGuide', false),
  colorParam('background', 'param.background', '#ffffff'),
  colorParam('foreground', 'param.foreground', '#000000'),
  colorParam('accentColor', 'param.guideColor', '#0f766e')
] as const;

export const rubinVase: IllusionDefinition = {
  id: 'rubin-vase',
  version: 1,
  titleKey: 'illusion.rubin-vase.title',
  descriptionKey: 'illusion.rubin-vase.description',
  supportsAnimation: false,
  defaultParams: defaults(schema),
  paramSchema: schema,
  randomize: (rng) => ({
    vaseWidth: rng.int(430, 620),
    profileDepth: rng.float(0.72, 1.28, 2),
    neckWidth: rng.int(110, 210),
    showGuide: rng.next() > 0.76,
    background: rng.pick(['#ffffff', '#f8fafc', '#fff7ed']),
    foreground: rng.pick(['#000000', '#111827', '#172554']),
    accentColor: rng.pick(['#0f766e', '#3159b7', '#b45309'])
  }),
  renderCanvas: (ctx, params) => {
    renderScaled(ctx, paramColor(params, 'background'), (scaled) => {
      const { left, right, vase } = geometry(params);
      scaled.fillStyle = paramColor(params, 'foreground');
      fillPath(scaled, sidePath(left, true));
      fillPath(scaled, sidePath(right, false));

      if (paramBoolean(params, 'showGuide')) {
        const accent = paramColor(params, 'accentColor');
        const guide = mixHex(accent, paramColor(params, 'background'), 0.22);
        scaled.save();
        scaled.lineWidth = GUIDE_WIDTH;
        scaled.lineJoin = 'round';
        scaled.lineCap = 'round';
        scaled.strokeStyle = guide;
        strokePath(scaled, polygonPath(vase));
        scaled.strokeStyle = accent;
        strokePath(scaled, polylinePath(left));
        strokePath(scaled, polylinePath(right));
        scaled.setLineDash([18, 16]);
        scaled.beginPath();
        scaled.moveTo(800, 210);
        scaled.lineTo(800, 1390);
        scaled.stroke();
        drawGuideDetails(scaled, left, right, params, accent, guide);
        scaled.restore();
      }
    });
  },
  renderSvg: (params) => {
    const { left, right, vase } = geometry(params);
    const guide = paramBoolean(params, 'showGuide')
      ? [
          svgPath(pathData(vase, true), mixHex(paramColor(params, 'accentColor'), paramColor(params, 'background'), 0.22), GUIDE_WIDTH, 'none'),
          svgPath(pathData(left), paramColor(params, 'accentColor'), GUIDE_WIDTH, 'none'),
          svgPath(pathData(right), paramColor(params, 'accentColor'), GUIDE_WIDTH, 'none'),
          `<line x1="800" y1="210" x2="800" y2="1390" stroke="${escapeAttr(paramColor(params, 'accentColor'))}" stroke-width="${n(GUIDE_WIDTH)}" stroke-dasharray="18 16"/>`,
          ...svgGuideDetails(left, right, params)
        ].join('')
      : '';
    return svgDocument([
      `<path d="${escapeAttr(sidePathData(left, true))}" fill="${escapeAttr(paramColor(params, 'foreground'))}"/>`,
      `<path d="${escapeAttr(sidePathData(right, false))}" fill="${escapeAttr(paramColor(params, 'foreground'))}"/>`,
      guide
    ].join(''), paramColor(params, 'background'));
  }
};

const GUIDE_WIDTH = 5;
const MARKER_RADIUS = 18;

function geometry(params: ParamValues): { left: Point[]; right: Point[]; vase: Point[] } {
  const scale = paramNumber(params, 'vaseWidth') / 520;
  const depth = paramNumber(params, 'profileDepth');
  const neck = paramNumber(params, 'neckWidth') / 150;
  const center = 800;
  const points: Array<[number, number]> = [
    [0, 520],
    [250, 502],
    [330, 420],
    [430, 356],
    [500, 324],
    [548, 286],
    [592, 315],
    [640, 292],
    [690, 226],
    [740, 178],
    [790, 246],
    [835, 306],
    [875, 254],
    [910, 306],
    [944, 266],
    [982, 314],
    [1034, 286],
    [1088, 346],
    [1180, 420],
    [1290, 478],
    [1600, 500]
  ];
  const neutralWidth = 374 * scale;

  const left = points.map(([y, base]) => {
    const shaped = neutralWidth + (base * scale - neutralWidth) * depth;
    const neckPull = Math.exp(-((y - 1150) ** 2) / 98000) * (neck - 1) * 105;
    const half = Math.max(118, Math.min(640, shaped + neckPull));
    return [center - half, y] as Point;
  });
  const right = left.map(([x, y]) => [center + (center - x), y] as Point);
  const vase = [...left, ...right.slice().reverse()];

  return { left, right, vase };
}

function drawGuideDetails(
  ctx: CanvasRenderingContext2D,
  left: readonly Point[],
  right: readonly Point[],
  params: ParamValues,
  accent: string,
  guide: string
): void {
  const width = Math.max(2, GUIDE_WIDTH * 0.8);

  ctx.save();
  ctx.lineWidth = width;
  ctx.lineCap = 'round';
  ctx.setLineDash([10, 14]);
  ctx.strokeStyle = guide;
  for (const feature of faceFeatureMarkers(left, right)) {
    drawLine(ctx, feature.left, feature.right);
  }
  ctx.restore();

  for (const feature of faceFeatureMarkers(left, right)) {
    for (const pointValue of [feature.left, feature.right]) {
      ctx.beginPath();
      ctx.arc(pointValue[0], pointValue[1], feature.id === 'eye' ? MARKER_RADIUS * 0.78 : MARKER_RADIUS, 0, Math.PI * 2);
      ctx.fillStyle = paramColor(params, 'background');
      ctx.fill();
      ctx.strokeStyle = accent;
      ctx.lineWidth = Math.max(2, width * 0.9);
      ctx.stroke();
    }
  }
}

function svgGuideDetails(left: readonly Point[], right: readonly Point[], params: ParamValues): string[] {
  const accent = paramColor(params, 'accentColor');
  const guide = mixHex(accent, paramColor(params, 'background'), 0.22);
  const width = Math.max(2, GUIDE_WIDTH * 0.8);
  const parts: string[] = [];

  for (const feature of faceFeatureMarkers(left, right)) {
    parts.push(svgLine(feature.left[0], feature.left[1], feature.right[0], feature.right[1], guide, width, `stroke-dasharray="10 14" data-rubin-feature="${feature.id}-level"`));
    for (const side of ['left', 'right'] as const) {
      const pointValue = feature[side];
      parts.push(svgFeatureCircle(feature.id, side, pointValue, feature.id === 'eye' ? MARKER_RADIUS * 0.78 : MARKER_RADIUS, params, accent, width));
    }
  }

  return parts;
}

function faceFeatureMarkers(left: readonly Point[], right: readonly Point[]): Array<{ id: FeatureId; left: Point; right: Point }> {
  const boundaryFeatures: Array<[FeatureId, number]> = [
    ['forehead', 430],
    ['brow', 555],
    ['nose', 740],
    ['upperLip', 875],
    ['lowerLip', 944],
    ['chin', 1034]
  ];
  const features = boundaryFeatures.map(([id, y]) => ({
    id,
    left: pointAtY(left, y),
    right: pointAtY(right, y)
  }));
  const leftEyeBase = pointAtY(left, 625);
  const rightEyeBase = pointAtY(right, 625);

  features.splice(2, 0, {
    id: 'eye',
    left: [leftEyeBase[0] - 72, leftEyeBase[1] + 6],
    right: [rightEyeBase[0] + 72, rightEyeBase[1] + 6]
  });

  return features;
}

function fillPath(ctx: CanvasRenderingContext2D, path: Path2D): void {
  ctx.fill(path);
}

function strokePath(ctx: CanvasRenderingContext2D, path: Path2D): void {
  ctx.stroke(path);
}

function drawLine(ctx: CanvasRenderingContext2D, from: Point, to: Point): void {
  ctx.beginPath();
  ctx.moveTo(from[0], from[1]);
  ctx.lineTo(to[0], to[1]);
  ctx.stroke();
}

function svgFeatureCircle(feature: FeatureId, side: 'left' | 'right', pointValue: Point, radius: number, params: ParamValues, accent: string, width: number): string {
  return svgCircle(pointValue[0], pointValue[1], radius, paramColor(params, 'background'), accent, Math.max(2, width * 0.9))
    .replace('/>', ` data-rubin-feature="${feature}-${side}"/>`);
}

function sidePath(points: Point[], leftSide: boolean): Path2D {
  return new Path2D(sidePathData(points, leftSide));
}

function polygonPath(points: Point[]): Path2D {
  return new Path2D(pathData(points, true));
}

function polylinePath(points: Point[]): Path2D {
  return new Path2D(pathData(points));
}

function pathData(points: Point[], closed = false): string {
  return [`M ${n(points[0][0])} ${n(points[0][1])}`, curveCommands(points), closed ? 'Z' : ''].join(' ');
}

function sidePathData(points: Point[], leftSide: boolean): string {
  const edge = leftSide ? 0 : 1600;
  return [
    `M ${edge} 0`,
    `L ${n(points[0][0])} ${n(points[0][1])}`,
    curveCommands(points),
    `L ${edge} 1600`,
    'Z'
  ].join(' ');
}

function curveCommands(points: readonly Point[]): string {
  const commands: string[] = [];

  for (let index = 0; index < points.length - 1; index += 1) {
    const previous = points[Math.max(0, index - 1)];
    const current = points[index];
    const next = points[index + 1];
    const after = points[Math.min(points.length - 1, index + 2)];
    const c1: Point = [current[0] + (next[0] - previous[0]) / 6, current[1] + (next[1] - previous[1]) / 6];
    const c2: Point = [next[0] - (after[0] - current[0]) / 6, next[1] - (after[1] - current[1]) / 6];
    commands.push(`C ${n(c1[0])} ${n(c1[1])} ${n(c2[0])} ${n(c2[1])} ${n(next[0])} ${n(next[1])}`);
  }

  return commands.join(' ');
}

function pointAtY(points: readonly Point[], y: number): Point {
  for (let index = 0; index < points.length - 1; index += 1) {
    const start = points[index];
    const end = points[index + 1];

    if ((start[1] <= y && y <= end[1]) || (end[1] <= y && y <= start[1])) {
      const t = (y - start[1]) / ((end[1] - start[1]) || 1);
      return [start[0] + (end[0] - start[0]) * t, y];
    }
  }

  return points[Math.floor(points.length / 3)];
}
