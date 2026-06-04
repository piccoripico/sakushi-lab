import { sanitizeParams, type IllusionDefinition, type ParamValues } from '../types';
import { createRng } from '../rng';
import { cafeWall } from './cafeWall';
import { cornsweet } from './cornsweet';
import { delboeuf } from './delboeuf';
import { ebbinghaus } from './ebbinghaus';
import { hering } from './hering';
import { hermannGrid } from './hermannGrid';
import { kanizsaTriangle } from './kanizsaTriangle';
import { lilacChaser } from './lilacChaser';
import { mullerLyer } from './mullerLyer';
import { poggendorff } from './poggendorff';
import { ponzo } from './ponzo';
import { rotatingNeckerCube } from './rotatingNeckerCube';
import { rubinVase } from './rubinVase';
import { sanderParallelogram } from './sanderParallelogram';
import { simultaneousContrast } from './simultaneousContrast';
import { verticalHorizontal } from './verticalHorizontal';
import { whitesIllusion } from './whitesIllusion';
import { zollner } from './zollner';

export type MediaId = 'static' | 'video';

export interface IllusionGroup {
  id:
    | 'geometry'
    | 'ambiguousDepth'
    | 'figureGround'
    | 'colorBrightness'
    | 'motionAfterimage'
    | 'reversibleDepth';
  titleKey: string;
  illusions: readonly IllusionDefinition[];
}

export interface MediaGroup {
  id: MediaId;
  titleKey: string;
  groups: readonly IllusionGroup[];
}

export const mediaGroups: readonly MediaGroup[] = Object.freeze([
  {
    id: 'static',
    titleKey: 'media.static',
    groups: [
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
          verticalHorizontal,
          ebbinghaus,
          delboeuf,
          sanderParallelogram,
          kanizsaTriangle
        ]
      },
      {
        id: 'figureGround',
        titleKey: 'category.figureGround',
        illusions: [
          rubinVase
        ]
      },
      {
        id: 'colorBrightness',
        titleKey: 'category.colorBrightness',
        illusions: [
          simultaneousContrast,
          whitesIllusion,
          cornsweet
        ]
      }
    ]
  },
  {
    id: 'video',
    titleKey: 'media.video',
    groups: [
      {
        id: 'motionAfterimage',
        titleKey: 'category.motionAfterimage',
        illusions: [
          lilacChaser
        ]
      },
      {
        id: 'reversibleDepth',
        titleKey: 'category.reversibleDepth',
        illusions: [
          rotatingNeckerCube
        ]
      }
    ]
  }
] satisfies readonly MediaGroup[]);

export const illusionGroups: readonly IllusionGroup[] = Object.freeze(mediaGroups.flatMap((media) => media.groups));

export const illusions: readonly IllusionDefinition[] = Object.freeze(illusionGroups.flatMap((group) => group.illusions));

export const illusionIds: readonly string[] = Object.freeze(illusions.map((illusion) => illusion.id));

export function getIllusion(id: string): IllusionDefinition | undefined {
  return illusions.find((illusion) => illusion.id === id);
}

export function getMediaGroup(id: MediaId): MediaGroup {
  return mediaGroups.find((group) => group.id === id) ?? mediaGroups[0];
}

export function getMediaForIllusion(illusionId: string): MediaGroup {
  return mediaGroups.find((media) =>
    media.groups.some((group) => group.illusions.some((illusion) => illusion.id === illusionId))
  ) ?? mediaGroups[0];
}

export function randomizeParams(illusion: IllusionDefinition, seed: string): ParamValues {
  const randomized = sanitizeParams(illusion, illusion.randomize(createRng(`${illusion.id}:${seed}`)));

  if (illusion.paramSchema.some((control) => control.key === 'showGuide')) {
    return {
      ...randomized,
      showGuide: false
    };
  }

  return randomized;
}
