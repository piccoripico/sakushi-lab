import type { SupportedLanguage } from './i18n';

type IllusionSummaryMap = Record<string, string>;

const summaries: IllusionSummaryMap = {
  'cafe-wall': 'staggered tiles make parallel lines look tilted.',
  'hermann-grid': 'grid intersections create fleeting dark spots.',
  'muller-lyer': 'arrow fins change the perceived length of equal lines.',
  ponzo: 'perspective cues make equal bars look different.',
  poggendorff: 'an occluding band makes a diagonal look displaced.',
  zollner: 'crossing strokes make parallel lines seem to lean.',
  hering: 'radiating lines make straight parallels bow outward.',
  'vertical-horizontal': 'equal vertical and horizontal lines feel unequal.',
  ebbinghaus: 'surrounding circles change the perceived size of equal centers.',
  delboeuf: 'surrounding rings change the perceived size of equal circles.',
  'sander-parallelogram': 'skewed frames distort perceived line length.',
  'kanizsa-triangle': 'cut-out disks and corner shapes imply a triangle that is not drawn.',
  'rubin-vase': 'a vase and two face profiles compete as figure and ground.',
  'simultaneous-contrast': 'identical colors shift with their surroundings.',
  'whites-illusion': 'equal gray bars look different across stripes.',
  cornsweet: 'a narrow shaded edge changes perceived brightness.',
  'lilac-chaser': 'a rotating gap creates a moving afterimage effect.',
  'rotating-necker-cube': 'motion makes a wireframe cube flip in depth.'
};

export const illusionSummaries: Record<SupportedLanguage, IllusionSummaryMap> = {
  en: summaries,
  fr: summaries,
  es: summaries,
  de: summaries,
  ja: summaries,
  'zh-Hans': summaries,
  'zh-Hant': summaries,
  ko: summaries
};
