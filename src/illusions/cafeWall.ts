import { colorParam, defaults, fill, rangeParam, toggleParam } from './common';
import { drawGuideSegments, measurementGridSegments, svgGuideSegments } from './guideHelpers';
import { svgDocument, svgRect } from '../svg';
import { EXPORT_SIZE, paramBoolean, paramColor, paramNumber, type IllusionDefinition } from '../types';

const schema = [
  rangeParam('rows', 'param.rows', 4, 32, 1, 14),
  rangeParam('columns', 'param.columns', 4, 36, 1, 16),
  rangeParam('mortar', 'param.mortar', 1, 28, 1, 7, 'px'),
  rangeParam('offset', 'param.offset', 0, 1, 0.01, 0.5),
  rangeParam('contrast', 'param.contrast', 0.1, 1, 0.01, 0.86),
  toggleParam('showGuide', 'param.showGuide', false),
  colorParam('background', 'param.background', '#d9e1e6'),
  colorParam('tileLight', 'param.tileLight', '#f8fafc'),
  colorParam('tileDark', 'param.tileDark', '#111827'),
  colorParam('accentColor', 'param.guideColor', '#0f766e')
] as const;

export const cafeWall: IllusionDefinition = {
  id: 'cafe-wall',
  version: 1,
  titleKey: 'illusion.cafe-wall.title',
  descriptionKey: 'illusion.cafe-wall.description',
  supportsAnimation: false,
  defaultParams: defaults(schema),
  paramSchema: schema,
  randomize: (rng) => {
    const rows = rng.int(9, 20);
    const columns = rng.int(10, 24);
    const pair = rng.pick([
      ['#f8fafc', '#111827'],
      ['#fff7ed', '#7c2d12'],
      ['#ecfeff', '#164e63'],
      ['#fdf2f8', '#831843']
    ] as const);

    return {
      rows,
      columns,
      mortar: rng.int(3, 14),
      offset: rng.float(0.3, 0.7, 2),
      contrast: rng.float(0.55, 1, 2),
      showGuide: rng.next() > 0.78,
      background: rng.pick(['#d9e1e6', '#d6d3d1', '#cbd5e1']),
      tileLight: pair[0],
      tileDark: pair[1],
      accentColor: rng.pick(['#0f766e', '#3159b7', '#b45309'])
    };
  },
  renderCanvas: (ctx, params) => {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    const rows = paramNumber(params, 'rows');
    const columns = paramNumber(params, 'columns');
    const mortar = paramNumber(params, 'mortar') * (width / EXPORT_SIZE);
    const offset = paramNumber(params, 'offset');
    const contrast = paramNumber(params, 'contrast');
    const tileLight = paramColor(params, 'tileLight');
    const tileDark = paramColor(params, 'tileDark');
    const tileW = (width - mortar * (columns + 1)) / columns;
    const tileH = (height - mortar * (rows + 1)) / rows;

    fill(ctx, paramColor(params, 'background'));
    ctx.save();
    ctx.globalAlpha = contrast;

    for (let row = 0; row < rows; row += 1) {
      const shift = row % 2 === 0 ? 0 : tileW * offset;

      for (let column = -1; column <= columns; column += 1) {
        const x = mortar + column * (tileW + mortar) + shift;
        const y = mortar + row * (tileH + mortar);
        ctx.fillStyle = (row + column) % 2 === 0 ? tileDark : tileLight;
        ctx.fillRect(x, y, tileW, tileH);
      }
    }

    ctx.restore();

    if (paramBoolean(params, 'showGuide')) {
      const scale = width / EXPORT_SIZE;
      ctx.save();
      ctx.scale(scale, scale);
      drawGuideSegments(ctx, measurementGridSegments(params));
      ctx.restore();
    }
  },
  renderSvg: (params) => {
    const rows = paramNumber(params, 'rows');
    const columns = paramNumber(params, 'columns');
    const mortar = paramNumber(params, 'mortar');
    const offset = paramNumber(params, 'offset');
    const contrast = paramNumber(params, 'contrast');
    const tileW = (EXPORT_SIZE - mortar * (columns + 1)) / columns;
    const tileH = (EXPORT_SIZE - mortar * (rows + 1)) / rows;
    const parts: string[] = [];

    for (let row = 0; row < rows; row += 1) {
      const shift = row % 2 === 0 ? 0 : tileW * offset;

      for (let column = -1; column <= columns; column += 1) {
        parts.push(svgRect(
          mortar + column * (tileW + mortar) + shift,
          mortar + row * (tileH + mortar),
          tileW,
          tileH,
          (row + column) % 2 === 0 ? paramColor(params, 'tileDark') : paramColor(params, 'tileLight')
        ));
      }
    }

    const guides = paramBoolean(params, 'showGuide')
      ? svgGuideSegments(measurementGridSegments(params)).join('')
      : '';

    return svgDocument(`<g opacity="${contrast}">${parts.join('')}</g>${guides}`, paramColor(params, 'background'));
  }
};
