import { SUPPORTED_LANGUAGES, type SupportedLanguage, detectLanguage, isSupportedLanguage } from './i18n';
import { getIllusion, illusions } from './illusions/registry';
import { randomSeed } from './rng';
import {
  DEFAULT_PREVIEW_DISPLAY_SIZE,
  isPreviewDisplaySize,
  sanitizeParams,
  type ParamValues,
  type PreviewDisplaySize
} from './types';

export interface AppState {
  lang: SupportedLanguage;
  illusionId: string;
  seed: string;
  seedLocked: boolean;
  params: ParamValues;
  view: PreviewDisplaySize;
}

export function defaultState(languageTags: readonly string[] = []): AppState {
  const illusion = illusions[0];
  return {
    lang: detectLanguage(languageTags),
    illusionId: illusion.id,
    seed: randomSeed(),
    seedLocked: false,
    params: { ...illusion.defaultParams },
    view: DEFAULT_PREVIEW_DISPLAY_SIZE
  };
}

export function readStateFromUrl(search: string, languageTags: readonly string[] = []): AppState {
  const fallback = defaultState(languageTags);
  const query = new URLSearchParams(search);
  const langQuery = query.get('lang');
  const illusionId = query.get('i') ?? fallback.illusionId;
  const illusion = getIllusion(illusionId) ?? getIllusion(fallback.illusionId)!;
  const decodedParams = decodeParams(query.get('p'));
  const view = query.get('view') ?? DEFAULT_PREVIEW_DISPLAY_SIZE;

  return {
    lang: langQuery && isSupportedLanguage(langQuery) ? langQuery : fallback.lang,
    illusionId: illusion.id,
    seed: query.get('seed') || fallback.seed,
    seedLocked: query.get('lock') === '1',
    params: sanitizeParams(illusion, decodedParams),
    view: isPreviewDisplaySize(view) ? view : DEFAULT_PREVIEW_DISPLAY_SIZE
  };
}

export function stateToUrl(state: AppState, baseUrl = globalThis.location?.href ?? 'http://localhost/'): string {
  const url = new URL(baseUrl);
  url.search = stateToSearch(state);
  url.hash = '';
  return url.toString();
}

export function stateToSearch(state: AppState): string {
  const query = new URLSearchParams();
  query.set('lang', state.lang);
  query.set('i', state.illusionId);
  query.set('seed', state.seed);
  if (state.seedLocked) {
    query.set('lock', '1');
  }
  query.set('view', state.view);
  query.set('p', encodeParams(state.params));
  return `?${query.toString()}`;
}

export function encodeParams(params: ParamValues): string {
  const json = JSON.stringify(params);
  const bytes = new TextEncoder().encode(json);
  let binary = '';

  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

  return btoa(binary).replaceAll('+', '-').replaceAll('/', '_').replaceAll('=', '');
}

export function decodeParams(encoded: string | null): unknown {
  if (!encoded) {
    return null;
  }

  try {
    const padded = encoded.replaceAll('-', '+').replaceAll('_', '/').padEnd(Math.ceil(encoded.length / 4) * 4, '=');
    const binary = atob(padded);
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    return JSON.parse(new TextDecoder().decode(bytes));
  } catch {
    return null;
  }
}

export { SUPPORTED_LANGUAGES };
