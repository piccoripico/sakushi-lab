import { colorParam, defaults, rangeParam, toggleParam } from './common';
import { canvasCircle, canvasLine, canvasPolygon, point, renderScaled, svgPolygon } from './v02Helpers';
import { svgCircle, svgDocument, svgLine, svgPath } from '../svg';
import { EXPORT_SIZE, paramBoolean, paramColor, paramNumber, type IllusionDefinition } from '../types';

const schema = [
  rangeParam('dotRadius', 'param.dotRadius', 110, 260, 5, 185, 'px'),
  rangeParam('gap', 'param.gap', 50, 140, 1, 82, '°'),
  rangeParam('lineWidth', 'param.lineWidth', 2, 16, 1, 6, 'px'),
  toggleParam('showGuide', 'param.showGuide', false),
  colorParam('background', 'param.background', '#f8fafc'),
  colorParam('foreground', 'param.foreground', '#111827'),
  colorParam('accentColor', 'param.accentColor', '#0f766e')
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
    dotRadius: rng.int(140, 230),
    gap: rng.int(64, 112),
    lineWidth: rng.int(4, 12),
    showGuide: rng.next() > 0.75,
    background: rng.pick(['#f8fafc', '#fff7ed', '#eef2ff']),
    foreground: rng.pick(['#111827', '#172554', '#3f1d1d']),
    accentColor: rng.pick(['#0f766e', '#3159b7', '#b45309'])
  }),
  renderCanvas: (ctx, params) => {
    renderScaled(ctx, paramColor(params, 'background'), (scaled) => {
      for (const disk of disks(params)) {
        drawPacman(scaled, params, disk[0], disk[1], disk[2]);
      }
      const triangle: [number, number][] = [[800, 390], [420, 1050], [1180, 1050]];
      if (paramBoolean(params, 'showGuide')) {
        canvasPolygon(scaled, triangle, 'rgba(15, 118, 110, 0.08)', paramColor(params, 'accentColor'), paramNumber(params, 'lineWidth'));
      }
      canvasLine(scaled, 555, 1110, 1045, 1110, paramColor(params, 'foreground'), paramNumber(params, 'lineWidth'));
      canvasLine(scaled, 680, 865, 440, 450, paramColor(params, 'foreground'), paramNumber(params, 'lineWidth'));
      canvasLine(scaled, 920, 865, 1160, 450, paramColor(params, 'foreground'), paramNumber(params, 'lineWidth'));
    });
  },
  renderSvg: (params) => {
    const parts = disks(params).map(([cx, cy, angle]) => svgPacman(params, cx, cy, angle));
    if (paramBoolean(params, 'showGuide')) {
      parts.push(svgPolygon([[800, 390], [420, 1050], [1180, 1050]], 'rgba(15, 118, 110, 0.08)', paramColor(params, 'accentColor'), paramNumber(params, 'lineWidth')));
    }
    parts.push(
      svgLine(555, 1110, 1045, 1110, paramColor(params, 'foreground'), paramNumber(params, 'lineWidth')),
      svgLine(680, 865, 440, 450, paramColor(params, 'foreground'), paramNumber(params, 'lineWidth')),
      svgLine(920, 865, 1160, 450, paramColor(params, 'foreground'), paramNumber(params, 'lineWidth'))
    );
    return svgDocument(parts.join(''), paramColor(params, 'background'));
  }
};

function disks(_params: Record<string, unknown>): [number, number, number][] {
  return [
    [800, 335, Math.PI / 2],
    [335, 1130, -Math.PI / 6],
    [1265, 1130, Math.PI + Math.PI / 6]
  ];
}

function drawPacman(ctx: CanvasRenderingContext2D, params: Record<string, unknown>, cx: number, cy: number, angle: number): void {
  const radius = Number(params.dotRadius);
  const gap = (Number(params.gap) * Math.PI) / 180;
  canvasCircle(ctx, cx, cy, radius, String(params.foreground));
  const p1 = point(cx, cy, radius * 1.05, angle - gap / 2);
  const p2 = point(cx, cy, radius * 1.05, angle + gap / 2);
  canvasPolygon(ctx, [[cx, cy], p1, p2], String(params.background));
}

function svgPacman(params: Record<string, unknown>, cx: number, cy: number, angle: number): string {
  const radius = Number(params.dotRadius);
  const gap = (Number(params.gap) * Math.PI) / 180;
  const p1 = point(cx, cy, radius * 1.05, angle - gap / 2);
  const p2 = point(cx, cy, radius * 1.05, angle + gap / 2);
  const wedge = `M ${cx} ${cy} L ${p1[0]} ${p1[1]} A ${radius * 1.05} ${radius * 1.05} 0 0 1 ${p2[0]} ${p2[1]} Z`;
  return `${svgCircle(cx, cy, radius, String(params.foreground))}${svgPath(wedge, 'none', 0, String(params.background))}`;
}
