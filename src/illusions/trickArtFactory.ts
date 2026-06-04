import { colorParam, defaults, rangeParam, toggleParam } from './common';
import { canvasCircle, canvasLine, canvasPolygon, canvasRotatedRect, mixHex, renderScaled, svgPolygon, svgRotatedRect } from './v02Helpers';
import { n, svgCircle, svgDocument, svgLine, svgPath, svgRect } from '../svg';
import { EXPORT_SIZE, paramBoolean, paramColor, paramNumber, type IllusionDefinition, type ParamControl, type ParamValues, type RenderFrame, type Rng } from '../types';

type Point = [number, number];

export type TrickArtKind =
  | 'rotatingNeckerCube';

interface TrickArtConfig {
  id: string;
  titleKey: string;
  descriptionKey: string;
  kind: TrickArtKind;
  supportsAnimation: boolean;
}

const baseSchema = Object.freeze([
  rangeParam('depth', 'param.depth', 0.05, 1.4, 0.01, 0.64),
  rangeParam('angle', 'param.angle', -60, 60, 1, 0, '°'),
  rangeParam('lineWidth', 'param.lineWidth', 1, 36, 1, 9, 'px'),
  rangeParam('contrast', 'param.contrast', 0.15, 1, 0.01, 0.86),
  toggleParam('showGuide', 'param.showGuide', false),
  toggleParam('showFace1', 'param.showFace1', false),
  toggleParam('showFace2', 'param.showFace2', false),
  colorParam('background', 'param.background', '#f8fafc'),
  colorParam('foreground', 'param.foreground', '#111827'),
  colorParam('accentColor', 'param.face1Color', '#0f766e'),
  colorParam('colorB', 'param.face2Color', '#f59e0b')
] satisfies readonly ParamControl[]);

const animationSchema = Object.freeze([
  rangeParam('driftSpeed', 'param.driftSpeed', 0.03, 1.4, 0.01, 0.42)
] satisfies readonly ParamControl[]);

export function createTrickArtIllusion(config: TrickArtConfig): IllusionDefinition {
  const paramSchema = config.supportsAnimation ? [...baseSchema, ...animationSchema] : baseSchema;

  return {
    id: config.id,
    version: 1,
    titleKey: config.titleKey,
    descriptionKey: config.descriptionKey,
    supportsAnimation: config.supportsAnimation,
    defaultParams: defaults(paramSchema),
    paramSchema,
    randomize: (rng) => randomParams(rng, config.supportsAnimation),
    renderCanvas: (ctx, params, frame) => {
      renderScaled(ctx, paramColor(params, 'background'), (scaled) => {
        drawScene(scaled, config.kind, params, frame);
      });
    },
    renderSvg: (params) => svgDocument(svgScene(config.kind, params), paramColor(params, 'background'))
  };
}

function randomParams(rng: Rng, animated: boolean): ParamValues {
  const values: ParamValues = {
    depth: rng.float(0.42, 0.9, 2),
    angle: rng.int(-18, 18),
    lineWidth: rng.int(6, 15),
    contrast: rng.float(0.62, 0.96, 2),
    showGuide: rng.next() > 0.78,
    showFace1: false,
    showFace2: false,
    background: rng.pick(['#f8fafc', '#fff7ed', '#eff6ff', '#f0fdfa']),
    foreground: rng.pick(['#111827', '#172554', '#3f1d1d']),
    accentColor: rng.pick(['#0f766e', '#3159b7', '#be123c']),
    colorB: rng.pick(['#f59e0b', '#7c3aed', '#0891b2'])
  };

  if (animated) {
    values.driftSpeed = rng.float(0.24, 0.74, 2);
  }

  return values;
}

function drawScene(ctx: CanvasRenderingContext2D, kind: TrickArtKind, params: ParamValues, frame: RenderFrame): void {
  const progress = (frame.progress * paramNumber(params, 'driftSpeed')) % 1;

  ctx.save();
  ctx.globalAlpha = paramNumber(params, 'contrast');

  switch (kind) {
    case 'rotatingNeckerCube':
      drawNeckerCube(ctx, params, progress, true);
      break;
  }
  ctx.restore();
}

function svgScene(kind: TrickArtKind, params: ParamValues): string {
  const parts: string[] = [];

  switch (kind) {
    case 'rotatingNeckerCube':
      parts.push(...svgNeckerCube(params, 0.35, true));
      break;
  }

  return `<g opacity="${paramNumber(params, 'contrast')}">${parts.join('')}</g>`;
}

function drawPaperContext(ctx: CanvasRenderingContext2D, params: ParamValues): void {
  const bg = paramColor(params, 'background');
  ctx.fillStyle = mixHex(bg, paramColor(params, 'colorB'), 0.06);
  ctx.fillRect(0, 0, EXPORT_SIZE, EXPORT_SIZE);
  ctx.strokeStyle = mixHex(paramColor(params, 'foreground'), bg, 0.84);
  ctx.lineWidth = 2;
  for (let x = 180; x < EXPORT_SIZE; x += 160) {
    canvasLine(ctx, x, 120, x, 1480, ctx.strokeStyle, 1.5);
  }
  for (let y = 180; y < EXPORT_SIZE; y += 160) {
    canvasLine(ctx, 120, y, 1480, y, ctx.strokeStyle, 1.5);
  }
}

function svgPaperContext(params: ParamValues): string[] {
  const bg = paramColor(params, 'background');
  const line = mixHex(paramColor(params, 'foreground'), bg, 0.84);
  const parts = [svgRect(0, 0, EXPORT_SIZE, EXPORT_SIZE, mixHex(bg, paramColor(params, 'colorB'), 0.06))];
  for (let x = 180; x < EXPORT_SIZE; x += 160) {
    parts.push(svgLine(x, 120, x, 1480, line, 1.5));
  }
  for (let y = 180; y < EXPORT_SIZE; y += 160) {
    parts.push(svgLine(120, y, 1480, y, line, 1.5));
  }
  return parts;
}

function drawPenroseTriangle(ctx: CanvasRenderingContext2D, params: ParamValues): void {
  const geometry = penroseGeometry(params);
  const colors = faceColors(params);

  if (paramBoolean(params, 'showShadow')) {
    canvasPolygon(ctx, geometry.vertices.map(([x, y]) => [x + 34, y + 46] as Point), 'rgba(17, 24, 39, 0.12)');
  }

  for (const [index, beam] of geometry.beams.entries()) {
    canvasPolygon(ctx, beam.shape, colors[index], paramColor(params, 'foreground'), paramNumber(params, 'lineWidth'));
  }

  if (paramBoolean(params, 'showTargets')) {
    canvasPolygon(ctx, geometry.innerTriangle, paramColor(params, 'background'), paramColor(params, 'foreground'), Math.max(2, paramNumber(params, 'lineWidth') * 0.45));
  }
}

function svgPenroseTriangle(params: ParamValues): string[] {
  const geometry = penroseGeometry(params);
  const colors = faceColors(params);
  const parts: string[] = [];

  if (paramBoolean(params, 'showShadow')) {
    parts.push(svgPolygon(geometry.vertices.map(([x, y]) => [x + 34, y + 46] as Point), 'rgba(17, 24, 39, 0.12)'));
  }

  for (const [index, beam] of geometry.beams.entries()) {
    parts.push(svgPolygon(beam.shape, colors[index], paramColor(params, 'foreground'), paramNumber(params, 'lineWidth')));
  }

  if (paramBoolean(params, 'showTargets')) {
    parts.push(svgPolygon(geometry.innerTriangle, paramColor(params, 'background'), paramColor(params, 'foreground'), Math.max(2, paramNumber(params, 'lineWidth') * 0.45)));
  }

  return parts;
}

function penroseGeometry(params: ParamValues): {
  vertices: [Point, Point, Point];
  innerTriangle: [Point, Point, Point];
  beams: Array<{ shape: Point[]; guideStart: Point; guideEnd: Point }>;
} {
  const cx = 800;
  const cy = 830;
  const radius = 520;
  const thickness = 170 * paramNumber(params, 'depth');
  const vertices: [Point, Point, Point] = [
    point(cx, cy, radius, -Math.PI / 2),
    point(cx, cy, radius, Math.PI / 6),
    point(cx, cy, radius, (Math.PI * 5) / 6)
  ];
  const beams = vertices.map((a, index) => {
    const b = vertices[(index + 1) % vertices.length];
    const c = vertices[(index + 2) % vertices.length];
    const innerStart = inset(a, c, thickness);
    const innerEnd = inset(b, c, thickness);
    return {
      shape: [a, b, innerEnd, innerStart],
      guideStart: lerp(a, innerStart, 0.48),
      guideEnd: lerp(b, innerEnd, 0.48)
    };
  });

  return {
    vertices,
    innerTriangle: [
      inset(vertices[0], vertices[1], thickness * 1.3),
      inset(vertices[1], vertices[2], thickness * 1.3),
      inset(vertices[2], vertices[0], thickness * 1.3)
    ],
    beams
  };
}

function drawPenroseTriangleGuide(ctx: CanvasRenderingContext2D, params: ParamValues): void {
  const geometry = penroseGeometry(params);
  const accent = paramColor(params, 'accentColor');
  const b = paramColor(params, 'colorB');
  const background = paramColor(params, 'background');
  const foreground = paramColor(params, 'foreground');
  const guideWidth = Math.max(4, paramNumber(params, 'lineWidth') * 0.72);
  const colors = [accent, b, mixHex(accent, b, 0.45)];

  for (const [index, beam] of geometry.beams.entries()) {
    drawGuideArrow(ctx, beam.guideStart, beam.guideEnd, colors[index], guideWidth);
  }

  for (const [index, vertex] of geometry.vertices.entries()) {
    const color = colors[index];
    canvasCircle(ctx, vertex[0], vertex[1], 62, background, color, guideWidth);
    canvasCircle(ctx, vertex[0], vertex[1], 18, color, foreground, Math.max(2, guideWidth * 0.35));
  }
}

function svgPenroseTriangleGuide(params: ParamValues): string[] {
  const geometry = penroseGeometry(params);
  const accent = paramColor(params, 'accentColor');
  const b = paramColor(params, 'colorB');
  const background = paramColor(params, 'background');
  const foreground = paramColor(params, 'foreground');
  const guideWidth = Math.max(4, paramNumber(params, 'lineWidth') * 0.72);
  const colors = [accent, b, mixHex(accent, b, 0.45)];
  const parts: string[] = [];

  for (const [index, beam] of geometry.beams.entries()) {
    parts.push(...svgGuideArrow(beam.guideStart, beam.guideEnd, colors[index], guideWidth));
  }

  for (const [index, vertex] of geometry.vertices.entries()) {
    const color = colors[index];
    parts.push(
      svgCircle(vertex[0], vertex[1], 62, background, color, guideWidth),
      svgCircle(vertex[0], vertex[1], 18, color, foreground, Math.max(2, guideWidth * 0.35))
    );
  }

  return parts;
}

function drawImpossibleCube(ctx: CanvasRenderingContext2D, params: ParamValues, progress: number): void {
  const geometry = impossibleCubeGeometry(params, progress);
  const foreground = paramColor(params, 'foreground');
  const accent = paramColor(params, 'accentColor');
  const b = paramColor(params, 'colorB');
  const w = paramNumber(params, 'lineWidth');

  if (paramBoolean(params, 'showShadow')) {
    canvasPolygon(ctx, geometry.back.map(([x, y]) => [x + 42, y + 50] as Point), 'rgba(17, 24, 39, 0.12)');
  }

  for (const connector of geometry.connectors) {
    canvasLine(ctx, connector.from[0], connector.from[1], connector.to[0], connector.to[1], connector.conflict ? b : accent, w * 2.5);
  }

  if (paramBoolean(params, 'showGuide')) {
    drawGuideArrow(ctx, geometry.conflict.from, geometry.conflict.expected, accent, w * 1.7);
    drawGuideArrow(ctx, geometry.conflict.from, geometry.conflict.actual, b, w * 1.7);
  }

  drawPolyline(ctx, [...geometry.front, geometry.front[0]], foreground, w * 2.2);
  drawPolyline(ctx, [...geometry.back, geometry.back[0]], foreground, w * 2.2);

  if (paramBoolean(params, 'showTargets')) {
    drawImpossibleCubeConflictMarkers(ctx, geometry, params);
  }
}

function svgImpossibleCube(params: ParamValues, progress: number): string[] {
  const geometry = impossibleCubeGeometry(params, progress);
  const foreground = paramColor(params, 'foreground');
  const accent = paramColor(params, 'accentColor');
  const b = paramColor(params, 'colorB');
  const w = paramNumber(params, 'lineWidth');
  const parts: string[] = [];

  if (paramBoolean(params, 'showShadow')) {
    parts.push(svgPolygon(geometry.back.map(([x, y]) => [x + 42, y + 50] as Point), 'rgba(17, 24, 39, 0.12)'));
  }

  for (const connector of geometry.connectors) {
    parts.push(svgLine(connector.from[0], connector.from[1], connector.to[0], connector.to[1], connector.conflict ? b : accent, w * 2.5));
  }

  if (paramBoolean(params, 'showGuide')) {
    parts.push(
      ...svgGuideArrow(geometry.conflict.from, geometry.conflict.expected, accent, w * 1.7),
      ...svgGuideArrow(geometry.conflict.from, geometry.conflict.actual, b, w * 1.7)
    );
  }

  parts.push(svgPolyline([...geometry.front, geometry.front[0]], foreground, w * 2.2), svgPolyline([...geometry.back, geometry.back[0]], foreground, w * 2.2));

  if (paramBoolean(params, 'showTargets')) {
    parts.push(...svgImpossibleCubeConflictMarkers(geometry, params));
  }

  return parts;
}

function impossibleCubeGeometry(params: ParamValues, progress: number): {
  front: Point[];
  back: Point[];
  connectors: Array<{ from: Point; to: Point; conflict: boolean }>;
  conflict: { from: Point; expected: Point; actual: Point };
} {
  const spin = progress * Math.PI * 2 + (paramNumber(params, 'angle') * Math.PI) / 180;
  const depth = paramNumber(params, 'depth');
  const cx = 800;
  const cy = 800;
  const size = 390 + Math.min(95, depth * 72);
  const offset = 115 + depth * 255;
  const front = rectPoints(cx, cy, size, size, spin * 0.05);
  const back = rectPoints(cx + Math.cos(spin) * offset, cy - Math.sin(spin) * offset, size, size, spin * 0.05);

  return {
    front,
    back,
    connectors: [
      { from: front[0], to: back[0], conflict: false },
      { from: front[1], to: back[2], conflict: true },
      { from: front[2], to: back[2], conflict: false },
      { from: front[3], to: back[3], conflict: false }
    ],
    conflict: {
      from: front[1],
      expected: back[1],
      actual: back[2]
    }
  };
}

function drawImpossibleCubeConflictMarkers(ctx: CanvasRenderingContext2D, geometry: ReturnType<typeof impossibleCubeGeometry>, params: ParamValues): void {
  const foreground = paramColor(params, 'foreground');
  const accent = paramColor(params, 'accentColor');
  const b = paramColor(params, 'colorB');
  const radius = Math.max(13, paramNumber(params, 'lineWidth') * 2.2);

  canvasCircle(ctx, geometry.conflict.from[0], geometry.conflict.from[1], radius, paramColor(params, 'background'), foreground, Math.max(2, radius * 0.22));
  canvasCircle(ctx, geometry.conflict.expected[0], geometry.conflict.expected[1], radius * 0.82, 'rgba(255, 255, 255, 0)', accent, Math.max(2, radius * 0.18));
  canvasCircle(ctx, geometry.conflict.actual[0], geometry.conflict.actual[1], radius * 0.82, 'rgba(255, 255, 255, 0)', b, Math.max(2, radius * 0.18));
  drawImpossibleCubeWrongTargetCross(ctx, geometry.conflict.actual, b, radius);
}

function svgImpossibleCubeConflictMarkers(geometry: ReturnType<typeof impossibleCubeGeometry>, params: ParamValues): string[] {
  const foreground = paramColor(params, 'foreground');
  const accent = paramColor(params, 'accentColor');
  const b = paramColor(params, 'colorB');
  const radius = Math.max(13, paramNumber(params, 'lineWidth') * 2.2);

  return [
    svgCircle(geometry.conflict.from[0], geometry.conflict.from[1], radius, paramColor(params, 'background'), foreground, Math.max(2, radius * 0.22)),
    svgCircle(geometry.conflict.expected[0], geometry.conflict.expected[1], radius * 0.82, 'rgba(255, 255, 255, 0)', accent, Math.max(2, radius * 0.18)),
    svgCircle(geometry.conflict.actual[0], geometry.conflict.actual[1], radius * 0.82, 'rgba(255, 255, 255, 0)', b, Math.max(2, radius * 0.18)),
    ...svgImpossibleCubeWrongTargetCross(geometry.conflict.actual, b, radius)
  ];
}

function drawImpossibleCubeWrongTargetCross(ctx: CanvasRenderingContext2D, center: Point, color: string, radius: number): void {
  const arm = radius * 0.55;
  const width = Math.max(2, radius * 0.18);

  canvasLine(ctx, center[0] - arm, center[1] - arm, center[0] + arm, center[1] + arm, color, width, 'round');
  canvasLine(ctx, center[0] - arm, center[1] + arm, center[0] + arm, center[1] - arm, color, width, 'round');
}

function svgImpossibleCubeWrongTargetCross(center: Point, color: string, radius: number): string[] {
  const arm = radius * 0.55;
  const width = Math.max(2, radius * 0.18);

  return [
    svgLine(center[0] - arm, center[1] - arm, center[0] + arm, center[1] + arm, color, width),
    svgLine(center[0] - arm, center[1] + arm, center[0] + arm, center[1] - arm, color, width)
  ];
}

function drawImpossibleTrident(ctx: CanvasRenderingContext2D, params: ParamValues): void {
  const foreground = paramColor(params, 'foreground');
  const accent = paramColor(params, 'accentColor');
  const b = paramColor(params, 'colorB');
  const w = paramNumber(params, 'lineWidth');
  const targetFill = paramBoolean(params, 'showTargets');
  const y = 800;

  for (let i = 0; i < 3; i += 1) {
    const yy = y - 260 + i * 260;
    canvasLine(ctx, 280, yy, 1020, yy, foreground, w * 3, 'round');
    canvasCircle(ctx, 1110, yy, 72, targetFill ? (i === 1 ? b : accent) : paramColor(params, 'background'), foreground, w * 1.3);
  }

  canvasLine(ctx, 250, y - 260, 250, y + 260, foreground, w * 3);
  canvasLine(ctx, 250, y - 260, 620, y, foreground, w * 3);
  canvasLine(ctx, 250, y + 260, 620, y, foreground, w * 3);
  canvasLine(ctx, 620, y, 1020, y - 260, foreground, w * 2.2);
  canvasLine(ctx, 620, y, 1020, y + 260, foreground, w * 2.2);
  if (paramBoolean(params, 'showShadow')) {
    canvasRotatedRect(ctx, 720, 1130, 880, 55, 0, 'rgba(17, 24, 39, 0.10)');
  }
}

function svgImpossibleTrident(params: ParamValues): string[] {
  const foreground = paramColor(params, 'foreground');
  const accent = paramColor(params, 'accentColor');
  const b = paramColor(params, 'colorB');
  const w = paramNumber(params, 'lineWidth');
  const targetFill = paramBoolean(params, 'showTargets');
  const y = 800;
  const parts: string[] = [];

  for (let i = 0; i < 3; i += 1) {
    const yy = y - 260 + i * 260;
    parts.push(svgLine(280, yy, 1020, yy, foreground, w * 3), svgCircle(1110, yy, 72, targetFill ? (i === 1 ? b : accent) : paramColor(params, 'background'), foreground, w * 1.3));
  }

  parts.push(svgLine(250, y - 260, 250, y + 260, foreground, w * 3), svgLine(250, y - 260, 620, y, foreground, w * 3), svgLine(250, y + 260, 620, y, foreground, w * 3), svgLine(620, y, 1020, y - 260, foreground, w * 2.2), svgLine(620, y, 1020, y + 260, foreground, w * 2.2));
  if (paramBoolean(params, 'showShadow')) {
    parts.push(svgRotatedRect(720, 1130, 880, 55, 0, 'rgba(17, 24, 39, 0.10)'));
  }
  return parts;
}

function drawImpossibleTridentGuide(ctx: CanvasRenderingContext2D, params: ParamValues): void {
  const foreground = paramColor(params, 'foreground');
  const background = paramColor(params, 'background');
  const accent = paramColor(params, 'accentColor');
  const b = paramColor(params, 'colorB');
  const guide = Math.max(4, paramNumber(params, 'lineWidth') * 0.72);
  const y = 800;

  ctx.save();
  ctx.globalAlpha = 0.12;
  canvasRotatedRect(ctx, 620, y, 210, 760, 0, accent);
  ctx.restore();

  ctx.save();
  ctx.setLineDash([24, 18]);
  for (let i = 0; i < 3; i += 1) {
    const yy = y - 260 + i * 260;
    const color = i === 1 ? b : accent;
    canvasLine(ctx, 1110, yy, 710, yy, color, guide);
    canvasCircle(ctx, 1110, yy, 104, 'transparent', color, guide);
  }
  canvasLine(ctx, 250, y - 260, 620, y, accent, guide);
  canvasLine(ctx, 250, y + 260, 620, y, b, guide);
  ctx.restore();

  canvasCircle(ctx, 250, y - 260, 44, background, accent, guide);
  canvasCircle(ctx, 250, y + 260, 44, background, b, guide);
  canvasCircle(ctx, 620, y, 54, background, foreground, Math.max(3, guide * 0.8));
}

function svgImpossibleTridentGuide(params: ParamValues): string[] {
  const foreground = paramColor(params, 'foreground');
  const background = paramColor(params, 'background');
  const accent = paramColor(params, 'accentColor');
  const b = paramColor(params, 'colorB');
  const guide = Math.max(4, paramNumber(params, 'lineWidth') * 0.72);
  const y = 800;
  const parts = [
    svgRotatedRect(620, y, 210, 760, 0, accent).replace('/>', ' opacity="0.12"/>')
  ];

  for (let i = 0; i < 3; i += 1) {
    const yy = y - 260 + i * 260;
    const color = i === 1 ? b : accent;
    parts.push(
      svgLine(1110, yy, 710, yy, color, guide, 'stroke-dasharray="24 18"'),
      svgCircle(1110, yy, 104, 'transparent', color, guide)
    );
  }

  parts.push(
    svgLine(250, y - 260, 620, y, accent, guide, 'stroke-dasharray="24 18"'),
    svgLine(250, y + 260, 620, y, b, guide, 'stroke-dasharray="24 18"'),
    svgCircle(250, y - 260, 44, background, accent, guide),
    svgCircle(250, y + 260, 44, background, b, guide),
    svgCircle(620, y, 54, background, foreground, Math.max(3, guide * 0.8))
  );

  return parts;
}

function drawEndlessStairs(ctx: CanvasRenderingContext2D, params: ParamValues, progress: number): void {
  const colors = faceColors(params);
  const geometry = endlessStairsGeometry(params, progress);
  const foreground = paramColor(params, 'foreground');
  const lineWidth = paramNumber(params, 'lineWidth');

  if (paramBoolean(params, 'showShadow')) {
    for (const step of geometry.steps) {
      canvasPolygon(ctx, step.tread.map(([x, y]) => [x + 28, y + 42] as Point), 'rgba(17, 24, 39, 0.08)');
    }
  }

  for (const [index, step] of geometry.steps.entries()) {
    const base = colors[index % colors.length];
    canvasPolygon(ctx, step.riser, mixHex(base, foreground, 0.28), foreground, Math.max(1.5, lineWidth * 0.5));
    canvasPolygon(ctx, step.tread, mixHex(base, paramColor(params, 'background'), index % 2 === 0 ? 0.1 : 0.24), foreground, lineWidth);
  }

  if (paramBoolean(params, 'showTargets')) {
    for (const marker of geometry.markers) {
      canvasCircle(ctx, marker.point[0], marker.point[1], lineWidth * 2.7, marker.color, foreground, Math.max(1.5, lineWidth * 0.3));
    }
  }

  if (paramBoolean(params, 'showGuide')) {
    drawDashedPolyline(ctx, [...geometry.loopPath, geometry.loopPath[0]], mixHex(foreground, paramColor(params, 'background'), 0.42), lineWidth * 0.85);
    for (const arrow of geometry.arrows) {
      drawArrow(ctx, arrow.from, arrow.to, arrow.color, lineWidth * 1.2);
    }
  }
}

function svgEndlessStairs(params: ParamValues, progress: number): string[] {
  const colors = faceColors(params);
  const parts: string[] = [];
  const geometry = endlessStairsGeometry(params, progress);
  const foreground = paramColor(params, 'foreground');
  const lineWidth = paramNumber(params, 'lineWidth');

  if (paramBoolean(params, 'showShadow')) {
    for (const step of geometry.steps) {
      parts.push(svgPolygon(step.tread.map(([x, y]) => [x + 28, y + 42] as Point), 'rgba(17, 24, 39, 0.08)'));
    }
  }

  for (const [index, step] of geometry.steps.entries()) {
    const base = colors[index % colors.length];
    parts.push(
      svgPolygon(step.riser, mixHex(base, foreground, 0.28), foreground, Math.max(1.5, lineWidth * 0.5)),
      svgPolygon(step.tread, mixHex(base, paramColor(params, 'background'), index % 2 === 0 ? 0.1 : 0.24), foreground, lineWidth)
    );
  }

  if (paramBoolean(params, 'showTargets')) {
    for (const marker of geometry.markers) {
      parts.push(svgCircle(marker.point[0], marker.point[1], lineWidth * 2.7, marker.color, foreground, Math.max(1.5, lineWidth * 0.3)));
    }
  }

  if (paramBoolean(params, 'showGuide')) {
    parts.push(
      svgPolyline([...geometry.loopPath, geometry.loopPath[0]], mixHex(foreground, paramColor(params, 'background'), 0.42), lineWidth * 0.85, 'stroke-dasharray="18 18"')
    );
    for (const arrow of geometry.arrows) {
      parts.push(svgArrow(arrow.from, arrow.to, arrow.color, lineWidth * 1.2));
    }
  }
  return parts;
}

function endlessStairsGeometry(params: ParamValues, progress: number): {
  steps: Array<{ tread: Point[]; riser: Point[] }>;
  arrows: Array<{ from: Point; to: Point; color: string }>;
  markers: Array<{ point: Point; color: string }>;
  loopPath: Point[];
} {
  const depth = paramNumber(params, 'depth');
  const count = 5;
  const center: Point = [800, 800];
  const rotation = Math.PI / 4 + (paramNumber(params, 'angle') * Math.PI) / 360 + progress * 0.14;
  const outer = 520;
  const inner = 250 + depth * 42;
  const riserDrop = 28 + depth * 34;
  const outerPoints = Array.from({ length: 4 }, (_, index) => point(center[0], center[1], outer, rotation + index * Math.PI / 2));
  const innerPoints = Array.from({ length: 4 }, (_, index) => point(center[0], center[1], inner, rotation + index * Math.PI / 2));
  const steps: Array<{ tread: Point[]; riser: Point[] }> = [];
  const arrows: Array<{ from: Point; to: Point; color: string }> = [];
  const markers: Array<{ point: Point; color: string }> = [];
  const loopPath: Point[] = [];

  for (let side = 0; side < 4; side += 1) {
    const next = (side + 1) % 4;
    const sideStart = midpoint(lerp(outerPoints[side], outerPoints[next], 0.18), lerp(innerPoints[side], innerPoints[next], 0.18));
    const sideEnd = midpoint(lerp(outerPoints[side], outerPoints[next], 0.82), lerp(innerPoints[side], innerPoints[next], 0.82));
    loopPath.push(sideStart, sideEnd);
    arrows.push({ from: sideStart, to: sideEnd, color: side % 2 === 0 ? paramColor(params, 'accentColor') : paramColor(params, 'colorB') });

    for (let index = 0; index < count; index += 1) {
      const t0 = index / count;
      const t1 = (index + 0.82) / count;
      const outerA = lerp(outerPoints[side], outerPoints[next], t0);
      const outerB = lerp(outerPoints[side], outerPoints[next], t1);
      const innerA = lerp(innerPoints[side], innerPoints[next], t0);
      const innerB = lerp(innerPoints[side], innerPoints[next], t1);
      const drop: Point = [0, riserDrop * (0.55 + index / count)];
      steps.push({
        tread: [outerA, outerB, innerB, innerA],
        riser: [outerB, innerB, [innerB[0] + drop[0], innerB[1] + drop[1]], [outerB[0] + drop[0], outerB[1] + drop[1]]]
      });
    }
  }

  const loopPoint = midpoint(outerPoints[0], innerPoints[0]);
  markers.push(
    { point: [loopPoint[0] - 22, loopPoint[1] - 22], color: paramColor(params, 'accentColor') },
    { point: [loopPoint[0] + 22, loopPoint[1] + 22], color: paramColor(params, 'colorB') }
  );

  return { steps, arrows, markers, loopPath };
}

function drawNeckerCube(ctx: CanvasRenderingContext2D, params: ParamValues, progress: number, animatedGuide: boolean): void {
  const phase = Math.sin(progress * Math.PI * 2);
  const w = paramNumber(params, 'lineWidth') * 2;
  const depth = paramNumber(params, 'depth');
  const offset = 140 + depth * 260;
  const size = 560 - Math.min(90, depth * 48);
  const rotation = (paramNumber(params, 'angle') * Math.PI) / 720 + phase * 0.08;
  const front = rectPoints(800 - offset / 2, 800 + offset / 2, size, size, rotation);
  const back = rectPoints(800 + offset / 2, 800 - offset / 2, size, size, rotation);
  const foreground = paramColor(params, 'foreground');
  const face1Color = paramColor(params, 'accentColor');
  const face2Color = paramColor(params, 'colorB');
  drawPolyline(ctx, [...front, front[0]], foreground, w);
  drawPolyline(ctx, [...back, back[0]], foreground, w);
  for (let i = 0; i < 4; i += 1) {
    canvasLine(ctx, front[i][0], front[i][1], back[i][0], back[i][1], foreground, w);
  }

  if (paramBoolean(params, 'showFace1')) {
    drawNeckerTranslucentFaceOverlay(ctx, front, face1Color, w * 0.95);
  }
  if (paramBoolean(params, 'showFace2')) {
    drawNeckerTranslucentFaceOverlay(ctx, back, face2Color, w * 0.95);
  }
  if (paramBoolean(params, 'showGuide')) {
    const guideFace = phase >= 0 ? front : back;
    const guideColor = phase >= 0 ? face1Color : face2Color;
    drawNeckerSolidFaceGuide(ctx, guideFace, guideColor, foreground, w * 1.05);
  }
}

function svgNeckerCube(params: ParamValues, progress: number, animatedGuide: boolean): string[] {
  const phase = Math.sin(progress * Math.PI * 2);
  const w = paramNumber(params, 'lineWidth') * 2;
  const depth = paramNumber(params, 'depth');
  const offset = 140 + depth * 260;
  const size = 560 - Math.min(90, depth * 48);
  const rotation = (paramNumber(params, 'angle') * Math.PI) / 720 + phase * 0.08;
  const front = rectPoints(800 - offset / 2, 800 + offset / 2, size, size, rotation);
  const back = rectPoints(800 + offset / 2, 800 - offset / 2, size, size, rotation);
  const foreground = paramColor(params, 'foreground');
  const face1Color = paramColor(params, 'accentColor');
  const face2Color = paramColor(params, 'colorB');
  const parts: string[] = [];

  parts.push(svgPolyline([...front, front[0]], foreground, w), svgPolyline([...back, back[0]], foreground, w));
  for (let i = 0; i < 4; i += 1) {
    parts.push(svgLine(front[i][0], front[i][1], back[i][0], back[i][1], foreground, w));
  }
  if (paramBoolean(params, 'showFace1')) {
    parts.push(svgNeckerTranslucentFaceOverlay(front, face1Color, w * 0.95, 'data-necker-face="face1"'));
  }
  if (paramBoolean(params, 'showFace2')) {
    parts.push(svgNeckerTranslucentFaceOverlay(back, face2Color, w * 0.95, 'data-necker-face="face2"'));
  }
  if (paramBoolean(params, 'showGuide')) {
    const guideFace = phase >= 0 ? front : back;
    const guideColor = phase >= 0 ? face1Color : face2Color;
    parts.push(
      svgNeckerSolidFaceGuide(guideFace, guideColor, foreground, w * 1.05, phase >= 0 ? 'data-necker-guide-face="face1"' : 'data-necker-guide-face="face2"')
    );
  }
  return parts;
}

function drawNeckerSolidFaceGuide(ctx: CanvasRenderingContext2D, points: readonly Point[], color: string, outline: string, width: number): void {
  ctx.save();
  ctx.globalAlpha = 1;
  canvasPolygon(ctx, points, color);
  drawPolyline(ctx, [...points, points[0]], outline, width);
  ctx.restore();
}

function drawNeckerTranslucentFaceOverlay(ctx: CanvasRenderingContext2D, points: readonly Point[], color: string, width: number): void {
  ctx.save();
  ctx.globalAlpha = 0.26;
  canvasPolygon(ctx, points, color);
  ctx.globalAlpha = 0.78;
  drawPolyline(ctx, [...points, points[0]], color, width);
  ctx.restore();
}

function svgNeckerSolidFaceGuide(points: readonly Point[], color: string, outline: string, width: number, extra = ''): string {
  return [
    svgPolygon(points, color, 'none', 0, extra),
    svgPolyline([...points, points[0]], outline, width, extra)
  ].join('');
}

function svgNeckerTranslucentFaceOverlay(points: readonly Point[], color: string, width: number, extra = ''): string {
  return [
    svgPolygon(points, color, 'none', 0, `${extra} opacity="0.26"`),
    svgPolyline([...points, points[0]], color, width, `${extra} opacity="0.78"`)
  ].join('');
}

function drawNeckerFaceTargets(ctx: CanvasRenderingContext2D, front: readonly Point[], back: readonly Point[], accent: string, alternate: string, params: ParamValues, width: number): void {
  const radius = Math.max(16, width * 1.15);
  drawNeckerFaceTarget(ctx, polygonCenter(front), accent, params, radius);
  drawNeckerFaceTarget(ctx, polygonCenter(back), alternate, params, radius);
}

function drawNeckerFaceTarget(ctx: CanvasRenderingContext2D, center: Point, color: string, params: ParamValues, radius: number): void {
  canvasCircle(ctx, center[0], center[1], radius, paramColor(params, 'background'), color, Math.max(2, radius * 0.22));
  canvasCircle(ctx, center[0], center[1], radius * 0.38, color, paramColor(params, 'foreground'), Math.max(1.5, radius * 0.12));
}

function svgNeckerFaceTargets(front: readonly Point[], back: readonly Point[], accent: string, alternate: string, params: ParamValues, width: number): string[] {
  const radius = Math.max(16, width * 1.15);
  return [
    ...svgNeckerFaceTarget(polygonCenter(front), accent, params, radius),
    ...svgNeckerFaceTarget(polygonCenter(back), alternate, params, radius)
  ];
}

function svgNeckerFaceTarget(center: Point, color: string, params: ParamValues, radius: number): string[] {
  return [
    svgCircle(center[0], center[1], radius, paramColor(params, 'background'), color, Math.max(2, radius * 0.22)),
    svgCircle(center[0], center[1], radius * 0.38, color, paramColor(params, 'foreground'), Math.max(1.5, radius * 0.12))
  ];
}

function drawSchroderStaircase(ctx: CanvasRenderingContext2D, params: ParamValues, progress: number): void {
  const foreground = paramColor(params, 'foreground');
  const colors = faceColors(params);
  const geometry = schroderGeometry(params, progress);
  const lineWidth = paramNumber(params, 'lineWidth');

  if (paramBoolean(params, 'showShadow')) {
    canvasPolygon(ctx, geometry.outline.map(([x, y]) => [x + 34, y + 48] as Point), 'rgba(17, 24, 39, 0.10)');
  }

  for (let i = 0; i < geometry.cells.length; i += 1) {
    const color = mixHex(colors[i % colors.length], paramColor(params, 'background'), i % 2 === 0 ? 0.18 : 0.34);
    canvasPolygon(ctx, geometry.cells[i], color, foreground, lineWidth);
  }

  drawPolyline(ctx, geometry.upper, foreground, lineWidth * 1.4);
  drawPolyline(ctx, geometry.lower, foreground, lineWidth * 1.4);
  for (let i = 0; i < geometry.upper.length; i += 1) {
    canvasLine(ctx, geometry.upper[i][0], geometry.upper[i][1], geometry.lower[i][0], geometry.lower[i][1], foreground, lineWidth * 0.75);
  }

  if (paramBoolean(params, 'showTargets')) {
    canvasCircle(ctx, geometry.upper[0][0], geometry.upper[0][1], lineWidth * 2.4, paramColor(params, 'accentColor'), foreground, Math.max(1.5, lineWidth * 0.25));
    canvasCircle(ctx, geometry.lower.at(-1)![0], geometry.lower.at(-1)![1], lineWidth * 2.4, paramColor(params, 'colorB'), foreground, Math.max(1.5, lineWidth * 0.25));
  }

  if (paramBoolean(params, 'showGuide')) {
    drawDashedPolyline(ctx, geometry.upper, paramColor(params, 'accentColor'), lineWidth * 1.15);
    drawDashedPolyline(ctx, geometry.lower, paramColor(params, 'colorB'), lineWidth * 1.15);
    for (const arrow of schroderReadingArrows(geometry, params)) {
      drawArrow(ctx, arrow.from, arrow.to, arrow.color, lineWidth * 1.15);
    }
  }
}

function svgSchroderStaircase(params: ParamValues, progress: number): string[] {
  const foreground = paramColor(params, 'foreground');
  const colors = faceColors(params);
  const geometry = schroderGeometry(params, progress);
  const lineWidth = paramNumber(params, 'lineWidth');
  const parts: string[] = [];

  if (paramBoolean(params, 'showShadow')) {
    parts.push(svgPolygon(geometry.outline.map(([x, y]) => [x + 34, y + 48] as Point), 'rgba(17, 24, 39, 0.10)'));
  }

  for (let i = 0; i < geometry.cells.length; i += 1) {
    parts.push(svgPolygon(geometry.cells[i], mixHex(colors[i % colors.length], paramColor(params, 'background'), i % 2 === 0 ? 0.18 : 0.34), foreground, lineWidth));
  }

  parts.push(svgPolyline(geometry.upper, foreground, lineWidth * 1.4), svgPolyline(geometry.lower, foreground, lineWidth * 1.4));
  for (let i = 0; i < geometry.upper.length; i += 1) {
    parts.push(svgLine(geometry.upper[i][0], geometry.upper[i][1], geometry.lower[i][0], geometry.lower[i][1], foreground, lineWidth * 0.75));
  }

  if (paramBoolean(params, 'showTargets')) {
    parts.push(
      svgCircle(geometry.upper[0][0], geometry.upper[0][1], lineWidth * 2.4, paramColor(params, 'accentColor'), foreground, Math.max(1.5, lineWidth * 0.25)),
      svgCircle(geometry.lower.at(-1)![0], geometry.lower.at(-1)![1], lineWidth * 2.4, paramColor(params, 'colorB'), foreground, Math.max(1.5, lineWidth * 0.25))
    );
  }

  if (paramBoolean(params, 'showGuide')) {
    parts.push(
      svgPolyline(geometry.upper, paramColor(params, 'accentColor'), lineWidth * 1.15, 'stroke-dasharray="18 18"'),
      svgPolyline(geometry.lower, paramColor(params, 'colorB'), lineWidth * 1.15, 'stroke-dasharray="18 18"')
    );
    for (const arrow of schroderReadingArrows(geometry, params)) {
      parts.push(svgArrow(arrow.from, arrow.to, arrow.color, lineWidth * 1.15));
    }
  }
  return parts;
}

function schroderReadingArrows(
  geometry: ReturnType<typeof schroderGeometry>,
  params: ParamValues
): Array<{ from: Point; to: Point; color: string }> {
  return [
    {
      from: midpoint(geometry.upper[1], geometry.upper[2]),
      to: midpoint(geometry.upper[3], geometry.upper[4]),
      color: paramColor(params, 'accentColor')
    },
    {
      from: midpoint(geometry.lower.at(-2)!, geometry.lower.at(-3)!),
      to: midpoint(geometry.lower.at(-4)!, geometry.lower.at(-5)!),
      color: paramColor(params, 'colorB')
    }
  ];
}

function schroderGeometry(params: ParamValues, progress: number): { upper: Point[]; lower: Point[]; outline: Point[]; cells: Point[][] } {
  const depth = paramNumber(params, 'depth');
  const count = 5;
  const run = 126 + depth * 48;
  const rise = 62 + depth * 38;
  const diagonal = 56 + depth * 34;
  const drop = rise;
  const thickness = 180 + depth * 86;
  const wobble = Math.sin(progress * Math.PI * 2) * 0.04;
  const rotation = (paramNumber(params, 'angle') * Math.PI) / 360 + wobble;
  const upper: Point[] = [[315, 850]];

  for (let index = 0; index < count; index += 1) {
    const last = upper.at(-1)!;
    const landing: Point = [last[0] + run, last[1] - rise];
    const riser: Point = [landing[0] + diagonal, landing[1] + drop];
    upper.push(landing, riser);
  }

  const lower = upper.map(([x, y]) => [x, y + thickness] as Point);
  const rotatedUpper = rotatePoints(upper, [800, 800], rotation);
  const rotatedLower = rotatePoints(lower, [800, 800], rotation);
  const cells: Point[][] = [];

  for (let index = 0; index < rotatedUpper.length - 1; index += 1) {
    cells.push([rotatedUpper[index], rotatedUpper[index + 1], rotatedLower[index + 1], rotatedLower[index]]);
  }

  return {
    upper: rotatedUpper,
    lower: rotatedLower,
    outline: [...rotatedUpper, ...rotatedLower.slice().reverse()],
    cells
  };
}

function rotatePoints(points: readonly Point[], center: Point, angle: number): Point[] {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return points.map(([x, y]) => {
    const dx = x - center[0];
    const dy = y - center[1];
    return [center[0] + dx * cos - dy * sin, center[1] + dx * sin + dy * cos] as Point;
  });
}

function drawShepardTables(ctx: CanvasRenderingContext2D, params: ParamValues): void {
  drawTable(ctx, 555, 790, -24 + paramNumber(params, 'angle') * 0.2, paramColor(params, 'accentColor'), params);
  drawTable(ctx, 1040, 790, 24 + paramNumber(params, 'angle') * 0.2, paramColor(params, 'colorB'), params);
  if (paramBoolean(params, 'showGuide')) {
    drawShepardTableGuides(ctx, params);
  }
}

function svgShepardTables(params: ParamValues): string[] {
  return [
    ...svgTable(555, 790, -24 + paramNumber(params, 'angle') * 0.2, paramColor(params, 'accentColor'), params),
    ...svgTable(1040, 790, 24 + paramNumber(params, 'angle') * 0.2, paramColor(params, 'colorB'), params),
    ...(paramBoolean(params, 'showGuide') ? svgShepardTableGuides(params) : [])
  ];
}

function drawAmesWindow(ctx: CanvasRenderingContext2D, params: ParamValues, progress: number): void {
  const geometry = amesWindowGeometry(params, progress);
  const foreground = paramColor(params, 'foreground');
  const accent = paramColor(params, 'accentColor');
  const b = paramColor(params, 'colorB');
  const bg = paramColor(params, 'background');
  const lineWidth = paramNumber(params, 'lineWidth');

  if (paramBoolean(params, 'showGuide')) {
    drawAmesWindowGuide(ctx, geometry, params);
  }

  if (paramBoolean(params, 'showShadow')) {
    canvasPolygon(ctx, geometry.outer.map(([x, y]) => [x + 38, y + 54] as Point), 'rgba(17, 24, 39, 0.13)');
  }

  canvasPolygon(ctx, geometry.outer, mixHex(bg, b, 0.13 + geometry.edgeDepth * 0.11), foreground, lineWidth * 1.35);
  canvasLine(ctx, geometry.outer[0][0], geometry.outer[0][1], geometry.outer[3][0], geometry.outer[3][1], accent, lineWidth * 1.9);
  canvasLine(ctx, geometry.outer[1][0], geometry.outer[1][1], geometry.outer[2][0], geometry.outer[2][1], b, lineWidth * 1.9);
  canvasLine(ctx, geometry.vertical[0][0], geometry.vertical[0][1], geometry.vertical[1][0], geometry.vertical[1][1], foreground, lineWidth);
  canvasLine(ctx, geometry.horizontal[0][0], geometry.horizontal[0][1], geometry.horizontal[1][0], geometry.horizontal[1][1], foreground, lineWidth);
  canvasLine(ctx, geometry.diagonal[0][0], geometry.diagonal[0][1], geometry.diagonal[1][0], geometry.diagonal[1][1], mixHex(foreground, bg, 0.18), lineWidth * 0.65);

  if (paramBoolean(params, 'showTargets')) {
    canvasCircle(ctx, geometry.leftMarker[0], geometry.leftMarker[1], lineWidth * 2.6, accent, foreground, Math.max(2, lineWidth * 0.45));
    canvasCircle(ctx, geometry.rightMarker[0], geometry.rightMarker[1], lineWidth * 2.2, b, foreground, Math.max(2, lineWidth * 0.45));
  }
}

function svgAmesWindow(params: ParamValues, progress: number): string[] {
  const geometry = amesWindowGeometry(params, progress);
  const foreground = paramColor(params, 'foreground');
  const accent = paramColor(params, 'accentColor');
  const b = paramColor(params, 'colorB');
  const bg = paramColor(params, 'background');
  const lineWidth = paramNumber(params, 'lineWidth');
  const parts = paramBoolean(params, 'showGuide') ? svgAmesWindowGuide(geometry, params) : [];

  if (paramBoolean(params, 'showShadow')) {
    parts.push(svgPolygon(geometry.outer.map(([x, y]) => [x + 38, y + 54] as Point), 'rgba(17, 24, 39, 0.13)'));
  }

  parts.push(
    svgPolygon(geometry.outer, mixHex(bg, b, 0.13 + geometry.edgeDepth * 0.11), foreground, lineWidth * 1.35),
    svgLine(geometry.outer[0][0], geometry.outer[0][1], geometry.outer[3][0], geometry.outer[3][1], accent, lineWidth * 1.9),
    svgLine(geometry.outer[1][0], geometry.outer[1][1], geometry.outer[2][0], geometry.outer[2][1], b, lineWidth * 1.9),
    svgLine(geometry.vertical[0][0], geometry.vertical[0][1], geometry.vertical[1][0], geometry.vertical[1][1], foreground, lineWidth),
    svgLine(geometry.horizontal[0][0], geometry.horizontal[0][1], geometry.horizontal[1][0], geometry.horizontal[1][1], foreground, lineWidth),
    svgLine(geometry.diagonal[0][0], geometry.diagonal[0][1], geometry.diagonal[1][0], geometry.diagonal[1][1], mixHex(foreground, bg, 0.18), lineWidth * 0.65)
  );

  if (paramBoolean(params, 'showTargets')) {
    parts.push(
      svgCircle(geometry.leftMarker[0], geometry.leftMarker[1], lineWidth * 2.6, accent, foreground, Math.max(2, lineWidth * 0.45)),
      svgCircle(geometry.rightMarker[0], geometry.rightMarker[1], lineWidth * 2.2, b, foreground, Math.max(2, lineWidth * 0.45))
    );
  }

  return parts;
}

function amesWindowGeometry(params: ParamValues, progress: number): {
  outer: Point[];
  vertical: [Point, Point];
  horizontal: [Point, Point];
  diagonal: [Point, Point];
  leftMarker: Point;
  rightMarker: Point;
  center: Point;
  phasePoint: Point;
  edgeDepth: number;
} {
  const phase = progress * Math.PI * 2 + (paramNumber(params, 'angle') * Math.PI) / 180;
  const depth = paramNumber(params, 'depth');
  const camera = 1680;
  const zStrength = 0.8 + depth * 0.34;
  const cos = Math.cos(phase);
  const sin = Math.sin(phase);

  const project = ([x, y]: Point): Point => {
    const rotatedX = x * cos;
    const rotatedZ = -x * sin * zStrength;
    const scale = camera / (camera + rotatedZ);
    return [800 + rotatedX * scale, 800 + y * scale];
  };

  const yOnTop = (x: number) => -420 + ((x + 380) / 740) * 140;
  const yOnBottom = (x: number) => 420 - ((x + 380) / 740) * 140;
  const dividerX = -80;
  const outer = [
    project([-380, -420]),
    project([360, -280]),
    project([360, 280]),
    project([-380, 420])
  ];

  return {
    outer,
    vertical: [project([dividerX, yOnTop(dividerX)]), project([dividerX, yOnBottom(dividerX)])],
    horizontal: [project([-344, 0]), project([328, 0])],
    diagonal: [project([-320, 285]), project([315, -210])],
    leftMarker: project([-300, -272]),
    rightMarker: project([278, 195]),
    center: project([0, 0]),
    phasePoint: [800 + Math.sin(phase) * 360, 1318 - Math.cos(phase) * 74],
    edgeDepth: Math.abs(sin)
  };
}

function drawAmesWindowGuide(ctx: CanvasRenderingContext2D, geometry: ReturnType<typeof amesWindowGeometry>, params: ParamValues): void {
  const foreground = mixHex(paramColor(params, 'foreground'), paramColor(params, 'background'), 0.46);
  const accent = paramColor(params, 'accentColor');
  const b = paramColor(params, 'colorB');
  const width = Math.max(2, paramNumber(params, 'lineWidth') * 0.55);
  const leftLimit: Point = [440, 1318];
  const rightLimit: Point = [1160, 1318];

  ctx.save();
  ctx.setLineDash([18, 18]);
  canvasLine(ctx, 800, 230, 800, 1370, foreground, width);
  canvasLine(ctx, leftLimit[0], leftLimit[1], rightLimit[0], rightLimit[1], foreground, width * 0.72);
  ctx.beginPath();
  ctx.ellipse(800, 1318, 360, 74, 0, 0, Math.PI * 2);
  ctx.strokeStyle = foreground;
  ctx.lineWidth = width;
  ctx.stroke();
  ctx.restore();

  canvasCircle(ctx, leftLimit[0], leftLimit[1], width * 1.95, accent, paramColor(params, 'foreground'), Math.max(1.5, width * 0.32));
  canvasCircle(ctx, rightLimit[0], rightLimit[1], width * 1.95, b, paramColor(params, 'foreground'), Math.max(1.5, width * 0.32));
  canvasLine(ctx, geometry.center[0], geometry.center[1], geometry.phasePoint[0], geometry.phasePoint[1], accent, width);
  canvasCircle(ctx, geometry.phasePoint[0], geometry.phasePoint[1], width * 2.2, accent, paramColor(params, 'foreground'), Math.max(1.5, width * 0.35));
}

function svgAmesWindowGuide(geometry: ReturnType<typeof amesWindowGeometry>, params: ParamValues): string[] {
  const foreground = mixHex(paramColor(params, 'foreground'), paramColor(params, 'background'), 0.46);
  const accent = paramColor(params, 'accentColor');
  const b = paramColor(params, 'colorB');
  const width = Math.max(2, paramNumber(params, 'lineWidth') * 0.55);
  const leftLimit: Point = [440, 1318];
  const rightLimit: Point = [1160, 1318];

  return [
    svgLine(800, 230, 800, 1370, foreground, width, 'stroke-dasharray="18 18"'),
    svgLine(leftLimit[0], leftLimit[1], rightLimit[0], rightLimit[1], foreground, width * 0.72, 'stroke-dasharray="18 18"'),
    `<ellipse cx="800" cy="1318" rx="360" ry="74" fill="none" stroke="${foreground}" stroke-width="${n(width)}" stroke-dasharray="18 18" />`,
    svgCircle(leftLimit[0], leftLimit[1], width * 1.95, accent, paramColor(params, 'foreground'), Math.max(1.5, width * 0.32)),
    svgCircle(rightLimit[0], rightLimit[1], width * 1.95, b, paramColor(params, 'foreground'), Math.max(1.5, width * 0.32)),
    svgLine(geometry.center[0], geometry.center[1], geometry.phasePoint[0], geometry.phasePoint[1], accent, width),
    svgCircle(geometry.phasePoint[0], geometry.phasePoint[1], width * 2.2, accent, paramColor(params, 'foreground'), Math.max(1.5, width * 0.35))
  ];
}

function drawTable(ctx: CanvasRenderingContext2D, cx: number, cy: number, angle: number, color: string, params: ParamValues): void {
  const a = (angle * Math.PI) / 180;
  const w = 430;
  const h = 250;
  const top = rectPoints(cx, cy, w, h, a);
  if (paramBoolean(params, 'showShadow')) {
    canvasPolygon(ctx, top.map(([x, y]) => [x + 30, y + 180] as Point), 'rgba(17, 24, 39, 0.10)');
  }
  canvasPolygon(ctx, top, color, paramColor(params, 'foreground'), paramNumber(params, 'lineWidth'));
  for (const p of top) {
    canvasLine(ctx, p[0], p[1], p[0] + 24, p[1] + 220, paramColor(params, 'foreground'), paramNumber(params, 'lineWidth'));
  }
}

function svgTable(cx: number, cy: number, angle: number, color: string, params: ParamValues): string[] {
  const a = (angle * Math.PI) / 180;
  const top = rectPoints(cx, cy, 430, 250, a);
  const parts: string[] = [];
  if (paramBoolean(params, 'showShadow')) {
    parts.push(svgPolygon(top.map(([x, y]) => [x + 30, y + 180] as Point), 'rgba(17, 24, 39, 0.10)'));
  }
  parts.push(svgPolygon(top, color, paramColor(params, 'foreground'), paramNumber(params, 'lineWidth')));
  for (const p of top) {
    parts.push(svgLine(p[0], p[1], p[0] + 24, p[1] + 220, paramColor(params, 'foreground'), paramNumber(params, 'lineWidth')));
  }
  return parts;
}

function drawShepardTableGuides(ctx: CanvasRenderingContext2D, params: ParamValues): void {
  const foreground = paramColor(params, 'foreground');
  const accent = paramColor(params, 'accentColor');
  const alternate = paramColor(params, 'colorB');
  const width = Math.max(2, paramNumber(params, 'lineWidth') * 0.72);
  const guideY = 1310;
  const guideW = 300;
  const guideH = 174;
  const left = rectPoints(590, guideY, guideW, guideH, 0);
  const right = rectPoints(1010, guideY, guideW, guideH, 0);
  const tickWidth = Math.max(2, width * 0.65);

  canvasPolygon(ctx, left, 'rgba(255, 255, 255, 0)', accent, width);
  canvasPolygon(ctx, right, 'rgba(255, 255, 255, 0)', alternate, width);
  drawShepardFlatShapeGuide(ctx, left, accent, foreground, tickWidth);
  drawShepardFlatShapeGuide(ctx, right, alternate, foreground, tickWidth);
}

function svgShepardTableGuides(params: ParamValues): string[] {
  const foreground = paramColor(params, 'foreground');
  const accent = paramColor(params, 'accentColor');
  const alternate = paramColor(params, 'colorB');
  const width = Math.max(2, paramNumber(params, 'lineWidth') * 0.72);
  const guideY = 1310;
  const guideW = 300;
  const guideH = 174;
  const left = rectPoints(590, guideY, guideW, guideH, 0);
  const right = rectPoints(1010, guideY, guideW, guideH, 0);
  const tickWidth = Math.max(2, width * 0.65);

  return [
    svgPolygon(left, 'none', accent, width),
    svgPolygon(right, 'none', alternate, width),
    ...svgShepardFlatShapeGuide(left, accent, foreground, tickWidth),
    ...svgShepardFlatShapeGuide(right, alternate, foreground, tickWidth)
  ];
}

function drawShepardFlatShapeGuide(
  ctx: CanvasRenderingContext2D,
  points: readonly Point[],
  color: string,
  foreground: string,
  width: number
): void {
  const rightX = points[1][0] + 36;
  canvasLine(ctx, points[0][0], points[0][1] - 42, points[1][0], points[1][1] - 42, foreground, width);
  canvasLine(ctx, points[0][0], points[0][1] - 60, points[0][0], points[0][1] - 24, foreground, width);
  canvasLine(ctx, points[1][0], points[1][1] - 60, points[1][0], points[1][1] - 24, foreground, width);
  canvasLine(ctx, rightX, points[1][1], rightX, points[2][1], foreground, width);
  canvasLine(ctx, rightX - 18, points[1][1], rightX + 18, points[1][1], foreground, width);
  canvasLine(ctx, rightX - 18, points[2][1], rightX + 18, points[2][1], foreground, width);
  canvasLine(ctx, points[0][0], points[0][1], points[2][0], points[2][1], color, width * 0.82);
  canvasLine(ctx, points[1][0], points[1][1], points[3][0], points[3][1], color, width * 0.82);
}

function svgShepardFlatShapeGuide(points: readonly Point[], color: string, foreground: string, width: number): string[] {
  const rightX = points[1][0] + 36;
  return [
    svgLine(points[0][0], points[0][1] - 42, points[1][0], points[1][1] - 42, foreground, width),
    svgLine(points[0][0], points[0][1] - 60, points[0][0], points[0][1] - 24, foreground, width),
    svgLine(points[1][0], points[1][1] - 60, points[1][0], points[1][1] - 24, foreground, width),
    svgLine(rightX, points[1][1], rightX, points[2][1], foreground, width),
    svgLine(rightX - 18, points[1][1], rightX + 18, points[1][1], foreground, width),
    svgLine(rightX - 18, points[2][1], rightX + 18, points[2][1], foreground, width),
    svgLine(points[0][0], points[0][1], points[2][0], points[2][1], color, width * 0.82),
    svgLine(points[1][0], points[1][1], points[3][0], points[3][1], color, width * 0.82)
  ];
}

function drawCenterGuides(ctx: CanvasRenderingContext2D, params: ParamValues): void {
  const guide = mixHex(paramColor(params, 'foreground'), paramColor(params, 'background'), 0.55);
  ctx.save();
  ctx.setLineDash([24, 24]);
  canvasLine(ctx, 800, 140, 800, 1460, guide, 4);
  canvasLine(ctx, 140, 800, 1460, 800, guide, 4);
  ctx.restore();
}

function svgCenterGuides(params: ParamValues): string[] {
  const guide = mixHex(paramColor(params, 'foreground'), paramColor(params, 'background'), 0.55);
  return [
    svgLine(800, 140, 800, 1460, guide, 4, 'stroke-dasharray="24 24"'),
    svgLine(140, 800, 1460, 800, guide, 4, 'stroke-dasharray="24 24"')
  ];
}

function drawGuideArrow(ctx: CanvasRenderingContext2D, start: Point, end: Point, color: string, width: number): void {
  ctx.save();
  ctx.setLineDash([26, 18]);
  canvasLine(ctx, start[0], start[1], end[0], end[1], color, width);
  ctx.restore();
  canvasPolygon(ctx, arrowHead(start, end, Math.max(30, width * 4.4), Math.max(18, width * 2.7)), color);
}

function svgGuideArrow(start: Point, end: Point, color: string, width: number): string[] {
  return [
    svgLine(start[0], start[1], end[0], end[1], color, width, 'stroke-dasharray="26 18"'),
    svgPolygon(arrowHead(start, end, Math.max(30, width * 4.4), Math.max(18, width * 2.7)), color)
  ];
}

function arrowHead(start: Point, end: Point, length: number, halfWidth: number): [Point, Point, Point] {
  const dx = end[0] - start[0];
  const dy = end[1] - start[1];
  const lineLength = Math.hypot(dx, dy) || 1;
  const ux = dx / lineLength;
  const uy = dy / lineLength;
  const base: Point = [end[0] - ux * length, end[1] - uy * length];
  const px = -uy;
  const py = ux;
  return [
    end,
    [base[0] + px * halfWidth, base[1] + py * halfWidth],
    [base[0] - px * halfWidth, base[1] - py * halfWidth]
  ];
}

function faceColors(params: ParamValues): [string, string, string] {
  return [
    paramColor(params, 'accentColor'),
    mixHex(paramColor(params, 'accentColor'), paramColor(params, 'colorB'), 0.45),
    mixHex(paramColor(params, 'colorB'), paramColor(params, 'background'), 0.2)
  ];
}

function point(cx: number, cy: number, radius: number, angle: number): Point {
  return [cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius];
}

function inset(a: Point, b: Point, distance: number): Point {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const length = Math.hypot(dx, dy) || 1;
  return [a[0] + (dx / length) * distance, a[1] + (dy / length) * distance];
}

function lerp(a: Point, b: Point, t: number): Point {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
}

function midpoint(a: Point, b: Point): Point {
  return [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
}

function polygonCenter(points: readonly Point[]): Point {
  const total = points.reduce<Point>((sum, point) => [sum[0] + point[0], sum[1] + point[1]], [0, 0]);
  return [total[0] / points.length, total[1] / points.length];
}

function rectPoints(cx: number, cy: number, width: number, height: number, angle: number): Point[] {
  const hw = width / 2;
  const hh = height / 2;
  return [[-hw, -hh], [hw, -hh], [hw, hh], [-hw, hh]].map(([x, y]) => {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return [cx + x * cos - y * sin, cy + x * sin + y * cos] as Point;
  });
}

function drawPolyline(ctx: CanvasRenderingContext2D, points: readonly Point[], color: string, width: number): void {
  if (points.length < 2) {
    return;
  }
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  for (const point of points.slice(1)) {
    ctx.lineTo(point[0], point[1]);
  }
  ctx.stroke();
}

function drawDashedPolyline(ctx: CanvasRenderingContext2D, points: readonly Point[], color: string, width: number): void {
  ctx.save();
  ctx.setLineDash([18, 18]);
  drawPolyline(ctx, points, color, width);
  ctx.restore();
}

function drawArrow(ctx: CanvasRenderingContext2D, from: Point, to: Point, color: string, width: number): void {
  canvasLine(ctx, from[0], from[1], to[0], to[1], color, width);
  const angle = Math.atan2(to[1] - from[1], to[0] - from[0]);
  const size = Math.max(18, width * 4);
  const left = [to[0] - Math.cos(angle - Math.PI / 6) * size, to[1] - Math.sin(angle - Math.PI / 6) * size] as Point;
  const right = [to[0] - Math.cos(angle + Math.PI / 6) * size, to[1] - Math.sin(angle + Math.PI / 6) * size] as Point;
  canvasPolygon(ctx, [to, left, right], color);
}

function svgArrow(from: Point, to: Point, color: string, width: number): string {
  const angle = Math.atan2(to[1] - from[1], to[0] - from[0]);
  const size = Math.max(18, width * 4);
  const left = [to[0] - Math.cos(angle - Math.PI / 6) * size, to[1] - Math.sin(angle - Math.PI / 6) * size] as Point;
  const right = [to[0] - Math.cos(angle + Math.PI / 6) * size, to[1] - Math.sin(angle + Math.PI / 6) * size] as Point;
  return [svgLine(from[0], from[1], to[0], to[1], color, width), svgPolygon([to, left, right], color)].join('');
}

function svgPolyline(points: readonly Point[], color: string, width: number, extra = ''): string {
  const d = points.map(([x, y], index) => `${index === 0 ? 'M' : 'L'} ${n(x)} ${n(y)}`).join(' ');
  return svgPath(d, color, width, 'none', extra);
}
