import { colorParam, defaults, rangeParam, toggleParam } from './common';
import { drawGuideSegments, sameColorDiagonalSegments, svgGuideSegments } from './guideHelpers';
import { gray, renderScaled } from './v02Helpers';
import { svgDocument, svgRect } from '../svg';
import { paramBoolean, paramColor, paramNumber, type IllusionDefinition } from '../types';

const schema = [
  rangeParam('gap', 'param.gap', 40, 340, 5, 150, 'px'),
  rangeParam('edgeWidth', 'param.edgeWidth', 4, 180, 2, 48, 'px'),
  rangeParam('contrast', 'param.contrast', 0.05, 1, 0.01, 0.52),
  toggleParam('showGuide', 'param.showGuide', false),
  colorParam('background', 'param.background', '#f8fafc')
] as const;

export const cornsweet: IllusionDefinition = {
  id: 'cornsweet',
  version: 1,
  titleKey: 'illusion.cornsweet.title',
  descriptionKey: 'illusion.cornsweet.description',
  supportsAnimation: false,
  defaultParams: defaults(schema),
  paramSchema: schema,
  randomize: (rng) => ({
    gap: rng.int(95, 230),
    edgeWidth: rng.int(28, 86),
    contrast: rng.float(0.35, 0.75, 2),
    showGuide: rng.next() > 0.82,
    background: rng.pick(['#f8fafc', '#fff7ed', '#f1f5f9'])
  }),
  renderCanvas: (ctx, params) => {
    renderScaled(ctx, paramColor(params, 'background'), (scaled) => {
      const spread = paramNumber(params, 'gap');
      const edge = paramNumber(params, 'edgeWidth');
      const contrast = paramNumber(params, 'contrast');
      scaled.fillStyle = gray(172);
      scaled.fillRect(120, 260, 1360, 1080);
      const left = scaled.createLinearGradient(800 - spread - edge / 2, 0, 800 - edge / 2, 0);
      left.addColorStop(0, gray(172));
      left.addColorStop(1, gray(172 + 70 * contrast));
      scaled.fillStyle = left;
      scaled.fillRect(800 - spread - edge / 2, 260, spread, 1080);
      scaled.fillStyle = gray(172 + 70 * contrast);
      scaled.fillRect(800 - edge / 2, 260, edge / 2, 1080);
      scaled.fillStyle = gray(172 - 70 * contrast);
      scaled.fillRect(800, 260, edge / 2, 1080);
      const right = scaled.createLinearGradient(800 + edge / 2, 0, 800 + spread + edge / 2, 0);
      right.addColorStop(0, gray(172 - 70 * contrast));
      right.addColorStop(1, gray(172));
      scaled.fillStyle = right;
      scaled.fillRect(800 + edge / 2, 260, spread, 1080);
      if (paramBoolean(params, 'showGuide')) {
        drawGuideSegments(scaled, sameColorDiagonalSegments(gray(172)));
      }
    });
  },
  renderSvg: (params) => {
    const spread = paramNumber(params, 'gap');
    const edge = paramNumber(params, 'edgeWidth');
    const contrast = paramNumber(params, 'contrast');
    const defs = [
      '<defs>',
      `<linearGradient id="cornsweetLeft" x1="0" x2="1"><stop offset="0" stop-color="${gray(172)}"/><stop offset="1" stop-color="${gray(172 + 70 * contrast)}"/></linearGradient>`,
      `<linearGradient id="cornsweetRight" x1="0" x2="1"><stop offset="0" stop-color="${gray(172 - 70 * contrast)}"/><stop offset="1" stop-color="${gray(172)}"/></linearGradient>`,
      '</defs>'
    ].join('');
    const parts = [
      defs,
      svgRect(120, 260, 1360, 1080, gray(172)),
      svgRect(800 - spread - edge / 2, 260, spread, 1080, 'url(#cornsweetLeft)'),
      svgRect(800 - edge / 2, 260, edge / 2, 1080, gray(172 + 70 * contrast)),
      svgRect(800, 260, edge / 2, 1080, gray(172 - 70 * contrast)),
      svgRect(800 + edge / 2, 260, spread, 1080, 'url(#cornsweetRight)'),
      paramBoolean(params, 'showGuide') ? svgGuideSegments(sameColorDiagonalSegments(gray(172))).join('') : ''
    ];
    return svgDocument(parts.join(''), paramColor(params, 'background'));
  }
};
