import { frBase, frV03 } from './languages/fr';
import { esBase, esV03 } from './languages/es';
import { deBase, deV03 } from './languages/de';
import { jaBase, jaV03 } from './languages/ja';
import { zhHansBase, zhHansV03 } from './languages/zh-Hans';
import { zhHantBase, zhHantV03 } from './languages/zh-Hant';
import { koBase, koV03 } from './languages/ko';

export const overrides = {
  fr: frBase,
  es: esBase,
  de: deBase,
  ja: jaBase,
  'zh-Hans': zhHansBase,
  'zh-Hant': zhHantBase,
  ko: koBase
};

export const v03Overrides = {
  fr: frV03,
  es: esV03,
  de: deV03,
  ja: jaV03,
  'zh-Hans': zhHansV03,
  'zh-Hant': zhHantV03,
  ko: koV03
};
