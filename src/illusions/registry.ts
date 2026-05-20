import { sanitizeParams, type IllusionDefinition, type ParamValues } from '../types';
import { createRng } from '../rng';
import { cafeWall } from './cafeWall';
import { cornsweet } from './cornsweet';
import { delboeuf } from './delboeuf';
import { ebbinghaus } from './ebbinghaus';
import { fraserSpiral } from './fraserSpiral';
import { hering } from './hering';
import { hermannGrid } from './hermannGrid';
import { jastrow } from './jastrow';
import { kanizsaTriangle } from './kanizsaTriangle';
import { lilacChaser } from './lilacChaser';
import { machBands } from './machBands';
import { moireMotion } from './moireMotion';
import { mullerLyer } from './mullerLyer';
import { ouchiIllusion } from './ouchiIllusion';
import { peripheralDrift } from './peripheralDrift';
import { pinnaBrelstaff } from './pinnaBrelstaff';
import { poggendorff } from './poggendorff';
import { ponzo } from './ponzo';
import { sanderParallelogram } from './sanderParallelogram';
import { simultaneousContrast } from './simultaneousContrast';
import { verticalHorizontal } from './verticalHorizontal';
import { whitesIllusion } from './whitesIllusion';
import { wundt } from './wundt';
import { zollner } from './zollner';

export interface IllusionGroup {
  id: 'geometry' | 'colorBrightness' | 'motion';
  titleKey: string;
  illusions: readonly IllusionDefinition[];
}

export const illusionGroups = Object.freeze([
  {
    id: 'geometry',
    titleKey: 'category.geometry',
    illusions: [
      cafeWall,
      hermannGrid,
      mullerLyer,
      ponzo,
      poggendorff,
      zollner,
      hering,
      wundt,
      verticalHorizontal,
      jastrow,
      ebbinghaus,
      delboeuf,
      sanderParallelogram,
      kanizsaTriangle,
      fraserSpiral
    ]
  },
  {
    id: 'colorBrightness',
    titleKey: 'category.colorBrightness',
    illusions: [
      simultaneousContrast,
      machBands,
      whitesIllusion,
      cornsweet
    ]
  },
  {
    id: 'motion',
    titleKey: 'category.motion',
    illusions: [
      moireMotion,
      peripheralDrift,
      ouchiIllusion,
      lilacChaser,
      pinnaBrelstaff
    ]
  }
] satisfies IllusionGroup[]);

export const illusions = Object.freeze(illusionGroups.flatMap((group) => group.illusions));

export const illusionIds = Object.freeze(illusions.map((illusion) => illusion.id));

export function getIllusion(id: string): IllusionDefinition | undefined {
  return illusions.find((illusion) => illusion.id === id);
}

export function randomizeParams(illusion: IllusionDefinition, seed: string): ParamValues {
  return sanitizeParams(illusion, illusion.randomize(createRng(`${illusion.id}:${seed}`)));
}
