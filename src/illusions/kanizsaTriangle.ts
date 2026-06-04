import { colorParam, defaults, rangeParam, toggleParam } from './common';
import { canvasCircle, canvasLine, canvasPolygon, point, renderScaled, svgPolygon } from './v02Helpers';
import { n, svgCircle, svgDocument, svgLine, svgPath } from '../svg';
import { EXPORT_SIZE, paramBoolean, paramColor, paramNumber, type IllusionDefinition, type ParamValues } from '../types';

const schema = [
  rangeParam('dotRadius', 'param.dotRadius', 95, 260, 5, 185, 'px'),
  rangeParam('lineWidth', 'param.lineWidth', 2, 28, 1, 10, 'px'),
  toggleParam('showGuide', 'param.showGuide', false),
  colorParam('background', 'param.background', '#f8fafc'),
  colorParam('foreground', 'param.foreground', '#111827'),
  colorParam('accentColor', 'param.guideColor', '#0f766e')
] as const;

export const kanizsaTriangle: IllusionDefinition = {
  id: 'kanizsa-triangle',
  version: 1,
  titleKey: 'illusion.kanizsa-triangle.title',
  descriptionKey: 'illusion.kanizsa-triangle.description',
  supportsAnimation: false,
  defaultParams: defaults(schema),
  paramSchema: schema,
  randomize: (rng) => ({
    dotRadius: rng.int(150, 215),
    lineWidth: rng.int(7, 15),
    showGuide: rng.next() > 0.75,
    background: rng.pick(['#f8fafc', '#fff7ed', '#eef2ff']),
    foreground: rng.pick(['#111827', '#172554', '#3f1d1d']),
    accentColor: rng.pick(['#0f766e', '#3159b7', '#b45309'])
  }),
  renderCanvas: (ctx, params) => {
    renderScaled(ctx, paramColor(params, 'background'), (scaled) => {
      for (const disk of disks()) {
        drawPacman(scaled, params, disk[0], disk[1], disk[2]);
      }
      drawCornerInducers(scaled, params);
      if (paramBoolean(params, 'showGuide')) {
        drawImpliedTriangleGuide(scaled, params);
      }
    });
  },
  renderSvg: (params) => {
    const parts = [
      ...disks().map(([cx, cy, angle]) => svgPacman(params, cx, cy, angle)),
      ...svgCornerInducers(params)
    ];
    if (paramBoolean(params, 'showGuide')) {
      parts.push(svgImpliedTriangleGuide(params));
    }
    return svgDocument(parts.join(''), paramColor(params, 'background'));
  }
};

const REF_WIDTH = 304;
const REF_HEIGHT = 325;
const WEDGE_ANGLE = Math.PI / 3;
const CORNER_ANGLES: Array<[number, number]> = [
  [0, Math.PI / 3],
  [Math.PI, (Math.PI * 2) / 3],
  [(-Math.PI * 2) / 3, -Math.PI / 3]
];

function scalePoint(x: number, y: number): [number, number] {
  return [(x / REF_WIDTH) * EXPORT_SIZE, (y / REF_HEIGHT) * EXPORT_SIZE];
}

function disks(): [number, number, number][] {
  const [top, left, right] = impliedTriangle();
  return [
    [top[0], top[1], Math.PI / 2],
    [left[0], left[1], -Math.PI / 6],
    [right[0], right[1], Math.PI + Math.PI / 6]
  ];
}

function drawPacman(ctx: CanvasRenderingContext2D, params: ParamValues, cx: number, cy: number, angle: number): void {
  const radius = paramNumber(params, 'dotRadius');
  canvasCircle(ctx, cx, cy, radius, paramColor(params, 'foreground'));
  const p1 = point(cx, cy, radius * 1.08, angle - WEDGE_ANGLE / 2);
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(p1[0], p1[1]);
  ctx.arc(cx, cy, radius * 1.08, angle - WEDGE_ANGLE / 2, angle + WEDGE_ANGLE / 2);
  ctx.closePath();
  ctx.fillStyle = paramColor(params, 'background');
  ctx.fill();
}

function svgPacman(params: ParamValues, cx: number, cy: number, angle: number): string {
  const radius = paramNumber(params, 'dotRadius');
  const p1 = point(cx, cy, radius * 1.08, angle - WEDGE_ANGLE / 2);
  const p2 = point(cx, cy, radius * 1.08, angle + WEDGE_ANGLE / 2);
  const wedge = [
    `M ${n(cx)} ${n(cy)}`,
    `L ${n(p1[0])} ${n(p1[1])}`,
    `A ${n(radius * 1.08)} ${n(radius * 1.08)} 0 0 1 ${n(p2[0])} ${n(p2[1])}`,
    'Z'
  ].join(' ');
  return `${svgCircle(cx, cy, radius, paramColor(params, 'foreground'))}${svgPath(wedge, 'none', 0, paramColor(params, 'background'))}`;
}

function drawCornerInducers(ctx: CanvasRenderingContext2D, params: ParamValues): void {
  const width = Math.max(5, paramNumber(params, 'lineWidth') * 1.4);

  ctx.save();
  for (const [start, end] of cornerSegments(params)) {
    canvasLine(ctx, start[0], start[1], end[0], end[1], paramColor(params, 'foreground'), width, 'square');
  }
  ctx.restore();
}

function svgCornerInducers(params: ParamValues): string[] {
  const width = Math.max(5, paramNumber(params, 'lineWidth') * 1.4);

  return cornerSegments(params).map(([start, end]) =>
    svgLine(start[0], start[1], end[0], end[1], paramColor(params, 'foreground'), width, 'stroke-linecap="square"')
  );
}

function cornerSegments(params: ParamValues): Array<[[number, number], [number, number]]> {
  const radius = paramNumber(params, 'dotRadius');
  return invertedTriangle().flatMap((vertex, index) => {
    const [firstAngle, secondAngle] = CORNER_ANGLES[index];

    return [
      [vertex, point(vertex[0], vertex[1], radius, firstAngle)],
      [vertex, point(vertex[0], vertex[1], radius, secondAngle)]
    ] as Array<[[number, number], [number, number]]>;
  });
}

function drawImpliedTriangleGuide(ctx: CanvasRenderingContext2D, params: ParamValues): void {
  const accent = paramColor(params, 'accentColor');
  const background = paramColor(params, 'background');
  const lineWidth = Math.max(3, paramNumber(params, 'lineWidth') * 0.85);
  const triangle = impliedTriangle();

  ctx.save();
  ctx.globalAlpha = 0.08;
  canvasPolygon(ctx, triangle, accent);
  ctx.restore();

  ctx.save();
  ctx.setLineDash([26, 20]);
  for (const [start, end] of triangleEdges(triangle)) {
    canvasLine(ctx, start[0], start[1], end[0], end[1], accent, lineWidth);
  }
  ctx.restore();

  for (const [start, end] of triangleEdges(triangle)) {
    const [x, y] = midpoint(start, end);
    canvasCircle(ctx, x, y, 36, background, accent, lineWidth);
    canvasCircle(ctx, x, y, 8, accent);
  }
}

function svgImpliedTriangleGuide(params: ParamValues): string {
  const accent = paramColor(params, 'accentColor');
  const background = paramColor(params, 'background');
  const lineWidth = Math.max(3, paramNumber(params, 'lineWidth') * 0.85);
  const triangle = impliedTriangle();
  const fill = svgPolygon(triangle, accent, 'none', 0, 'opacity="0.08"');
  const outline = svgPolygon(
    triangle,
    'transparent',
    accent,
    lineWidth,
    'stroke-dasharray="26 20" stroke-linejoin="round" opacity="0.95"'
  );
  const probes = triangleEdges(triangle)
    .map(([start, end]) => {
      const [x, y] = midpoint(start, end);
      return [
        svgCircle(x, y, 36, background, accent, lineWidth),
        svgCircle(x, y, 8, accent)
      ].join('');
    })
    .join('');
  return `${fill}${outline}${probes}`;
}

function impliedTriangle(): [[number, number], [number, number], [number, number]] {
  const left = scalePoint(76, 226);
  const right = scalePoint(228, 226);
  const sideLength = right[0] - left[0];
  const height = Math.sin(WEDGE_ANGLE) * sideLength;
  const top: [number, number] = [(left[0] + right[0]) / 2, left[1] - height];

  return [top, left, right];
}

function invertedTriangle(): [[number, number], [number, number], [number, number]] {
  const triangle = impliedTriangle();
  const center: [number, number] = [
    (triangle[0][0] + triangle[1][0] + triangle[2][0]) / 3,
    (triangle[0][1] + triangle[1][1] + triangle[2][1]) / 3
  ];

  return [
    reflectPoint(triangle[2], center),
    reflectPoint(triangle[1], center),
    reflectPoint(triangle[0], center)
  ];
}

function triangleEdges(triangle: [[number, number], [number, number], [number, number]]): [[number, number], [number, number]][] {
  return [
    [triangle[0], triangle[1]],
    [triangle[1], triangle[2]],
    [triangle[2], triangle[0]]
  ];
}

function midpoint(start: [number, number], end: [number, number]): [number, number] {
  return [(start[0] + end[0]) / 2, (start[1] + end[1]) / 2];
}

function reflectPoint(pointValue: [number, number], center: [number, number]): [number, number] {
  return [
    center[0] * 2 - pointValue[0],
    center[1] * 2 - pointValue[1]
  ];
}
