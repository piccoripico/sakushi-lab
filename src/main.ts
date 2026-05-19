import './styles.css';
import { LANGUAGE_NAMES, SUPPORTED_LANGUAGES, createTranslator, type SupportedLanguage, type TranslationKey } from './i18n';
import { downloadPng, downloadSvg, downloadWebM } from './exporters';
import { createExportBaseName } from './filenames';
import { illusions, getIllusion, randomizeParams } from './illusions/registry';
import { createRng, randomSeed } from './rng';
import { defaultState, readStateFromUrl, stateToSearch, stateToUrl } from './state';
import {
  PREVIEW_DISPLAY_SIZES,
  PREVIEW_SIZE,
  WEBM_DURATION_MS,
  sanitizeParams,
  type IllusionDefinition,
  type ParamControl,
  type ParamValue,
  type PreviewDisplaySize,
  type RenderFrame
} from './types';

const GITHUB_REPOSITORY_URL = 'https://github.com/piccoripico/sakushi-lab';

const root = document.querySelector<HTMLDivElement>('#app');

if (!root) {
  throw new Error('App root was not found.');
}

let state = readStateFromUrl(window.location.search, navigator.languages);
let t = createTranslator(state.lang);
let activeAnimation = 0;
let isPlaying = true;
let isRecording = false;

root.innerHTML = `
  <header class="app-header">
    <div class="title-block">
      <h1 data-i18n="app.title"></h1>
      <p class="app-description" data-i18n="app.description"></p>
    </div>
    <div class="header-controls">
      <label class="preview-size-picker">
        <span data-i18n="preview.size"></span>
        <select id="previewSizeSelect" data-testid="preview-size-select"></select>
      </label>
      <label class="language-picker">
        <span data-i18n="language.label"></span>
        <select id="languageSelect" data-testid="language-select"></select>
      </label>
    </div>
  </header>

  <main class="app-shell">
    <aside class="control-panel" aria-labelledby="controlsTitle">
      <div class="section-heading">
        <h2 id="controlsTitle" data-i18n="controls.title"></h2>
      </div>

      <label class="field">
        <span data-i18n="controls.illusion"></span>
        <select id="illusionSelect" data-testid="illusion-select"></select>
      </label>

      <div class="button-grid">
        <button id="generateButton" class="primary-button" type="button" data-testid="generate-button" data-i18n="actions.generate"></button>
        <button id="surpriseButton" class="secondary-button" type="button" data-testid="surprise-button" data-i18n="actions.surprise"></button>
      </div>

      <details class="seed-panel" data-testid="seed-panel">
        <summary data-i18n="controls.seedPanel"></summary>
        <div class="seed-panel-body">
          <label class="field">
            <span data-i18n="controls.seedId"></span>
            <input id="seedInput" data-testid="seed-input" type="text" autocomplete="off">
          </label>

          <label class="toggle-field seed-lock">
            <input id="seedLockInput" data-testid="seed-lock-input" type="checkbox">
            <span data-i18n="controls.disableRandomSeed"></span>
          </label>
        </div>
      </details>

      <div class="section-heading compact">
        <h3 data-i18n="controls.parameters"></h3>
      </div>
      <div id="paramControls" class="param-controls" data-testid="param-controls"></div>

      <div class="section-heading compact">
        <h3 data-i18n="export.title"></h3>
      </div>
      <div class="export-grid" data-testid="export-menu">
        <button id="pngButton" type="button" class="secondary-button" data-testid="png-button" data-i18n="export.png"></button>
        <button id="svgButton" type="button" class="secondary-button" data-testid="svg-button" data-i18n="export.svg"></button>
        <button id="webmButton" type="button" class="secondary-button" data-testid="webm-button" data-i18n="export.webm"></button>
      </div>

      <div class="section-heading compact">
        <h3 data-i18n="share.title"></h3>
      </div>
      <div class="share-grid" data-testid="share-menu">
        <button id="urlButton" type="button" class="secondary-button" data-testid="url-button" data-i18n="export.url"></button>
      </div>
      <p id="statusText" class="status-text" data-testid="status-text" aria-live="polite"></p>
    </aside>

    <div class="workspace-column">
      <section class="preview-panel" aria-labelledby="previewTitle">
        <div class="preview-toolbar">
          <h2 id="previewTitle" data-i18n="preview.title"></h2>
          <button id="playButton" type="button" class="icon-button" data-testid="play-button"></button>
        </div>
        <div id="canvasWrap" class="canvas-wrap" data-testid="canvas-wrap">
          <canvas id="illusionCanvas" width="${PREVIEW_SIZE}" height="${PREVIEW_SIZE}" data-testid="illusion-canvas"></canvas>
        </div>
      </section>

      <section class="info-panel" aria-labelledby="infoTitle" data-testid="info-panel">
        <div>
          <h2 id="infoTitle" data-i18n="info.title"></h2>
          <p id="illusionDescription" data-testid="illusion-description"></p>
        </div>
        <p id="motionWarning" class="motion-warning" data-testid="motion-warning"></p>
      </section>
    </div>
  </main>

  <footer class="app-footer">
    <div>
      <h2 data-i18n="footer.about"></h2>
      <p data-i18n="footer.description"></p>
    </div>
    <a id="githubLink" data-testid="github-link" href="${GITHUB_REPOSITORY_URL}" target="_blank" rel="noreferrer" data-i18n="footer.github"></a>
  </footer>
`;

const elements = {
  languageSelect: must<HTMLSelectElement>('#languageSelect'),
  illusionSelect: must<HTMLSelectElement>('#illusionSelect'),
  seedInput: must<HTMLInputElement>('#seedInput'),
  seedLockInput: must<HTMLInputElement>('#seedLockInput'),
  previewSizeSelect: must<HTMLSelectElement>('#previewSizeSelect'),
  generateButton: must<HTMLButtonElement>('#generateButton'),
  surpriseButton: must<HTMLButtonElement>('#surpriseButton'),
  paramControls: must<HTMLDivElement>('#paramControls'),
  pngButton: must<HTMLButtonElement>('#pngButton'),
  svgButton: must<HTMLButtonElement>('#svgButton'),
  webmButton: must<HTMLButtonElement>('#webmButton'),
  urlButton: must<HTMLButtonElement>('#urlButton'),
  statusText: must<HTMLParagraphElement>('#statusText'),
  playButton: must<HTMLButtonElement>('#playButton'),
  canvasWrap: must<HTMLDivElement>('#canvasWrap'),
  canvas: must<HTMLCanvasElement>('#illusionCanvas'),
  description: must<HTMLParagraphElement>('#illusionDescription'),
  motionWarning: must<HTMLParagraphElement>('#motionWarning')
};

const maybeCtx = elements.canvas.getContext('2d');

if (!maybeCtx) {
  throw new Error('Canvas is not available.');
}

const ctx: CanvasRenderingContext2D = maybeCtx;

initialize();

function initialize(): void {
  populateLanguageSelect();
  bindEvents();
  renderAll();
}

function bindEvents(): void {
  elements.languageSelect.addEventListener('change', () => {
    state = { ...state, lang: elements.languageSelect.value as SupportedLanguage };
    t = createTranslator(state.lang);
    renderAll();
    writeUrl();
  });

  elements.illusionSelect.addEventListener('change', () => {
    const illusion = getIllusion(elements.illusionSelect.value) ?? illusions[0];
    state = {
      ...state,
      illusionId: illusion.id,
      params: { ...illusion.defaultParams }
    };
    isPlaying = true;
    renderAll();
    writeUrl();
  });

  elements.previewSizeSelect.addEventListener('change', () => {
    state = {
      ...state,
      view: elements.previewSizeSelect.value as PreviewDisplaySize
    };
    renderPreviewDisplaySize();
    writeUrl();
  });

  elements.seedLockInput.addEventListener('change', () => {
    state = {
      ...state,
      seedLocked: elements.seedLockInput.checked
    };
    writeUrl();
  });

  elements.seedInput.addEventListener('change', () => {
    const seed = elements.seedInput.value.trim() || randomSeed();
    state = { ...state, seed };
    elements.seedInput.value = seed;
    writeUrl();
  });

  elements.generateButton.addEventListener('click', () => {
    const illusion = currentIllusion();
    const seed = state.seedLocked ? state.seed : randomSeed();
    state = {
      ...state,
      seed,
      params: randomizeParams(illusion, seed)
    };
    renderAll();
    writeUrl();
  });

  elements.surpriseButton.addEventListener('click', () => {
    const seed = state.seedLocked ? state.seed : randomSeed();
    const rng = createRng(`surprise:${seed}`);
    const illusion = rng.pick(illusions);
    state = {
      ...state,
      illusionId: illusion.id,
      seed,
      params: randomizeParams(illusion, seed)
    };
    isPlaying = true;
    renderAll();
    writeUrl();
  });

  elements.pngButton.addEventListener('click', () => {
    downloadPng(currentIllusion(), state.params, fileBaseName());
    setStatus('export.done');
  });

  elements.svgButton.addEventListener('click', () => {
    downloadSvg(currentIllusion(), state.params, fileBaseName());
    setStatus('export.done');
  });

  elements.webmButton.addEventListener('click', () => {
    void handleWebmExport();
  });

  elements.urlButton.addEventListener('click', () => {
    void copyShareUrl();
  });

  elements.playButton.addEventListener('click', () => {
    isPlaying = !isPlaying;
    renderPlayState();
    scheduleDraw();
  });
}

function renderAll(): void {
  const illusion = currentIllusion();
  document.documentElement.lang = state.lang;
  document.title = `${t(illusion.titleKey as TranslationKey)} - ${t('app.title')}`;
  applyTranslations();
  populateIllusionSelect();
  populatePreviewSizeSelect();
  renderStateFields();
  renderParamControls(illusion);
  renderInfo(illusion);
  renderPlayState();
  scheduleDraw();
}

function applyTranslations(): void {
  for (const node of document.querySelectorAll<HTMLElement>('[data-i18n]')) {
    node.textContent = t(node.dataset.i18n as TranslationKey);
  }

  setStatus('export.done');
}

function populateLanguageSelect(): void {
  elements.languageSelect.replaceChildren(...SUPPORTED_LANGUAGES.map((language) => {
    const option = document.createElement('option');
    option.value = language;
    option.textContent = LANGUAGE_NAMES[language];
    return option;
  }));
}

function populateIllusionSelect(): void {
  elements.illusionSelect.replaceChildren(...illusions.map((illusion) => {
    const option = document.createElement('option');
    option.value = illusion.id;
    option.textContent = t(illusion.titleKey as TranslationKey);
    return option;
  }));
}

function populatePreviewSizeSelect(): void {
  elements.previewSizeSelect.replaceChildren(...PREVIEW_DISPLAY_SIZES.map((size) => {
    const option = document.createElement('option');
    option.value = size;
    option.textContent = t(previewSizeKey(size));
    return option;
  }));
}

function renderStateFields(): void {
  elements.languageSelect.value = state.lang;
  elements.illusionSelect.value = state.illusionId;
  elements.seedInput.value = state.seed;
  elements.seedLockInput.checked = state.seedLocked;
  elements.previewSizeSelect.value = state.view;
  renderPreviewDisplaySize();
}

function renderParamControls(illusion: IllusionDefinition): void {
  const fragment = document.createDocumentFragment();

  for (const control of illusion.paramSchema) {
    fragment.append(renderControl(control));
  }

  elements.paramControls.replaceChildren(fragment);
}

function renderControl(control: ParamControl): HTMLElement {
  const label = document.createElement('label');
  label.className = `param-row ${control.kind}`;

  const heading = document.createElement('span');
  heading.className = 'param-label';
  heading.textContent = t(control.labelKey as TranslationKey);

  const output = document.createElement('output');
  output.className = 'param-value';
  output.value = formatParamValue(control, state.params[control.key]);

  if (control.kind === 'color') {
    const input = document.createElement('input');
    input.type = 'color';
    input.value = String(state.params[control.key]);
    input.dataset.paramKey = control.key;
    input.dataset.testid = `param-${control.key}`;
    input.addEventListener('input', () => {
      updateParam(control, input.value);
      output.value = input.value;
    });
    label.append(heading, input, output);
    return label;
  }

  if (control.kind === 'toggle') {
    const input = document.createElement('input');
    input.type = 'checkbox';
    input.checked = state.params[control.key] === true;
    input.dataset.paramKey = control.key;
    input.dataset.testid = `param-${control.key}`;
    input.addEventListener('change', () => {
      updateParam(control, input.checked);
      output.value = formatParamValue(control, input.checked);
    });
    label.append(heading, input, output);
    return label;
  }

  const input = document.createElement('input');
  input.type = 'range';
  input.min = String(control.min);
  input.max = String(control.max);
  input.step = String(control.step);
  input.value = String(state.params[control.key]);
  input.dataset.paramKey = control.key;
  input.dataset.testid = `param-${control.key}`;
  input.addEventListener('input', () => {
    const nextValue = Number(input.value);
    updateParam(control, nextValue);
    output.value = formatParamValue(control, nextValue);
  });

  label.append(heading, input, output);
  return label;
}

function updateParam(control: ParamControl, value: ParamValue): void {
  state = {
    ...state,
    params: sanitizeParams(currentIllusion(), {
      ...state.params,
      [control.key]: value
    })
  };
  writeUrl();
  scheduleDraw();
}

function renderInfo(illusion: IllusionDefinition): void {
  elements.description.textContent = t(illusion.descriptionKey as TranslationKey);
  elements.motionWarning.textContent = illusion.supportsAnimation ? t('info.motionWarning') : t('info.staticNote');
  elements.motionWarning.classList.toggle('is-motion', illusion.supportsAnimation);
  elements.webmButton.disabled = !illusion.supportsAnimation || isRecording;
  elements.webmButton.title = illusion.supportsAnimation ? '' : t('export.webmUnavailable');
}

function renderPreviewDisplaySize(): void {
  elements.canvasWrap.dataset.previewSize = state.view;
  elements.canvasWrap.classList.remove('view-small', 'view-medium', 'view-large');
  elements.canvasWrap.classList.add(`view-${state.view}`);
}

function renderPlayState(): void {
  const illusion = currentIllusion();
  elements.playButton.hidden = !illusion.supportsAnimation;
  elements.playButton.textContent = isPlaying ? 'II' : '▶';
  elements.playButton.setAttribute('aria-label', t(isPlaying ? 'actions.pause' : 'actions.play'));
}

function scheduleDraw(): void {
  window.cancelAnimationFrame(activeAnimation);

  const draw = (now: number) => {
    const illusion = currentIllusion();
    const progress = illusion.supportsAnimation && isPlaying ? (now % WEBM_DURATION_MS) / WEBM_DURATION_MS : 0;
    renderFrame({
      width: PREVIEW_SIZE,
      height: PREVIEW_SIZE,
      time: now,
      progress
    });

    if (illusion.supportsAnimation && isPlaying && !isRecording) {
      activeAnimation = window.requestAnimationFrame(draw);
    }
  };

  activeAnimation = window.requestAnimationFrame(draw);
}

function renderFrame(frame: RenderFrame): void {
  currentIllusion().renderCanvas(ctx, state.params, frame);
}

async function handleWebmExport(): Promise<void> {
  const illusion = currentIllusion();

  if (!illusion.supportsAnimation || isRecording) {
    setStatus('export.webmUnavailable');
    return;
  }

  try {
    isRecording = true;
    elements.webmButton.disabled = true;
    setStatus('export.recording');
    window.cancelAnimationFrame(activeAnimation);
    await downloadWebM(elements.canvas, renderFrame, fileBaseName());
    setStatus('export.done');
  } catch {
    setStatus('export.webmUnavailable');
  } finally {
    isRecording = false;
    renderInfo(illusion);
    scheduleDraw();
  }
}

async function copyShareUrl(): Promise<void> {
  const shareUrl = stateToUrl(state);

  try {
    await navigator.clipboard.writeText(shareUrl);
    setStatus('export.copyDone');
  } catch {
    setStatus('export.copyFailed');
  }
}

function writeUrl(): void {
  history.replaceState(null, '', stateToSearch(state));
}

function currentIllusion(): IllusionDefinition {
  const illusion = getIllusion(state.illusionId) ?? illusions[0];

  if (illusion.id !== state.illusionId) {
    state = defaultState(navigator.languages);
  }

  return illusion;
}

function fileBaseName(): string {
  return createExportBaseName(state.illusionId, state.seed);
}

function setStatus(key: TranslationKey): void {
  elements.statusText.textContent = t(key);
}

function formatParamValue(control: ParamControl, value: unknown): string {
  if (control.kind === 'color') {
    return String(value);
  }

  if (control.kind === 'toggle') {
    return value === true ? t('param.on') : t('param.off');
  }

  const number = typeof value === 'number' ? value : control.defaultValue;
  return `${number}${control.unit ?? ''}`;
}

function must<T extends Element>(selector: string): T {
  const element = document.querySelector<T>(selector);

  if (!element) {
    throw new Error(`Missing element: ${selector}`);
  }

  return element;
}

function previewSizeKey(size: PreviewDisplaySize): TranslationKey {
  if (size === 'small') {
    return 'preview.sizeSmall';
  }

  if (size === 'large') {
    return 'preview.sizeLarge';
  }

  return 'preview.sizeMedium';
}
