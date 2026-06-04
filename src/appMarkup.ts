import { PREVIEW_SIZE } from './types';

export function renderAppShell(repositoryUrl: string): string {
  return `
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
      <a id="githubLink" data-testid="github-link" href="${repositoryUrl}" target="_blank" rel="noreferrer" data-i18n="footer.github"></a>
    </div>
  </footer>
`;;
}
