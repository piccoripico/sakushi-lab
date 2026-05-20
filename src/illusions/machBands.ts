import { colorParam, defaults, rangeParam } from './common';
import { gray, renderScaled } from './v02Helpers';
import { svgDocument, svgRect } from '../svg';
import { EXPORT_SIZE, paramColor, paramNumber, type IllusionDefinition } from '../types';

const schema = [
  rangeParam('bandCount', 'param.bandCount', 5, 18, 1, 10),
  rangeParam('contrast', 'param.contrast', 0.2, 0.95, 0.01, 0.66),
  colorParam('background', 'param.background', '#f8fafc')
] as const;

export const machBands: IllusionDefinition = {
  id: 'mach-bands',
  version: 1,
  titleKey: 'illusion.mach-bands.title',
  descriptionKey: 'illusion.mach-bands.description',
  supportsAnimation: false,
  defaultParams: defaults(schema),
  paramSchema: schema,
  randomize: (rng) => ({
    bandCount: rng.int(7, 15),
    contrast: rng.float(0.45, 0.88, 2),
    background: rng.pick(['#f8fafc', '#fff7ed', '#f1f5f9'])
  }),
  renderCanvas: (ctx, params) => {
    renderScaled(ctx, paramColor(params, 'background'), (scaled) => {
      for (const band of bands(params)) {
        scaled.fillStyle = band.color;
        scaled.fillRect(band.x, 250, band.width, 1100);
      }
    });
  },
  renderSvg: (params) => svgDocument(bands(params).map((band) => svgRect(band.x, 250, band.width, 1100, band.color)).join(''), paramColor(params, 'background'))
};

function bands(params: Record<string, unknown>): { x: number; width: number; color: string }[] {
  const count = Number(params.bandCount);
  const contrast = Number(params.contrast);
  const x0 = 120;
  const width = 1360 / count;
  const result: { x: number; width: number; color: string }[] = [];

  for (let index = 0; index < count; index += 1) {
    const base = 230 - (index / Math.max(1, count - 1)) * 170 * contrast;
    result.push({ x: x0 + index * width, width, color: gray(base) });
    if (index > 0) {
      result.push({ x: x0 + index * width - 8, width: 8, color: gray(base + 24 * contrast) });
      result.push({ x: x0 + index * width, width: 8, color: gray(base - 24 * contrast) });
    }
  }

  return result;
}
