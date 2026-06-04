import { colorParam, defaults, rangeParam, toggleParam } from './common';
import { drawGuideSegments, sameColorDiagonalSegments, svgGuideSegments } from './guideHelpers';
import { canvasCircle, renderScaled } from './v02Helpers';
import { svgCircle, svgDocument, svgRect } from '../svg';
import { EXPORT_SIZE, paramBoolean, paramColor, paramNumber, type IllusionDefinition } from '../types';

const schema = [
  rangeParam('centerRadius', 'param.centerRadius', 50, 300, 5, 155, 'px'),
  rangeParam('contrast', 'param.contrast', 0, 1, 0.01, 0.55),
  toggleParam('showGuide', 'param.showGuide', false),
  colorParam('background', 'param.background', '#f8fafc'),
  colorParam('colorA', 'param.colorA', '#1f2937'),
  colorParam('colorB', 'param.colorB', '#e5e7eb'),
  colorParam('centralColor', 'param.centralColor', '#9ca3af')
] as const;

export const simultaneousContrast: IllusionDefinition = {
  id: 'simultaneous-contrast',
  version: 1,
  titleKey: 'illusion.simultaneous-contrast.title',
  descriptionKey: 'illusion.simultaneous-contrast.description',
  supportsAnimation: false,
  defaultParams: defaults(schema),
  paramSchema: schema,
  randomize: (rng) => ({
    centerRadius: rng.int(120, 200),
    contrast: rng.float(0.35, 0.78, 2),
    showGuide: rng.next() > 0.82,
    background: rng.pick(['#f8fafc', '#fff7ed', '#f1f5f9']),
    colorA: rng.pick(['#111827', '#1f2937', '#312e81']),
    colorB: rng.pick(['#e5e7eb', '#fde68a', '#bfdbfe']),
    centralColor: rng.pick(['#9ca3af', '#94a3b8', '#a8a29e'])
  }),
  renderCanvas: (ctx, params) => {
    renderScaled(ctx, paramColor(params, 'background'), (scaled) => {
      const radius = paramNumber(params, 'centerRadius');
      const contrast = paramNumber(params, 'contrast');
      scaled.globalAlpha = contrast;
      scaled.fillStyle = paramColor(params, 'colorA');
      scaled.fillRect(130, 260, 650, 1080);
      scaled.fillStyle = paramColor(params, 'colorB');
      scaled.fillRect(820, 260, 650, 1080);
      scaled.globalAlpha = 1;
      canvasCircle(scaled, 455, 800, radius, paramColor(params, 'centralColor'));
      canvasCircle(scaled, 1145, 800, radius, paramColor(params, 'centralColor'));
      if (paramBoolean(params, 'showGuide')) {
        drawGuideSegments(scaled, sameColorDiagonalSegments(paramColor(params, 'centralColor')));
      }
    });
  },
  renderSvg: (params) => {
    const radius = paramNumber(params, 'centerRadius');
    const contrast = paramNumber(params, 'contrast');
    const parts = [
      `<g opacity="${contrast}">`,
      svgRect(130, 260, 650, 1080, paramColor(params, 'colorA')),
      svgRect(820, 260, 650, 1080, paramColor(params, 'colorB')),
      '</g>',
      svgCircle(455, 800, radius, paramColor(params, 'centralColor')),
      svgCircle(1145, 800, radius, paramColor(params, 'centralColor')),
      ...(paramBoolean(params, 'showGuide') ? svgGuideSegments(sameColorDiagonalSegments(paramColor(params, 'centralColor'))) : [])
    ];
    return svgDocument(parts.join(''), paramColor(params, 'background'));
  }
};
