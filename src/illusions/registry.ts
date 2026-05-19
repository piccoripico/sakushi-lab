import { sanitizeParams, type IllusionDefinition, type ParamValues } from '../types';
import { createRng } from '../rng';
import { cafeWall } from './cafeWall';
import { ebbinghaus } from './ebbinghaus';
import { fraserSpiral } from './fraserSpiral';
import { hermannGrid } from './hermannGrid';
import { moireMotion } from './moireMotion';
import { mullerLyer } from './mullerLyer';

export const illusions = Object.freeze([
  cafeWall,
  hermannGrid,
  mullerLyer,
  ebbinghaus,
  fraserSpiral,
  moireMotion
] satisfies IllusionDefinition[]);

export const illusionIds = Object.freeze(illusions.map((illusion) => illusion.id));

export function getIllusion(id: string): IllusionDefinition | undefined {
  return illusions.find((illusion) => illusion.id === id);
}

export function randomizeParams(illusion: IllusionDefinition, seed: string): ParamValues {
  return sanitizeParams(illusion, illusion.randomize(createRng(`${illusion.id}:${seed}`)));
}
