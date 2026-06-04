import type { SupportedLanguage } from './i18n';

type DescriptionDictionary = Record<string, string>;

const descriptions: DescriptionDictionary = {
  'illusion.cafe-wall.description': `The preview shows offset rows of light and dark tiles separated by thin mortar lines.

Although the tile rows are horizontal, the staggered edges can make the mortar look slanted.

Turn Guide on to overlay a square grid across the whole preview. Mortar width, row offset, and contrast change when the tilt appears or fades.`,
  'illusion.hermann-grid.description': `The preview shows only a bright grid on a dark background. No dots are actually drawn at the intersections.

When you look near, but not directly at, the intersections, dark spots may briefly appear in the surrounding grid.

Turn Guide on to mark every intersection. Grid count, line width, contrast, and guide color help test when the illusory spots appear or fade.`,
  'illusion.muller-lyer.description': `The preview shows two equal line segments with arrow-like fins pointing in different directions.

The central lines are the same length, but the fins can make one look longer than the other.

Turn Guide on to overlay a square grid. Fin length, fin angle, line length, and separation let you compare measured equality with perceived difference.`,
  'illusion.ponzo.description': `The preview places equal horizontal bars between converging perspective lines.

The bar nearer the narrow end can look longer because the background suggests depth.

Turn Guide on to overlay a square grid. Depth guides, horizon, line length, separation, and contrast change how strongly the perspective context works.`,
  'illusion.poggendorff.description': `The preview shows a diagonal line interrupted by a vertical occluding band.

Even when the diagonal segments belong to one straight path, the hidden middle can make them look misaligned.

Toggle the occluder or guide line, then adjust angle, gap, and line width to test the alignment.`,
  'illusion.zollner.description': `The preview shows long parallel lines crossed by many short slanted strokes.

The short strokes make the parallel lines seem to lean away from each other.

Turn context off to remove the short strokes, or turn Guide on to overlay a square grid. Crossing angle, segment count, stripe count, and line width control the tilt impression.`,
  'illusion.hering.description': `The preview shows straight parallel lines laid over radiating background lines.

The radiating context can make the straight lines look as if they bow outward.

Turn context off to see the straight lines alone, or turn Guide on to overlay a square grid. Stripe count, separation, line width, and contrast change the effect.`,
  'illusion.vertical-horizontal.description': `The preview shows a vertical line and a horizontal line that meet at the same point. The two target lines have the same physical length.

Many viewers feel that the vertical line is longer, because vertical extent and horizontal extent are judged differently.

Turn Guide on to overlay a square grid. Line length, gap, and line width let you test when the equality is easiest to trust.`,
  'illusion.ebbinghaus.description': `The preview shows equal center circles surrounded by different context circles.

Large or small surrounding circles can make the same center size look smaller or larger.

Turn context off to remove the surrounding circles, or turn Guide on to overlay a square grid. Surround radius, count, gap, and scale change the context effect.`,
  'illusion.delboeuf.description': `The preview shows equal center circles framed by surrounding rings.

The ring size and distance can make the equal centers appear different in size.

Turn Guide on to overlay a square grid. Center radius, surround radius, separation, and line width change the framing effect.`,
  'illusion.sander-parallelogram.description': `The preview shows two equal slanted target lines inside differently skewed frames.

Although the target lines are the same length, the frame on one side can make it feel longer than the other.

Turn context off to see the target lines alone, or turn Guide on to overlay a square grid. Angle, separation, and line width change the pull of the frames.`,
  'illusion.kanizsa-triangle.description': `The preview arranges three black cut-out disks and three black corner shapes around an empty center.

Your visual system may complete the missing edges and see a bright triangle that is not actually drawn.

Turn Guide on to show the triangle your eye is completing. Dot radius and line width change when the invisible triangle becomes convincing.`,
  'illusion.rubin-vase.description': `The preview shows a light central vase shape between two dark side regions.

The same border can be read either as the edge of a vase or as two face profiles looking at each other.

Turn Guide on to outline the vase, both face profiles, and the center axis. Vase width, profile depth, neck width, and colors change which interpretation is easier to hold.`,
  'illusion.simultaneous-contrast.description': `The preview places identical center colors on different surrounding backgrounds.

The same center color can look lighter on a dark surround and darker on a light surround.

Turn Guide on to draw same-color diagonal samples across both patches. Center radius, contrast, and colors let you compare the patches directly.`,
  'illusion.whites-illusion.description': `The preview places equal gray targets across alternating light and dark stripes.

The surrounding stripe pattern can make the equal gray targets look different in brightness.

Turn Guide on to draw same-gray diagonal samples across the target regions. Stripe count, line width, contrast, and colors let you compare the targets.`,
  'illusion.cornsweet.description': `The preview shows two large regions divided by a narrow shaded edge.

Although the broad regions can be equal in brightness, the edge makes one side appear lighter.

Turn Guide on to compare equal sample areas. Edge width, contrast, and color choices change how strongly the brightness shift appears.`,
  'illusion.lilac-chaser.description': `The preview shows lilac dots arranged around a circle with one missing position rotating around the ring.

As the gap moves, you may see a moving afterimage or a greenish dot that is not directly drawn.

Use speed, radius, dot count, and contrast to test when the afterimage is strongest. Pause the animation if the motion feels uncomfortable.`,
  'illusion.rotating-necker-cube.description': `The preview animates an ambiguous wireframe cube while its angle and highlighted edges gently shift.

The cube can flip between two depth readings, so the front and back faces may trade places in your perception.

Turn Guide on to alternate between the two possible front faces. Depth, angle, line width, contrast, and face colors help make the reversal easier to inspect.`
};

export const detailedIllusionDescriptions: Record<SupportedLanguage, DescriptionDictionary> = {
  en: descriptions,
  fr: descriptions,
  es: descriptions,
  de: descriptions,
  ja: descriptions,
  'zh-Hans': descriptions,
  'zh-Hant': descriptions,
  ko: descriptions
};
