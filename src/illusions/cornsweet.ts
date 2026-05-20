import { colorParam, defaults, rangeParam } from './common';
import { gray, renderScaled } from './v02Helpers';
import { svgDocument, svgRect } from '../svg';
import { EXPORT_SIZE, paramColor, paramNumber, type IllusionDefinition } from '../types';

const schema = [
  rangeParam('gap', 'param.gap', 70, 260, 5, 150, 'px'),
  rangeParam('contrast', 'param.contrast', 0.2, 0.85, 0.01, 0.52),
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
    contrast: rng.float(0.35, 0.75, 2),
    background: rng.pick(['#f8fafc', '#fff7ed', '#f1f5f9'])
  }),
  renderCanvas: (ctx, params) => {
    renderScaled(ctx, paramColor(params, 'background'), (scaled) => {
      const edge = paramNumber(params, 'gap');
      const contrast = paramNumber(params, 'contrast');
      scaled.fillStyle = gray(172);
      scaled.fillRect(120, 260, 1360, 1080);
      const left = scaled.createLinearGradient(800 - edge, 0, 800, 0);
      left.addColorStop(0, gray(172));
      left.addColorStop(1, gray(172 + 70 * contrast));
      scaled.fillStyle = left;
      scaled.fillRect(800 - edge, 260, edge, 1080);
      const right = scaled.createLinearGradient(800, 0, 800 + edge, 0);
      right.addColorStop(0, gray(172 - 70 * contrast));
      right.addColorStop(1, gray(172));
      scaled.fillStyle = right;
      scaled.fillRect(800, 260, edge, 1080);
    });
  },
  renderSvg: (params) => {
    const edge = paramNumber(params, 'gap');
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
      svgRect(800 - edge, 260, edge, 1080, 'url(#cornsweetLeft)'),
      svgRect(800, 260, edge, 1080, 'url(#cornsweetRight)')
    ];
    return svgDocument(parts.join(''), paramColor(params, 'background'));
  }
};
