import './styles.css';
import { LANGUAGE_NAMES, SUPPORTED_LANGUAGES, createTranslator, type SupportedLanguage, type TranslationKey } from './i18n';
import { downloadPng, downloadSvg, downloadWebM } from './exporters';
import { createExportBaseName } from './filenames';
import { illusions, getIllusion, getMediaForIllusion, getMediaGroup, mediaGroups, randomizeParams, type MediaId } from './illusions/registry';
import { illusionSummaries } from './illusionSummaries';
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
type PageId = 'home' | 'about' | 'explore';

const root = document.querySelector<HTMLDivElement>('#app');

if (!root) {
  throw new Error('App root was not found.');
}

let state = readStateFromUrl(window.location.search, navigator.languages);
let t = createTranslator(state.lang);
let activeAnimation = 0;
let isPlaying = true;
let isRecording = false;
let activePage = readPageFromHash();

root.innerHTML = `
  <header class="site-header" data-testid="site-header">
    <div class="site-header-inner">
      <a class="brand-link" href="#home" data-testid="brand-link" data-route-link="home">
        <svg class="brand-mark" aria-hidden="true" viewBox="0 0 64 64">
          <polygon class="brand-cube-top" points="19,14 41,14 52,25 30,25"></polygon>
          <polygon class="brand-cube-left" points="19,14 30,25 30,50 19,39"></polygon>
          <polygon class="brand-cube-front" points="30,25 52,25 52,50 30,50"></polygon>
          <path class="brand-cube-line" d="M19 14H41L52 25V50H30L19 39Z"></path>
          <path class="brand-cube-line" d="M19 14L30 25H52M30 25V50M19 39L30 50"></path>
        </svg>
        <span class="brand-text" data-i18n="app.title"></span>
      </a>
      <div class="site-header-actions">
        <nav class="site-nav" data-testid="site-nav" aria-label="Primary">
          <a href="#home" data-route-link="home" data-testid="nav-home" data-i18n="nav.home"></a>
          <a href="#about" data-route-link="about" data-testid="nav-about" data-i18n="nav.about"></a>
          <a href="#explore" data-route-link="explore" data-testid="nav-explore" data-i18n="nav.explore"></a>
          <button id="surpriseButton" class="nav-surprise-button" type="button" data-testid="surprise-button" data-i18n="actions.surprise"></button>
        </nav>
        <label class="language-picker header-language-picker">
          <span class="visually-hidden" data-i18n="language.label"></span>
          <select id="languageSelect" data-testid="language-select"></select>
        </label>
      </div>
    </div>
  </header>

  <main>
    <section id="homePage" class="page page-home" data-page="home" data-testid="home-page">
      <div class="app-header">
        <div class="title-block">
          <h1 data-i18n="app.title"></h1>
          <p class="app-description" data-i18n="app.description"></p>
        </div>
        <div class="header-controls">
          <label class="preview-size-picker">
            <span data-i18n="preview.size"></span>
            <select id="previewSizeSelect" data-testid="preview-size-select"></select>
          </label>
        </div>
      </div>

      <div class="app-shell">
        <aside class="control-panel" aria-labelledby="controlsTitle">
          <div class="section-heading">
            <h2 id="controlsTitle" data-i18n="controls.title"></h2>
          </div>

          <label class="field">
            <span data-i18n="controls.media"></span>
            <select id="mediaSelect" data-testid="media-select"></select>
          </label>

          <label class="field">
            <span data-i18n="controls.illusion"></span>
            <select id="illusionSelect" data-testid="illusion-select"></select>
          </label>

          <div class="button-grid">
            <button id="generateButton" class="primary-button" type="button" data-testid="generate-button" data-i18n="actions.generate"></button>
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
            <h3 data-i18n="stateCopy.title"></h3>
          </div>
          <div class="state-copy-grid" data-testid="state-copy-menu">
            <button id="copyStateButton" type="button" class="secondary-button" data-testid="copy-state-button" data-i18n="stateCopy.copy"></button>
          </div>
          <p id="statusText" class="status-text" data-testid="status-text" aria-live="polite"></p>
        </aside>

        <div class="workspace-column">
          <section class="preview-panel" aria-labelledby="previewTitle">
            <div class="preview-toolbar">
              <h2 id="previewTitle" data-i18n="preview.title"></h2>
              <div class="preview-actions">
                <button id="guideButton" type="button" class="guide-button" data-testid="guide-button"></button>
                <button id="playButton" type="button" class="icon-button" data-testid="play-button"></button>
              </div>
            </div>
            <div id="canvasWrap" class="canvas-wrap" data-testid="canvas-wrap">
              <canvas id="illusionCanvas" width="${PREVIEW_SIZE}" height="${PREVIEW_SIZE}" data-testid="illusion-canvas"></canvas>
            </div>
          </section>

          <section class="info-panel" aria-labelledby="infoTitle" data-testid="info-panel">
            <p id="motionWarning" class="motion-warning" data-testid="motion-warning"></p>
            <div class="about-block" data-testid="about-block">
              <h2 id="infoTitle" data-i18n="info.title"></h2>
              <div id="illusionDescription" class="illusion-description" data-testid="illusion-description"></div>
            </div>
          </section>
        </div>
      </div>
    </section>

    <section id="aboutPage" class="page content-page" data-page="about" data-testid="about-page" hidden>
      <div class="content-hero">
        <p class="eyebrow" data-i18n="about.eyebrow"></p>
        <h1 data-i18n="about.title"></h1>
        <p data-i18n="about.lead"></p>
      </div>
      <div class="content-copy">
        <p data-i18n="about.body1"></p>
        <p data-i18n="about.body2"></p>
      </div>
      <div class="content-section">
        <h2 data-i18n="about.illusionListTitle"></h2>
        <div id="aboutIllusionList" class="grouped-list" data-testid="about-illusion-list"></div>
      </div>
    </section>

    <section id="explorePage" class="page content-page" data-page="explore" data-testid="explore-page" hidden>
      <div class="content-hero">
        <p class="eyebrow" data-i18n="explore.eyebrow"></p>
        <h1 data-i18n="explore.title"></h1>
        <p data-i18n="explore.lead"></p>
      </div>
      <div id="exploreGrid" class="explore-grid" data-testid="explore-grid"></div>
    </section>
  </main>

  <footer class="app-footer">
    <div class="footer-inner">
      <div>
        <p data-i18n="footer.description"></p>
      </div>
      <a id="githubLink" data-testid="github-link" href="${GITHUB_REPOSITORY_URL}" target="_blank" rel="noreferrer" data-i18n="footer.github"></a>
    </div>
  </footer>
`;

const elements = {
  languageSelect: must<HTMLSelectElement>('#languageSelect'),
  mediaSelect: must<HTMLSelectElement>('#mediaSelect'),
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
  copyStateButton: must<HTMLButtonElement>('#copyStateButton'),
  statusText: must<HTMLParagraphElement>('#statusText'),
  guideButton: must<HTMLButtonElement>('#guideButton'),
  playButton: must<HTMLButtonElement>('#playButton'),
  canvasWrap: must<HTMLDivElement>('#canvasWrap'),
  canvas: must<HTMLCanvasElement>('#illusionCanvas'),
  description: must<HTMLDivElement>('#illusionDescription'),
  motionWarning: must<HTMLParagraphElement>('#motionWarning'),
  homePage: must<HTMLElement>('#homePage'),
  aboutPage: must<HTMLElement>('#aboutPage'),
  explorePage: must<HTMLElement>('#explorePage'),
  aboutIllusionList: must<HTMLDivElement>('#aboutIllusionList'),
  exploreGrid: must<HTMLDivElement>('#exploreGrid'),
  siteNav: must<HTMLElement>('.site-nav')
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
  window.addEventListener('hashchange', () => {
    activePage = readPageFromHash();
    renderPage();
  });

  root!.addEventListener('click', (event) => {
    const target = event.target instanceof Element ? event.target : null;
    const routeLink = target?.closest<HTMLElement>('[data-route-link]');
    const illusionLink = target?.closest<HTMLElement>('[data-illusion-link]');

    if (illusionLink) {
      event.preventDefault();
      openIllusionFromLink(illusionLink.dataset.illusionLink ?? '');
      return;
    }

    if (routeLink) {
      event.preventDefault();
      setActivePage(routeLink.dataset.routeLink as PageId, true);
    }
  });

  elements.languageSelect.addEventListener('change', () => {
    state = { ...state, lang: elements.languageSelect.value as SupportedLanguage };
    t = createTranslator(state.lang);
    renderAll();
    writeUrl();
  });

  elements.mediaSelect.addEventListener('change', () => {
    const media = getMediaGroup(elements.mediaSelect.value as MediaId);
    const illusion = media.groups[0].illusions[0];
    state = {
      ...state,
      illusionId: illusion.id,
      params: { ...illusion.defaultParams }
    };
    isPlaying = true;
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
    const shouldPushHome = activePage !== 'home';
    state = {
      ...state,
      illusionId: illusion.id,
      seed,
      params: randomizeParams(illusion, seed)
    };
    activePage = 'home';
    isPlaying = true;
    renderAll();
    writeUrl(shouldPushHome);
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
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

  elements.copyStateButton.addEventListener('click', () => {
    void copyStateAddress();
  });

  elements.playButton.addEventListener('click', () => {
    isPlaying = !isPlaying;
    renderPlayState();
    scheduleDraw();
  });

  elements.guideButton.addEventListener('click', () => {
    toggleGuide();
  });
}

function renderAll(): void {
  const illusion = currentIllusion();
  document.documentElement.lang = state.lang;
  document.title = `${t(illusion.titleKey as TranslationKey)} - ${t('app.title')}`;
  applyTranslations();
  populateMediaSelect();
  populateIllusionSelect();
  populatePreviewSizeSelect();
  renderStateFields();
  renderParamControls(illusion);
  renderGuideButton(illusion);
  renderInfo(illusion);
  renderPlayState();
  renderContentPages();
  renderPage();
  scheduleDraw();
}

function applyTranslations(): void {
  for (const node of document.querySelectorAll<HTMLElement>('[data-i18n]')) {
    node.textContent = t(node.dataset.i18n as TranslationKey);
  }

  setStatus('export.done');
  elements.siteNav.setAttribute('aria-label', t('nav.ariaLabel'));
}

function populateLanguageSelect(): void {
  elements.languageSelect.replaceChildren(...SUPPORTED_LANGUAGES.map((language) => {
    const option = document.createElement('option');
    option.value = language;
    option.textContent = LANGUAGE_NAMES[language];
    return option;
  }));
}

function populateMediaSelect(): void {
  elements.mediaSelect.replaceChildren(...mediaGroups.map((media) => {
    const option = document.createElement('option');
    option.value = media.id;
    option.textContent = t(media.titleKey as TranslationKey);
    return option;
  }));
}

function populateIllusionSelect(): void {
  const fragment = document.createDocumentFragment();
  const media = getMediaForIllusion(state.illusionId);

  for (const group of media.groups) {
    const optgroup = document.createElement('optgroup');
    optgroup.label = t(group.titleKey as TranslationKey);

    for (const illusion of group.illusions) {
      const option = document.createElement('option');
      option.value = illusion.id;
      option.textContent = t(illusion.titleKey as TranslationKey);
      optgroup.append(option);
    }

    fragment.append(optgroup);
  }

  elements.illusionSelect.replaceChildren(fragment);
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
  elements.mediaSelect.value = getMediaForIllusion(state.illusionId).id;
  elements.illusionSelect.value = state.illusionId;
  elements.seedInput.value = state.seed;
  elements.seedLockInput.checked = state.seedLocked;
  elements.previewSizeSelect.value = state.view;
  renderPreviewDisplaySize();
}

function renderParamControls(illusion: IllusionDefinition): void {
  const fragment = document.createDocumentFragment();

  for (const control of illusion.paramSchema) {
    if (control.key === 'showGuide') {
      continue;
    }

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

function toggleGuide(): void {
  const illusion = currentIllusion();

  if (!hasGuideControl(illusion)) {
    return;
  }

  state = {
    ...state,
    params: sanitizeParams(illusion, {
      ...state.params,
      showGuide: state.params.showGuide !== true
    })
  };
  renderGuideButton(illusion);
  writeUrl();
  scheduleDraw();
}

function renderGuideButton(illusion: IllusionDefinition): void {
  const hasGuide = hasGuideControl(illusion);
  const pressed = state.params.showGuide === true;

  elements.guideButton.hidden = !hasGuide;
  elements.guideButton.textContent = t('param.showGuide');
  elements.guideButton.setAttribute('aria-label', t('param.showGuide'));
  elements.guideButton.setAttribute('aria-pressed', String(pressed));
  elements.guideButton.classList.toggle('is-active', pressed);
}

function hasGuideControl(illusion: IllusionDefinition): boolean {
  return illusion.paramSchema.some((control) => control.key === 'showGuide' && control.kind === 'toggle');
}

function renderInfo(illusion: IllusionDefinition): void {
  renderIllusionDescription(illusion);
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

  draw(window.performance.now());
}

function renderPage(): void {
  const pages: Record<PageId, HTMLElement> = {
    home: elements.homePage,
    about: elements.aboutPage,
    explore: elements.explorePage
  };

  for (const [page, element] of Object.entries(pages) as Array<[PageId, HTMLElement]>) {
    element.hidden = page !== activePage;
  }

  for (const link of document.querySelectorAll<HTMLElement>('[data-route-link]')) {
    const isCurrent = link.dataset.routeLink === activePage;
    link.classList.toggle('is-active', isCurrent);
    link.setAttribute('aria-current', isCurrent ? 'page' : 'false');
  }

  renderDocumentTitle();

  if (activePage === 'home') {
    scheduleDraw();
  }
}

function renderDocumentTitle(): void {
  if (activePage === 'about') {
    document.title = `${t('nav.about')} - ${t('app.title')}`;
    return;
  }

  if (activePage === 'explore') {
    document.title = `${t('nav.explore')} - ${t('app.title')}`;
    return;
  }

  document.title = `${t(currentIllusion().titleKey as TranslationKey)} - ${t('app.title')}`;
}

function renderContentPages(): void {
  renderAboutIllusionList();
  renderExploreGrid();
}

function renderAboutIllusionList(): void {
  const fragment = document.createDocumentFragment();

  for (const media of mediaGroups) {
    const mediaSection = document.createElement('section');
    mediaSection.className = 'content-group';
    const mediaTitle = document.createElement('h3');
    mediaTitle.textContent = t(media.titleKey as TranslationKey);
    mediaSection.append(mediaTitle);

    for (const group of media.groups) {
      const groupBlock = document.createElement('div');
      groupBlock.className = 'summary-group';
      const groupTitle = document.createElement('h4');
      groupTitle.textContent = t(group.titleKey as TranslationKey);
      const list = document.createElement('ul');

      for (const illusion of group.illusions) {
        const item = document.createElement('li');
        const title = document.createElement('strong');
        title.textContent = t(illusion.titleKey as TranslationKey);
        const description = document.createElement('span');
        description.textContent = `: ${shortIllusionDescription(illusion)}`;
        item.append(title, description);
        list.append(item);
      }

      groupBlock.append(groupTitle, list);
      mediaSection.append(groupBlock);
    }

    fragment.append(mediaSection);
  }

  elements.aboutIllusionList.replaceChildren(fragment);
}

function renderExploreGrid(): void {
  const fragment = document.createDocumentFragment();

  for (const media of mediaGroups) {
    const mediaSection = document.createElement('section');
    mediaSection.className = 'content-group';
    const mediaTitle = document.createElement('h2');
    mediaTitle.textContent = t(media.titleKey as TranslationKey);
    mediaSection.append(mediaTitle);

    for (const group of media.groups) {
      const groupSection = document.createElement('section');
      groupSection.className = 'explore-group';
      const groupTitle = document.createElement('h3');
      groupTitle.textContent = t(group.titleKey as TranslationKey);
      const cards = document.createElement('div');
      cards.className = 'thumbnail-grid';

      for (const illusion of group.illusions) {
        cards.append(renderExploreCard(illusion));
      }

      groupSection.append(groupTitle, cards);
      mediaSection.append(groupSection);
    }

    fragment.append(mediaSection);
  }

  elements.exploreGrid.replaceChildren(fragment);
}

function renderExploreCard(illusion: IllusionDefinition): HTMLAnchorElement {
  const card = document.createElement('a');
  const title = t(illusion.titleKey as TranslationKey);
  card.className = 'illusion-card';
  card.href = `${stateToSearch({
    ...state,
    illusionId: illusion.id,
    params: { ...illusion.defaultParams }
  })}#home`;
  card.dataset.illusionLink = illusion.id;
  card.dataset.testid = `explore-card-${illusion.id}`;
  card.setAttribute('aria-label', t('explore.openLabel', { title }));

  const canvas = document.createElement('canvas');
  canvas.width = 220;
  canvas.height = 220;
  canvas.className = 'thumbnail-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  drawThumbnail(canvas, illusion);

  const body = document.createElement('span');
  body.className = 'illusion-card-body';
  const heading = document.createElement('strong');
  heading.textContent = title;
  body.append(heading);

  card.append(canvas, body);
  return card;
}

function drawThumbnail(canvas: HTMLCanvasElement, illusion: IllusionDefinition): void {
  const thumbnailContext = canvas.getContext('2d');

  if (!thumbnailContext) {
    return;
  }

  illusion.renderCanvas(thumbnailContext, illusion.defaultParams, {
    width: canvas.width,
    height: canvas.height,
    time: 0,
    progress: illusion.supportsAnimation ? 0.33 : 0
  });
}

function shortIllusionDescription(illusion: IllusionDefinition): string {
  const summary = illusionSummaries[state.lang]?.[illusion.id];

  if (summary) {
    return summary;
  }

  return t(illusion.descriptionKey as TranslationKey)
    .split(/\n{2,}/)[0]
    .trim();
}

function openIllusionFromLink(illusionId: string): void {
  const illusion = getIllusion(illusionId);

  if (!illusion) {
    return;
  }

  state = {
    ...state,
    illusionId: illusion.id,
    params: { ...illusion.defaultParams }
  };
  isPlaying = true;
  setActivePage('home', true);
  renderAll();
  writeUrl();
  window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
}

function setActivePage(page: PageId, push: boolean): void {
  activePage = isPageId(page) ? page : 'home';
  const nextUrl = `${stateToSearch(state)}${pageHash(activePage)}`;

  if (push) {
    history.pushState(null, '', nextUrl);
  } else {
    history.replaceState(null, '', nextUrl);
  }

  renderPage();
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

async function copyStateAddress(): Promise<void> {
  const stateAddress = stateToUrl(state);

  try {
    await navigator.clipboard.writeText(stateAddress);
    setStatus('export.copyDone');
  } catch {
    setStatus('export.copyFailed');
  }
}

function writeUrl(push = false): void {
  const nextUrl = `${stateToSearch(state)}${pageHash(activePage)}`;

  if (push) {
    history.pushState(null, '', nextUrl);
    return;
  }

  history.replaceState(null, '', nextUrl);
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

function renderIllusionDescription(illusion: IllusionDefinition): void {
  const paragraphs = t(illusion.descriptionKey as TranslationKey)
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
  const nodes = paragraphs.map((paragraph) => {
    const node = document.createElement('p');
    node.textContent = paragraph;
    return node;
  });

  elements.description.replaceChildren(...nodes);
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

function readPageFromHash(): PageId {
  const page = window.location.hash.replace(/^#/, '');
  return isPageId(page) ? page : 'home';
}

function isPageId(value: string): value is PageId {
  return value === 'home' || value === 'about' || value === 'explore';
}

function pageHash(page: PageId): string {
  return page === 'home' ? '' : `#${page}`;
}
