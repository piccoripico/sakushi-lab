import { createTrickArtIllusion } from './trickArtFactory';

export const rotatingNeckerCube = createTrickArtIllusion({
  id: 'rotating-necker-cube',
  titleKey: 'illusion.rotating-necker-cube.title',
  descriptionKey: 'illusion.rotating-necker-cube.description',
  kind: 'rotatingNeckerCube',
  supportsAnimation: true
});
