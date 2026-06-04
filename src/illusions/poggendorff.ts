import { colorParam, defaults, rangeParam, toggleParam } from './common';
import { canvasLine, renderScaled } from './v02Helpers';
import { svgDocument, svgLine, svgRect } from '../svg';
import { EXPORT_SIZE, paramBoolean, paramColor, paramNumber, type IllusionDefinition, type ParamValues } from '../types';

const schema = [
  rangeParam('angle', 'param.angle', 8, 64, 1, 31, '°'),
  rangeParam('gap', 'param.gap', 80, 540, 10, 280, 'px'),
  rangeParam('lineWidth', 'param.lineWidth', 4, 48, 1, 18, 'px'),
  rangeParam('contrast', 'param.contrast', 0.15, 1, 0.01, 0.82),
  toggleParam('showGuide', 'param.showGuide', false),
  toggleParam('showOccluder', 'param.showOccluder', true),
  colorParam('background', 'param.background', '#f8fafc'),
  colorParam('foreground', 'param.foreground', '#111827'),
  colorParam('accentColor', 'param.accentColor', '#e2e8f0')
] as const;

export const poggendorff: IllusionDefinition = {
  id: 'poggendorff',
  version: 1,
  titleKey: 'illusion.poggendorff.title',
  descriptionKey: 'illusion.poggendorff.description',
  supportsAnimation: false,
  defaultParams: defaults(schema),
  paramSchema: schema,
  randomize: (rng) => ({
    angle: rng.int(22, 42),
    gap: rng.int(220, 380),
    lineWidth: rng.int(12, 28),
    contrast: rng.float(0.55, 0.95, 2),
    showGuide: rng.next() > 0.72,
    showOccluder: true,
    background: rng.pick(['#f8fafc', '#fff7ed', '#f1f5f9']),
    foreground: rng.pick(['#111827', '#172554', '#3f1d1d']),
    accentColor: rng.pick(['#e2e8f0', '#fde68a', '#dbeafe'])
  }),
  renderCanvas: (ctx, params) => {
    renderScaled(ctx, paramColor(params, 'background'), (scaled) => {
      const geometry = getGeometry(params);
      scaled.globalAlpha = paramNumber(params, 'contrast');
      canvasLine(scaled, geometry.leftStart[0], geometry.leftStart[1], geometry.leftEnd[0], geometry.leftEnd[1], paramColor(params, 'foreground'), paramNumber(params, 'lineWidth'));
      canvasLine(scaled, geometry.rightStart[0], geometry.rightStart[1], geometry.rightEnd[0], geometry.rightEnd[1], paramColor(params, 'foreground'), paramNumber(params, 'lineWidth'));
      scaled.globalAlpha = 1;
      if (paramBoolean(params, 'showOccluder')) {
        scaled.fillStyle = paramColor(params, 'accentColor');
        scaled.fillRect(geometry.bandX, 170, geometry.bandWidth, 1260);
        canvasLine(scaled, geometry.bandX, 170, geometry.bandX, 1430, paramColor(params, 'foreground'), Math.max(3, paramNumber(params, 'lineWidth') * 0.35));
        canvasLine(scaled, geometry.bandX + geometry.bandWidth, 170, geometry.bandX + geometry.bandWidth, 1430, paramColor(params, 'foreground'), Math.max(3, paramNumber(params, 'lineWidth') * 0.35));
      }
      if (paramBoolean(params, 'showGuide')) {
        scaled.save();
        scaled.setLineDash([22, 24]);
        canvasLine(scaled, geometry.leftEnd[0], geometry.leftEnd[1], geometry.rightStart[0], geometry.rightStart[1], geometry.guideColor, Math.max(4, paramNumber(params, 'lineWidth') * 0.7));
        scaled.restore();
      }
    });
  },
  renderSvg: (params) => {
    const geometry = getGeometry(params);
    const parts = [
      `<g opacity="${paramNumber(params, 'contrast')}">`,
      svgLine(geometry.leftStart[0], geometry.leftStart[1], geometry.leftEnd[0], geometry.leftEnd[1], paramColor(params, 'foreground'), paramNumber(params, 'lineWidth')),
      svgLine(geometry.rightStart[0], geometry.rightStart[1], geometry.rightEnd[0], geometry.rightEnd[1], paramColor(params, 'foreground'), paramNumber(params, 'lineWidth')),
      '</g>',
      paramBoolean(params, 'showOccluder') ? svgRect(geometry.bandX, 170, geometry.bandWidth, 1260, paramColor(params, 'accentColor')) : '',
      paramBoolean(params, 'showOccluder') ? svgLine(geometry.bandX, 170, geometry.bandX, 1430, paramColor(params, 'foreground'), Math.max(3, paramNumber(params, 'lineWidth') * 0.35)) : '',
      paramBoolean(params, 'showOccluder') ? svgLine(geometry.bandX + geometry.bandWidth, 170, geometry.bandX + geometry.bandWidth, 1430, paramColor(params, 'foreground'), Math.max(3, paramNumber(params, 'lineWidth') * 0.35)) : '',
      paramBoolean(params, 'showGuide') ? svgLine(geometry.leftEnd[0], geometry.leftEnd[1], geometry.rightStart[0], geometry.rightStart[1], geometry.guideColor, Math.max(4, paramNumber(params, 'lineWidth') * 0.7), 'stroke-dasharray="22 24" opacity="0.95"') : ''
    ];
    return svgDocument(parts.join(''), paramColor(params, 'background'));
  }
};

function getGeometry(params: ParamValues) {
  const bandWidth = Number(params.gap);
  const bandX = EXPORT_SIZE / 2 - bandWidth / 2;
  const slope = Math.tan((Number(params.angle) * Math.PI) / 180);
  const yAt = (x: number) => EXPORT_SIZE / 2 - (x - EXPORT_SIZE / 2) * slope;

  return {
    bandX,
    bandWidth,
    guideColor: paramBoolean(params, 'showOccluder') ? paramColor(params, 'foreground') : paramColor(params, 'accentColor'),
    leftStart: [130, yAt(130)] as const,
    leftEnd: [bandX, yAt(bandX)] as const,
    rightStart: [bandX + bandWidth, yAt(bandX + bandWidth)] as const,
    rightEnd: [1470, yAt(1470)] as const
  };
}
