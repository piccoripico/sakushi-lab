import { expect, test, type Page } from '@playwright/test';

const ILLUSION_IDS = [
  'cafe-wall',
  'hermann-grid',
  'muller-lyer',
  'ponzo',
  'poggendorff',
  'zollner',
  'hering',
  'vertical-horizontal',
  'ebbinghaus',
  'delboeuf',
  'sander-parallelogram',
  'kanizsa-triangle',
  'rubin-vase',
  'simultaneous-contrast',
  'whites-illusion',
  'cornsweet',
  'lilac-chaser',
  'rotating-necker-cube'
] as const;

const STATIC_IDS = ILLUSION_IDS.slice(0, 16);
const VIDEO_IDS = [
  'lilac-chaser',
  'rotating-necker-cube'
] as const;
const VIDEO_ID_SET = new Set<string>(VIDEO_IDS);

test.describe('Sakushi Lab', () => {
  test('starts in the browser language and draws a nonblank canvas', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Sakushi Lab');
    await expect(page.getByText('Classic perception experiments')).toHaveCount(0);
    await expect(page.getByText('Explore how easily illusions appear')).toBeVisible();
    await page.getByTestId('language-select').selectOption('ja');
    await expect(page.locator('.app-description')).not.toBeEmpty();
    await page.getByTestId('language-select').selectOption('en');
    await expect(page.getByTestId('media-select')).toHaveValue('static');
    await expect(page.getByTestId('illusion-select')).toHaveValue('cafe-wall');
    await expect(page.getByTestId('illusion-canvas')).toBeVisible();
    await page.waitForFunction(() => {
      const canvas = document.querySelector<HTMLCanvasElement>('[data-testid="illusion-canvas"]');
      const ctx = canvas?.getContext('2d');

      if (!canvas || !ctx) {
        return false;
      }

      const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const colors = new Set<string>();

      for (let index = 0; index < data.length; index += 4 * 350) {
        colors.add(`${data[index]},${data[index + 1]},${data[index + 2]},${data[index + 3]}`);
      }

      return colors.size > 4;
    });
    expect(await canvasStats(page)).toMatchObject({ nonBlank: true });
    await expect(page.getByTestId('github-link')).toHaveAttribute(
      'href',
      'https://github.com/piccoripico/sakushi-lab'
    );
  });

test('switches through all 18 illusions and keeps the canvas painted', async ({ page }) => {
    await page.goto('/');

    for (const id of ILLUSION_IDS) {
      await selectIllusion(page, id);
      await page.waitForTimeout(120);
      expect(await canvasStats(page), id).toMatchObject({ nonBlank: true });
    }
  });

  test('renders detailed multi-paragraph illusion descriptions and updates them', async ({ page }) => {
    await page.goto('/');
    const description = page.getByTestId('illusion-description');

    await expect(description.locator('p')).toHaveCount(3);
    await expect(description).toContainText('tiles');
    await expect(description).toContainText('mortar');
    const cafeDescription = await description.innerText();

    await selectIllusion(page, 'muller-lyer');
    await expect(description.locator('p')).toHaveCount(3);
    await expect(description).toContainText('arrow');
    await expect(description).toContainText('square grid');
    expect(await description.innerText()).not.toBe(cafeDescription);
  });

  test('uses media select and subgrouped illusion options', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByTestId('media-select')).toHaveValue('static');
    expect(await optionGroups(page)).toEqual([
      {
        label: 'Geometry / form',
        values: STATIC_IDS.slice(0, 12)
      },
      {
        label: 'Figure / ground',
        values: STATIC_IDS.slice(12, 13)
      },
      {
        label: 'Color / brightness',
        values: STATIC_IDS.slice(13, 16)
      }
    ]);

    await page.getByTestId('media-select').selectOption('video');
    await expect(page.getByTestId('illusion-select')).toHaveValue('lilac-chaser');
    expect(await optionGroups(page)).toEqual([
      {
        label: 'Motion / afterimage patterns',
        values: VIDEO_IDS.slice(0, 1)
      },
      {
        label: 'Reversible depth',
        values: VIDEO_IDS.slice(1)
      }
    ]);

    await page.getByTestId('media-select').selectOption('static');
    await expect(page.getByTestId('illusion-select')).toHaveValue('cafe-wall');
  });

  test('uses a shared header with Home, About, and Explore pages', async ({ page, context }) => {
    await page.goto('/');

    await expect(page.getByTestId('site-header')).toBeVisible();
    await expect(page.getByTestId('brand-link')).toContainText('Sakushi Lab');
    await expect(page.getByTestId('nav-home')).toHaveText('Home');
    await expect(page.getByTestId('nav-about')).toHaveText('About');
    await expect(page.getByTestId('nav-explore')).toHaveText('Explore');

    const headerLayout = await page.evaluate(() => {
      const brand = document.querySelector('[data-testid="brand-link"]')!.getBoundingClientRect();
      const nav = document.querySelector('[data-testid="site-nav"]')!.getBoundingClientRect();
      const actions = document.querySelector('.site-header-actions')!.getBoundingClientRect();
      const language = document.querySelector('[data-testid="language-select"]')!.getBoundingClientRect();
      const explore = document.querySelector('[data-testid="nav-explore"]')!.getBoundingClientRect();
      const surprise = document.querySelector('[data-testid="surprise-button"]')!.getBoundingClientRect();
      return {
        navRightAligned: nav.right > brand.right,
        actionsRightAligned: actions.right > brand.right,
        noOverlap: brand.right <= actions.left || brand.bottom <= actions.top,
        languageInActions: language.left >= actions.left - 1 && language.right <= actions.right + 1,
        languageRightmost: language.left >= nav.right - 1,
        surpriseAfterExplore: surprise.left >= explore.right - 1
      };
    });
    expect(headerLayout.navRightAligned).toBe(true);
    expect(headerLayout.actionsRightAligned).toBe(true);
    expect(headerLayout.noOverlap).toBe(true);
    expect(headerLayout.languageInActions).toBe(true);
    expect(headerLayout.languageRightmost).toBe(true);
    expect(headerLayout.surpriseAfterExplore).toBe(true);

    await page.getByTestId('nav-about').click();
    await expect(page).toHaveURL(/#about$/);
    await expect(page.getByTestId('about-page')).toBeVisible();
    await expect(page.getByTestId('home-page')).toBeHidden();
    await expect(page.getByTestId('github-link')).toBeVisible();
    await expect(page.getByTestId('about-illusion-list').locator('li')).toHaveCount(ILLUSION_IDS.length);
    await expect(page.getByTestId('about-illusion-list')).toContainText('staggered tiles make parallel lines look tilted.');
    await expect(page.getByTestId('about-illusion-list')).toContainText('Café Wall');

    await page.getByTestId('nav-explore').click();
    await expect(page).toHaveURL(/#explore$/);
    await expect(page.getByTestId('explore-page')).toBeVisible();
    await expect(page.locator('[data-illusion-link]')).toHaveCount(ILLUSION_IDS.length);
    await expect(page.getByTestId('explore-card-rotating-necker-cube')).toBeVisible();
    await expect(page.getByTestId('explore-card-cafe-wall').locator('.illusion-card-body span')).toHaveCount(0);
    const rotatingHref = await page.getByTestId('explore-card-rotating-necker-cube').getAttribute('href');
    expect(rotatingHref).toContain('i=rotating-necker-cube');
    expect(rotatingHref).toContain('#home');
    const newTab = await context.newPage();
    await newTab.goto(new URL(rotatingHref ?? '', page.url()).toString());
    await expect(newTab.getByTestId('home-page')).toBeVisible();
    await expect(newTab.getByTestId('illusion-select')).toHaveValue('rotating-necker-cube');
    await newTab.close();

    await page.evaluate(() => window.scrollTo(0, 500));
    await page.getByTestId('explore-card-rotating-necker-cube').click();
    await expect(page.getByTestId('home-page')).toBeVisible();
    await expect(page.getByTestId('media-select')).toHaveValue('video');
    await expect(page.getByTestId('illusion-select')).toHaveValue('rotating-necker-cube');
    expect(await page.evaluate(() => window.scrollY)).toBe(0);
  });

  test('places the guide toggle in the preview toolbar instead of parameter controls', async ({ page }) => {
    await page.goto('/');
    await selectIllusion(page, 'cafe-wall');

    const guideButton = page.getByTestId('guide-button');
    await expect(guideButton).toBeVisible();
    await expect(guideButton).toHaveText('Guide');
    await expect(guideButton).toHaveAttribute('aria-pressed', 'false');
    await expect(page.getByTestId('param-controls').getByTestId('param-showGuide')).toHaveCount(0);

    const placement = await page.evaluate(() => {
      const preview = document.querySelector('.preview-panel')!.getBoundingClientRect();
      const toolbar = document.querySelector('.preview-toolbar')!.getBoundingClientRect();
      const guide = document.querySelector('[data-testid="guide-button"]')!.getBoundingClientRect();

      return {
        inToolbar: guide.top >= toolbar.top - 1 && guide.bottom <= toolbar.bottom + 1,
        nearPreviewRight: preview.right - guide.right < 24,
        nearPreviewTop: guide.top - preview.top < 24
      };
    });

    expect(placement).toEqual({
      inToolbar: true,
      nearPreviewRight: true,
      nearPreviewTop: true
    });

    const withoutGuide = await canvasSignature(page);
    await guideButton.click();
    await expect(guideButton).toHaveAttribute('aria-pressed', 'true');
    await page.waitForFunction((previous) => {
      const canvas = document.querySelector<HTMLCanvasElement>('[data-testid="illusion-canvas"]');
      return canvas?.toDataURL() !== previous;
    }, withoutGuide);
    expect(await canvasSignature(page)).not.toBe(withoutGuide);
  });

  test('keeps Guide off initially and resets it after Generate or Surprise', async ({ page }) => {
    await page.goto('/');
    await selectIllusion(page, 'cafe-wall');

    await expectGuideVisible(page, false);

    await setGuideVisible(page, true);
    await page.getByTestId('generate-button').click();
    await expectGuideVisible(page, false);

    await setGuideVisible(page, true);
    await page.getByTestId('surprise-button').click();
    await expectGuideVisible(page, false);
  });

  test('generates, changes the URL, and reproduces the same state from that URL', async ({ page }) => {
    await page.goto('/');
    const originalUrl = page.url();
    const originalSignature = await canvasSignature(page);

    await page.getByTestId('generate-button').click();
    const randomizedUrl = page.url();
    const randomizedSignature = await canvasSignature(page);

    expect(randomizedUrl).not.toBe(originalUrl);
    expect(randomizedUrl).toContain('lang=en&i=cafe-wall&seed=');
    expect(randomizedSignature).not.toBe(originalSignature);

    await page.goto(randomizedUrl);
    expect(await canvasSignature(page)).toBe(randomizedSignature);
  });

  test('uses collapsible seed controls for generate behavior', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('button', { name: 'Generate' })).toBeVisible();
    await expect(page.getByText('Randomize')).toHaveCount(0);
    await expect(page.getByText('Lock seed')).toHaveCount(0);

    const order = await page.evaluate(() => {
      const generate = document.querySelector('[data-testid="generate-button"]')!.getBoundingClientRect();
      const surprise = document.querySelector('[data-testid="surprise-button"]')!.getBoundingClientRect();
      const seedPanel = document.querySelector('[data-testid="seed-panel"]')!.getBoundingClientRect();
      const controls = document.querySelector('.control-panel')!.getBoundingClientRect();

      return {
        generateBeforeSeed: generate.bottom <= seedPanel.top + 2,
        surpriseInHeader: surprise.bottom <= controls.top + 2
      };
    });
    expect(order.generateBeforeSeed).toBe(true);
    expect(order.surpriseInHeader).toBe(true);

    await expect(page.getByTestId('seed-panel')).not.toHaveAttribute('open', '');
    await expect(page.getByTestId('seed-input')).not.toBeVisible();
    await page.getByTestId('seed-panel').locator('summary').click();
    await expect(page.getByTestId('seed-input')).toBeVisible();
    await expect(page.getByText('Seed (parameter generation ID)')).toBeVisible();
    await expect(page.getByText('Do not randomly fill seed')).toBeVisible();
    await expect(page.getByTestId('seed-lock-input')).not.toBeChecked();

    const seed = await page.getByTestId('seed-input').inputValue();

    await page.getByTestId('generate-button').click();
    await expect(page.getByTestId('seed-input')).not.toHaveValue(seed);
    const generatedSeed = await page.getByTestId('seed-input').inputValue();

    await page.getByTestId('seed-lock-input').check();
    await page.getByTestId('generate-button').click();
    await expect(page.getByTestId('seed-input')).toHaveValue(generatedSeed);
    expect(page.url()).toContain('lock=1');
  });

  test('lets Cafe Wall show only the square-grid guide overlay', async ({ page }) => {
    await page.goto('/');
    await selectIllusion(page, 'cafe-wall');

    await expectGuideVisible(page, false);
    const withoutGuide = await canvasSignature(page);

    await setGuideVisible(page, true);
    await expectGuideVisible(page, true);
    await page.waitForFunction((previous) => {
      const canvas = document.querySelector<HTMLCanvasElement>('[data-testid="illusion-canvas"]');
      return canvas?.toDataURL() !== previous;
    }, withoutGuide);
    const withGuide = await canvasSignature(page);
    expect(withGuide).not.toBe(withoutGuide);

    await setRangeParam(page, 'offset', '0.72');
    await page.waitForFunction((previous) => {
      const canvas = document.querySelector<HTMLCanvasElement>('[data-testid="illusion-canvas"]');
      return canvas?.toDataURL() !== previous;
    }, withGuide);
    expect(await canvasSignature(page)).not.toBe(withGuide);
  });

  test('keeps the Muller-Lyer square-grid overlay off by default', async ({ page }) => {
    await page.goto('/');
    await selectIllusion(page, 'muller-lyer');

    await expectGuideVisible(page, false);
    const withoutGuide = await canvasSignature(page);

    await setGuideVisible(page, true);
    await expectGuideVisible(page, true);
    await page.waitForFunction((previous) => {
      const canvas = document.querySelector<HTMLCanvasElement>('[data-testid="illusion-canvas"]');
      return canvas?.toDataURL() !== previous;
    }, withoutGuide);
    expect(await canvasSignature(page)).not.toBe(withoutGuide);
  });

  test('lets Hermann Grid mark every intersection without drawing real dots', async ({ page }) => {
    await page.goto('/');
    await selectIllusion(page, 'hermann-grid');

    await expect(page.getByTestId('illusion-select')).toContainText('Hermann Grid');
    await expect(page.getByTestId('param-dotRadius')).toHaveCount(0);
    await expect(page.getByTestId('param-dotOpacity')).toHaveCount(0);
    await expectGuideVisible(page, false);
    const withoutGuide = await canvasSignature(page);

    await setGuideVisible(page, true);
    await expectGuideVisible(page, true);
    await page.waitForFunction((previous) => {
      const canvas = document.querySelector<HTMLCanvasElement>('[data-testid="illusion-canvas"]');
      return canvas?.toDataURL() !== previous;
    }, withoutGuide);
    const withGuide = await canvasSignature(page);
    expect(withGuide).not.toBe(withoutGuide);

    await setRangeParam(page, 'gridCount', '14');
    await page.waitForFunction((previous) => {
      const canvas = document.querySelector<HTMLCanvasElement>('[data-testid="illusion-canvas"]');
      return canvas?.toDataURL() !== previous;
    }, withGuide);
    expect(await canvasSignature(page)).not.toBe(withGuide);
  });

  test('keeps the Vertical-Horizontal square-grid overlay off by default', async ({ page }) => {
    await page.goto('/');
    await selectIllusion(page, 'vertical-horizontal');

    await expectGuideVisible(page, false);
    const withoutGuide = await canvasSignature(page);

    await setGuideVisible(page, true);
    await expectGuideVisible(page, true);
    await page.waitForFunction((previous) => {
      const canvas = document.querySelector<HTMLCanvasElement>('[data-testid="illusion-canvas"]');
      return canvas?.toDataURL() !== previous;
    }, withoutGuide);
    expect(await canvasSignature(page)).not.toBe(withoutGuide);
  });

  test('lets Poggendorff reveal the hidden straight continuation', async ({ page }) => {
    await page.goto('/');
    await selectIllusion(page, 'poggendorff');

    await expect(page.getByTestId('param-showOccluder')).toBeChecked();
    await expectGuideVisible(page, false);
    const occluded = await canvasSignature(page);

    await setGuideVisible(page, true);
    await expectGuideVisible(page, true);
    await page.waitForFunction((previous) => {
      const canvas = document.querySelector<HTMLCanvasElement>('[data-testid="illusion-canvas"]');
      return canvas?.toDataURL() !== previous;
    }, occluded);
    const withGuide = await canvasSignature(page);
    expect(withGuide).not.toBe(occluded);

    await page.getByTestId('param-showOccluder').uncheck();
    await expect(page.getByTestId('param-showOccluder')).not.toBeChecked();
    await page.waitForFunction((previous) => {
      const canvas = document.querySelector<HTMLCanvasElement>('[data-testid="illusion-canvas"]');
      return canvas?.toDataURL() !== previous;
    }, withGuide);
    expect(await canvasSignature(page)).not.toBe(withGuide);
  });

  test('lets Ponzo show only the square-grid guide overlay', async ({ page }) => {
    await page.goto('/');
    await selectIllusion(page, 'ponzo');

    await expect(page.getByTestId('param-showTargets')).toBeChecked();
    await expect(page.getByTestId('param-showDepthGuides')).toBeChecked();
    await expectGuideVisible(page, false);
    const withoutGuide = await canvasSignature(page);

    await setGuideVisible(page, true);
    await expectGuideVisible(page, true);
    await page.waitForFunction((previous) => {
      const canvas = document.querySelector<HTMLCanvasElement>('[data-testid="illusion-canvas"]');
      return canvas?.toDataURL() !== previous;
    }, withoutGuide);
    const withGuide = await canvasSignature(page);
    expect(withGuide).not.toBe(withoutGuide);

    await page.getByTestId('param-showDepthGuides').uncheck();
    await expect(page.getByTestId('param-showDepthGuides')).not.toBeChecked();
    await page.waitForFunction((previous) => {
      const canvas = document.querySelector<HTMLCanvasElement>('[data-testid="illusion-canvas"]');
      return canvas?.toDataURL() !== previous;
    }, withGuide);
    expect(await canvasSignature(page)).not.toBe(withGuide);
  });

  test('lets Hering show only the square-grid guide overlay', async ({ page }) => {
    await page.goto('/');
    await selectIllusion(page, 'hering');

    await expect(page.getByTestId('param-showContext')).toBeChecked();
    await expectGuideVisible(page, false);
    const withContext = await canvasSignature(page);

    await setGuideVisible(page, true);
    await expectGuideVisible(page, true);
    await page.waitForFunction((previous) => {
      const canvas = document.querySelector<HTMLCanvasElement>('[data-testid="illusion-canvas"]');
      return canvas?.toDataURL() !== previous;
    }, withContext);
    const withGuide = await canvasSignature(page);
    expect(withGuide).not.toBe(withContext);

    await page.getByTestId('param-showContext').uncheck();
    await expect(page.getByTestId('param-showContext')).not.toBeChecked();
    await page.waitForFunction((previous) => {
      const canvas = document.querySelector<HTMLCanvasElement>('[data-testid="illusion-canvas"]');
      return canvas?.toDataURL() !== previous;
    }, withGuide);
    expect(await canvasSignature(page)).not.toBe(withGuide);
  });

  test('lets Zollner compare tilted appearance against the square-grid overlay', async ({ page }) => {
    await page.goto('/');
    await selectIllusion(page, 'zollner');

    await expect(page.getByTestId('param-showContext')).toBeChecked();
    await expectGuideVisible(page, false);
    const withContext = await canvasSignature(page);

    await setGuideVisible(page, true);
    await expectGuideVisible(page, true);
    await page.waitForFunction((previous) => {
      const canvas = document.querySelector<HTMLCanvasElement>('[data-testid="illusion-canvas"]');
      return canvas?.toDataURL() !== previous;
    }, withContext);
    const withGuide = await canvasSignature(page);
    expect(withGuide).not.toBe(withContext);

    await setRangeParam(page, 'angle', '70');
    await page.waitForFunction((previous) => {
      const canvas = document.querySelector<HTMLCanvasElement>('[data-testid="illusion-canvas"]');
      return canvas?.toDataURL() !== previous;
    }, withGuide);
    const changedGuide = await canvasSignature(page);
    expect(changedGuide).not.toBe(withGuide);

    await page.getByTestId('param-showContext').uncheck();
    await expect(page.getByTestId('param-showContext')).not.toBeChecked();
    await page.waitForFunction((previous) => {
      const canvas = document.querySelector<HTMLCanvasElement>('[data-testid="illusion-canvas"]');
      return canvas?.toDataURL() !== previous;
    }, changedGuide);
    expect(await canvasSignature(page)).not.toBe(changedGuide);
  });






  test('lets Sander Parallelogram show only the square-grid guide overlay', async ({ page }) => {
    await page.goto('/');
    await selectIllusion(page, 'sander-parallelogram');

    await expect(page.getByTestId('param-showContext')).toBeChecked();
    await expect(page.getByTestId('param-showTargets')).toBeChecked();
    await expectGuideVisible(page, false);
    const withContext = await canvasSignature(page);

    await page.getByTestId('param-showContext').uncheck();
    await expect(page.getByTestId('param-showContext')).not.toBeChecked();
    await page.waitForFunction((previous) => {
      const canvas = document.querySelector<HTMLCanvasElement>('[data-testid="illusion-canvas"]');
      return canvas?.toDataURL() !== previous;
    }, withContext);
    const withoutContext = await canvasSignature(page);
    expect(withoutContext).not.toBe(withContext);

    await setGuideVisible(page, true);
    await expectGuideVisible(page, true);
    await page.waitForFunction((previous) => {
      const canvas = document.querySelector<HTMLCanvasElement>('[data-testid="illusion-canvas"]');
      return canvas?.toDataURL() !== previous;
    }, withoutContext);
    expect(await canvasSignature(page)).not.toBe(withoutContext);
  });

  test('lets Kanizsa Triangle mark implied contours and blank edge probes', async ({ page }) => {
    await page.goto('/');
    await selectIllusion(page, 'kanizsa-triangle');

    await expect(page.getByTestId('param-dotRadius')).toBeVisible();
    await expect(page.getByTestId('param-gap')).toHaveCount(0);
    await expect(page.getByTestId('param-cornerLength')).toHaveCount(0);
    await expectGuideVisible(page, false);
    const withoutGuide = await canvasSignature(page);

    await setGuideVisible(page, true);
    await expectGuideVisible(page, true);
    await page.waitForFunction((previous) => {
      const canvas = document.querySelector<HTMLCanvasElement>('[data-testid="illusion-canvas"]');
      return canvas?.toDataURL() !== previous;
    }, withoutGuide);
    const withGuide = await canvasSignature(page);
    expect(withGuide).not.toBe(withoutGuide);

    await setRangeParam(page, 'dotRadius', '220');
    await page.waitForFunction((previous) => {
      const canvas = document.querySelector<HTMLCanvasElement>('[data-testid="illusion-canvas"]');
      return canvas?.toDataURL() !== previous;
    }, withGuide);
    expect(await canvasSignature(page)).not.toBe(withGuide);
  });


  test('lets Rubin Vase outline the competing vase and face readings', async ({ page }) => {
    await page.goto('/');
    await selectIllusion(page, 'rubin-vase');

    await expectGuideVisible(page, false);
    const ambiguous = await canvasSignature(page);

    await setGuideVisible(page, true);
    await expectGuideVisible(page, true);
    await page.waitForFunction((previous) => {
      const canvas = document.querySelector<HTMLCanvasElement>('[data-testid="illusion-canvas"]');
      return canvas?.toDataURL() !== previous;
    }, ambiguous);
    const withGuide = await canvasSignature(page);
    expect(withGuide).not.toBe(ambiguous);

    await setRangeParam(page, 'profileDepth', '1.35');
    await page.waitForFunction((previous) => {
      const canvas = document.querySelector<HTMLCanvasElement>('[data-testid="illusion-canvas"]');
      return canvas?.toDataURL() !== previous;
    }, withGuide);
    expect(await canvasSignature(page)).not.toBe(withGuide);
  });


  test('lets Ebbinghaus hide context and show only the square-grid overlay', async ({ page }) => {
    await page.goto('/');
    await selectIllusion(page, 'ebbinghaus');

    await expect(page.getByTestId('param-showContext')).toBeChecked();
    await expectGuideVisible(page, false);
    const withContext = await canvasSignature(page);

    await setGuideVisible(page, true);
    await expectGuideVisible(page, true);
    await page.waitForFunction((previous) => {
      const canvas = document.querySelector<HTMLCanvasElement>('[data-testid="illusion-canvas"]');
      return canvas?.toDataURL() !== previous;
    }, withContext);
    const withGuide = await canvasSignature(page);
    expect(withGuide).not.toBe(withContext);

    await page.getByTestId('param-showContext').uncheck();
    await expect(page.getByTestId('param-showContext')).not.toBeChecked();
    await page.waitForFunction((previous) => {
      const canvas = document.querySelector<HTMLCanvasElement>('[data-testid="illusion-canvas"]');
      return canvas?.toDataURL() !== previous;
    }, withGuide);
    expect(await canvasSignature(page)).not.toBe(withGuide);
  });

  test('lets Delboeuf show only the square-grid guide overlay', async ({ page }) => {
    await page.goto('/');
    await selectIllusion(page, 'delboeuf');

    await expectGuideVisible(page, false);
    const withoutGuide = await canvasSignature(page);

    await setGuideVisible(page, true);
    await expectGuideVisible(page, true);
    await page.waitForFunction((previous) => {
      const canvas = document.querySelector<HTMLCanvasElement>('[data-testid="illusion-canvas"]');
      return canvas?.toDataURL() !== previous;
    }, withoutGuide);
    const withGuide = await canvasSignature(page);
    expect(withGuide).not.toBe(withoutGuide);

    await setRangeParam(page, 'surroundRadius', '430');
    await page.waitForFunction((previous) => {
      const canvas = document.querySelector<HTMLCanvasElement>('[data-testid="illusion-canvas"]');
      return canvas?.toDataURL() !== previous;
    }, withGuide);
    expect(await canvasSignature(page)).not.toBe(withGuide);
  });

  test('lets Simultaneous Contrast compare centers with same-color diagonal samples', async ({ page }) => {
    await page.goto('/');
    await selectIllusion(page, 'simultaneous-contrast');

    await expectGuideVisible(page, false);
    const withoutStripes = await canvasSignature(page);

    await setGuideVisible(page, true);
    await expectGuideVisible(page, true);
    await page.waitForFunction((previous) => {
      const canvas = document.querySelector<HTMLCanvasElement>('[data-testid="illusion-canvas"]');
      return canvas?.toDataURL() !== previous;
    }, withoutStripes);
    expect(await canvasSignature(page)).not.toBe(withoutStripes);
  });

  test("lets White's Illusion compare targets with same-gray diagonal samples", async ({ page }) => {
    await page.goto('/');
    await selectIllusion(page, 'whites-illusion');

    await expectGuideVisible(page, false);
    const withoutStripes = await canvasSignature(page);

    await setGuideVisible(page, true);
    await expectGuideVisible(page, true);
    await page.waitForFunction((previous) => {
      const canvas = document.querySelector<HTMLCanvasElement>('[data-testid="illusion-canvas"]');
      return canvas?.toDataURL() !== previous;
    }, withoutStripes);
    expect(await canvasSignature(page)).not.toBe(withoutStripes);
  });


  test('lets Cornsweet adjust edge width and reveal equal fields', async ({ page }) => {
    await page.goto('/');
    await selectIllusion(page, 'cornsweet');

    await expect(page.getByTestId('param-edgeWidth')).toBeVisible();
    await expectGuideVisible(page, false);
    const defaultView = await canvasSignature(page);

    await setRangeParam(page, 'edgeWidth', '140');
    await page.waitForFunction((previous) => {
      const canvas = document.querySelector<HTMLCanvasElement>('[data-testid="illusion-canvas"]');
      return canvas?.toDataURL() !== previous;
    }, defaultView);
    const wideEdge = await canvasSignature(page);
    expect(wideEdge).not.toBe(defaultView);

    await setGuideVisible(page, true);
    await expectGuideVisible(page, true);
    await page.waitForFunction((previous) => {
      const canvas = document.querySelector<HTMLCanvasElement>('[data-testid="illusion-canvas"]');
      return canvas?.toDataURL() !== previous;
    }, wideEdge);
    expect(await canvasSignature(page)).not.toBe(wideEdge);
  });

  test('lets Rotating Necker Cube switch face guides during depth reversal', async ({ page }) => {
    await page.goto('/');
    await selectIllusion(page, 'rotating-necker-cube');

    await expect(page.getByTestId('media-select')).toHaveValue('video');
    await expect(page.getByTestId('webm-button')).toBeEnabled();
    await expect(page.getByTestId('param-showContext')).toHaveCount(0);
    await expect(page.getByTestId('param-showTargets')).toHaveCount(0);
    await expect(page.getByTestId('param-showShadow')).toHaveCount(0);
    expect(await paramOutputValue(page, 'angle')).toBe('0°');
    await expect(page.getByTestId('param-showFace1')).not.toBeChecked();
    await expect(page.getByTestId('param-showFace2')).not.toBeChecked();
    const ambiguous = await canvasSignature(page);

    await page.getByTestId('param-showFace1').check();
    await expect(page.getByTestId('param-showFace1')).toBeChecked();
    await page.waitForFunction((previous) => {
      const canvas = document.querySelector<HTMLCanvasElement>('[data-testid="illusion-canvas"]');
      return canvas?.toDataURL() !== previous;
    }, ambiguous);
    const withFace1 = await canvasSignature(page);
    expect(withFace1).not.toBe(ambiguous);

    await setGuideVisible(page, true);
    await expectGuideVisible(page, true);
    await page.waitForFunction((previous) => {
      const canvas = document.querySelector<HTMLCanvasElement>('[data-testid="illusion-canvas"]');
      return canvas?.toDataURL() !== previous;
    }, withFace1);
    const withGuide = await canvasSignature(page);
    expect(withGuide).not.toBe(withFace1);

    await page.waitForFunction((previous) => {
      const canvas = document.querySelector<HTMLCanvasElement>('[data-testid="illusion-canvas"]');
      return canvas?.toDataURL() !== previous;
    }, withGuide);
    const changedGuidePhase = await canvasSignature(page);
    expect(changedGuidePhase).not.toBe(withGuide);

    await setRangeParam(page, 'angle', '34');
    await page.waitForFunction((previous) => {
      const canvas = document.querySelector<HTMLCanvasElement>('[data-testid="illusion-canvas"]');
      return canvas?.toDataURL() !== previous;
    }, changedGuidePhase);
    expect(await canvasSignature(page)).not.toBe(changedGuidePhase);
  });





  test('lets Lilac Chaser mark the missing-dot orbit without drawing a green dot', async ({ page }) => {
    await page.goto('/');
    await selectIllusion(page, 'lilac-chaser');

    await expect(page.getByTestId('media-select')).toHaveValue('video');
    await expectGuideVisible(page, false);
    const withoutGuide = await canvasSignature(page);

    await setGuideVisible(page, true);
    await expectGuideVisible(page, true);
    await page.waitForFunction((previous) => {
      const canvas = document.querySelector<HTMLCanvasElement>('[data-testid="illusion-canvas"]');
      return canvas?.toDataURL() !== previous;
    }, withoutGuide);
    const withGuide = await canvasSignature(page);
    expect(withGuide).not.toBe(withoutGuide);

    await setRangeParam(page, 'dotRadius', '120');
    await page.waitForFunction((previous) => {
      const canvas = document.querySelector<HTMLCanvasElement>('[data-testid="illusion-canvas"]');
      return canvas?.toDataURL() !== previous;
    }, withGuide);
    const changedRadius = await canvasSignature(page);
    expect(changedRadius).not.toBe(withGuide);

    await setRangeParam(page, 'ringCount', '20');
    await page.waitForFunction((previous) => {
      const canvas = document.querySelector<HTMLCanvasElement>('[data-testid="illusion-canvas"]');
      return canvas?.toDataURL() !== previous;
    }, changedRadius);
    expect(await canvasSignature(page)).not.toBe(changedRadius);
  });


  test('generates and restores a retained figure-ground illusion', async ({ page }) => {
    await page.goto('/');
    await selectIllusion(page, 'rubin-vase');
    const before = page.url();
    await page.getByTestId('generate-button').click();
    const generatedUrl = page.url();
    const generatedSignature = await canvasSignature(page);

    expect(generatedUrl).not.toBe(before);
    expect(generatedUrl).toContain('i=rubin-vase');
    const png = page.waitForEvent('download');
    await page.getByTestId('png-button').click();
    expect((await png).suggestedFilename()).toMatch(/^rubin-vase-.+-\d{8}-\d{6}\.png$/);
    const svg = page.waitForEvent('download');
    await page.getByTestId('svg-button').click();
    expect((await svg).suggestedFilename()).toMatch(/^rubin-vase-.+-\d{8}-\d{6}\.svg$/);
    await page.goto(generatedUrl);
    await expect(page.getByTestId('media-select')).toHaveValue('static');
    expect(await canvasSignature(page)).toBe(generatedSignature);
  });

  test('keeps media and illusion selects synchronized after Surprise', async ({ page }) => {
    await page.goto('/');

    await page.getByTestId('surprise-button').click();
    const selectedId = await page.getByTestId('illusion-select').inputValue();
    const selectedMedia = await page.getByTestId('media-select').inputValue();
    expect(selectedMedia).toBe(VIDEO_ID_SET.has(selectedId) ? 'video' : 'static');

    await page.goto('/?lang=en&i=rotating-necker-cube&seed=depth');
    await expect(page.getByTestId('media-select')).toHaveValue('video');
    await expect(page.getByTestId('illusion-select')).toHaveValue('rotating-necker-cube');

    await page.goto('/#about');
    await expect(page.getByTestId('about-page')).toBeVisible();
    await page.getByTestId('surprise-button').click();
    await expect(page.getByTestId('home-page')).toBeVisible();
    await expect(page).not.toHaveURL(/#about$/);
    expect(await page.evaluate(() => window.scrollY)).toBe(0);
  });

  test('exports PNG, SVG, WebM, and copies a shareable URL', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/');
    await expect(page.getByTestId('share-url')).toHaveCount(0);
    await expect(page.getByTestId('export-menu').getByRole('button')).toHaveCount(3);
    await expect(page.getByTestId('export-menu').getByTestId('url-button')).toHaveCount(0);
    await expect(page.getByTestId('webm-button')).toBeDisabled();
    await expect(page.locator('#urlButton')).toHaveCount(0);
    await expect(page.locator('[data-i18n="share.title"]')).toHaveCount(0);
    await expect(page.locator('[data-i18n="export.url"]')).toHaveCount(0);
    await expect(page.getByRole('heading', { name: 'Reproducible and shareable URL' })).toBeVisible();
    const copyStateButton = page.getByTestId('copy-state-button');
    await expect(page.getByTestId('state-copy-menu').getByTestId('copy-state-button')).toBeVisible();
    expect(
      await page.evaluate(() => {
        const exportMenu = document.querySelector('[data-testid="export-menu"]');
        const stateCopyMenu = document.querySelector('[data-testid="state-copy-menu"]');
        if (!exportMenu || !stateCopyMenu) {
          return false;
        }

        return Boolean(exportMenu.compareDocumentPosition(stateCopyMenu) & Node.DOCUMENT_POSITION_FOLLOWING);
      })
    ).toBe(true);

    const png = page.waitForEvent('download');
    await page.getByTestId('png-button').click();
    expect((await png).suggestedFilename()).toMatch(/^cafe-wall-.+-\d{8}-\d{6}\.png$/);

    const svg = page.waitForEvent('download');
    await page.getByTestId('svg-button').click();
    expect((await svg).suggestedFilename()).toMatch(/^cafe-wall-.+-\d{8}-\d{6}\.svg$/);

    await copyStateButton.click();
    await expect(page.getByTestId('status-text')).toHaveText('URL copied.');
    const copiedUrl = await page.evaluate(() => navigator.clipboard.readText());
    expect(copiedUrl).toContain('lang=en&i=cafe-wall&seed=');

    for (const id of VIDEO_IDS) {
      await selectIllusion(page, id);
      await expect(page.getByTestId('webm-button')).toBeEnabled();
    }

    for (const id of ['lilac-chaser', 'rotating-necker-cube']) {
      await selectIllusion(page, id);
      const webm = page.waitForEvent('download');
      await page.getByTestId('webm-button').click();
      expect((await webm).suggestedFilename()).toMatch(new RegExp(`^${id}-.+-\\d{8}-\\d{6}\\.webm$`));
    }
  });

  test('changes preview display size without changing canvas render resolution', async ({ page }) => {
    await page.goto('/');
    const canvas = page.getByTestId('illusion-canvas');
    const wrap = page.getByTestId('canvas-wrap');

    await expect(page.getByTestId('preview-size-select')).toHaveValue('medium');
    await expect(canvas).toHaveJSProperty('width', 900);
    await expect(canvas).toHaveJSProperty('height', 900);
    await expect(wrap).toHaveClass(/view-medium/);

    const mediumWidth = await wrap.evaluate((node) => node.getBoundingClientRect().width);
    await page.getByTestId('preview-size-select').selectOption('small');
    await expect(wrap).toHaveClass(/view-small/);
    const smallWidth = await wrap.evaluate((node) => node.getBoundingClientRect().width);
    expect(smallWidth).toBeLessThan(mediumWidth);

    await page.getByTestId('preview-size-select').selectOption('large');
    await expect(wrap).toHaveClass(/view-large/);
    await expect(canvas).toHaveJSProperty('width', 900);
    await expect(canvas).toHaveJSProperty('height', 900);

    const url = page.url();
    expect(url).toContain('view=large');
    await page.goto(url);
    await expect(page.getByTestId('preview-size-select')).toHaveValue('large');
    await expect(page.getByTestId('canvas-wrap')).toHaveClass(/view-large/);
  });

  test('keeps language in the shared header and about panel directly under preview', async ({ page }) => {
    await page.goto('/');

    const layout = await page.evaluate(() => {
      const previewSize = document.querySelector('[data-testid="preview-size-select"]')!.getBoundingClientRect();
      const language = document.querySelector('[data-testid="language-select"]')!.getBoundingClientRect();
      const siteHeader = document.querySelector('[data-testid="site-header"]')!.getBoundingClientRect();
      const appHeader = document.querySelector('.app-header')!.getBoundingClientRect();
      const preview = document.querySelector('.preview-panel')!.getBoundingClientRect();
      const info = document.querySelector('[data-testid="info-panel"]')!.getBoundingClientRect();
      const warning = document.querySelector('[data-testid="motion-warning"]')!.getBoundingClientRect();
      const about = document.querySelector('[data-testid="about-block"]')!.getBoundingClientRect();

      return {
        languageInHeader: language.top >= siteHeader.top - 1 && language.bottom <= siteHeader.bottom + 1,
        previewSizeInHomeHeader: previewSize.top >= appHeader.top - 1 && previewSize.bottom <= appHeader.bottom + 1,
        panelGap: info.top - preview.bottom,
        sameColumn: Math.abs(info.left - preview.left),
        warningAboveAbout: warning.bottom <= about.top + 1
      };
    });

    expect(layout.languageInHeader).toBe(true);
    expect(layout.previewSizeInHomeHeader).toBe(true);
    expect(layout.panelGap).toBeGreaterThanOrEqual(12);
    expect(layout.panelGap).toBeLessThanOrEqual(20);
    expect(layout.sameColumn).toBeLessThanOrEqual(2);
    expect(layout.warningAboveAbout).toBe(true);
  });

  test('uses a full-width footer with centered inner content', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.app-footer h2')).toHaveCount(0);
    await expect(page.locator('.app-footer')).toContainText('Sakushi Lab is an open-source browser app');
    await expect(page.getByTestId('github-link')).toBeVisible();

    const footerLayout = await page.evaluate(() => {
      const footer = document.querySelector('.app-footer')!.getBoundingClientRect();
      const inner = document.querySelector('.footer-inner')!.getBoundingClientRect();

      return {
        footerWidth: footer.width,
        viewportWidth: window.innerWidth,
        innerWidth: inner.width,
        leftGap: inner.left - footer.left,
        rightGap: footer.right - inner.right
      };
    });

    expect(Math.abs(footerLayout.footerWidth - footerLayout.viewportWidth)).toBeLessThanOrEqual(1);
    expect(footerLayout.innerWidth).toBeLessThan(footerLayout.footerWidth);
    expect(Math.abs(footerLayout.leftGap - footerLayout.rightGap)).toBeLessThanOrEqual(2);
  });

  test('switches all planned UI languages without empty labels', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('seed-panel').locator('summary').click();

    for (const language of ['en', 'fr', 'es', 'de', 'ja', 'zh-Hans', 'zh-Hant', 'ko']) {
      await page.getByTestId('language-select').selectOption(language);
      await expect(page.getByTestId('language-select')).toHaveValue(language);
      await expect(page.getByTestId('media-select')).not.toBeEmpty();
      await expect(page.getByTestId('generate-button')).not.toBeEmpty();
      await expect(page.getByTestId('guide-button')).not.toBeEmpty();
      await expect(page.getByTestId('seed-panel').locator('summary')).not.toBeEmpty();
      await expect(page.locator('#controlsTitle')).not.toBeEmpty();
      await expect(page.getByTestId('illusion-description')).not.toBeEmpty();
      await expect(page.getByTestId('illusion-description').locator('p')).toHaveCount(3);

      await page.getByTestId('media-select').selectOption('static');
      let groupLabels = await optionGroupLabels(page);
      expect(groupLabels).toHaveLength(3);
      expect(groupLabels.every((label) => label.length > 0)).toBe(true);

      await page.getByTestId('media-select').selectOption('video');
      groupLabels = await optionGroupLabels(page);
      expect(groupLabels).toHaveLength(2);
      expect(groupLabels.every((label) => label.length > 0)).toBe(true);
    }
  });

  test('fits controls on a narrow mobile viewport for every preview size', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 860 });
    await page.goto('/');
    await selectIllusion(page, 'lilac-chaser');

    for (const view of ['small', 'medium', 'large']) {
      await page.getByTestId('preview-size-select').selectOption(view);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(overflow).toBeLessThanOrEqual(1);
    }

    await expect(page.getByTestId('param-controls')).toBeVisible();
    await expect(page.getByTestId('illusion-canvas')).toBeVisible();
  });

  test('uses translated parameter labels in Simplified Chinese, Traditional Chinese, and Korean', async ({ page }) => {
    await page.goto('/');

    await page.getByTestId('language-select').selectOption('zh-Hans');
    await expect(page.getByTestId('param-controls')).not.toContainText('Rows');

    await page.getByTestId('language-select').selectOption('zh-Hant');
    await expect(page.getByTestId('param-controls')).not.toContainText('Rows');

    await page.getByTestId('language-select').selectOption('ko');
    await expect(page.getByTestId('param-controls')).not.toContainText('Rows');
  });
});

async function selectIllusion(page: Page, id: string): Promise<void> {
  await page.getByTestId('media-select').selectOption(VIDEO_ID_SET.has(id) ? 'video' : 'static');
  await page.getByTestId('illusion-select').selectOption(id);
}

async function optionGroups(page: Page): Promise<Array<{ label: string; values: string[] }>> {
  return page.getByTestId('illusion-select').evaluate((select) =>
    Array.from(select.querySelectorAll('optgroup')).map((group) => ({
      label: group.label,
      values: Array.from(group.querySelectorAll('option')).map((option) => option.value)
    }))
  );
}

async function optionGroupLabels(page: Page): Promise<string[]> {
  return page.getByTestId('illusion-select').evaluate((select) =>
    Array.from(select.querySelectorAll('optgroup')).map((group) => group.label)
  );
}

async function setRangeParam(page: Page, key: string, value: string): Promise<void> {
  await page.getByTestId(`param-${key}`).evaluate((input, nextValue) => {
    const range = input as HTMLInputElement;
    range.value = String(nextValue);
    range.dispatchEvent(new Event('input', { bubbles: true }));
  }, value);
}

async function paramOutputValue(page: Page, key: string): Promise<string> {
  return page.locator('.param-row', { has: page.getByTestId(`param-${key}`) }).locator('output').evaluate(
    (output: HTMLOutputElement) => output.value
  );
}

async function setGuideVisible(page: Page, visible: boolean): Promise<void> {
  const button = page.getByTestId('guide-button');
  await expect(button).toBeVisible();

  if ((await button.getAttribute('aria-pressed')) !== String(visible)) {
    await button.click();
  }

  await expectGuideVisible(page, visible);
}

async function expectGuideVisible(page: Page, visible: boolean): Promise<void> {
  const button = page.getByTestId('guide-button');
  await expect(button).toBeVisible();
  await expect(button).toHaveAttribute('aria-pressed', String(visible));
}

async function canvasStats(page: Page): Promise<{ nonBlank: boolean; unique: number }> {
  return page.getByTestId('illusion-canvas').evaluate((canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      return { nonBlank: false, unique: 0 };
    }

    const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const colors = new Set<string>();

    for (let index = 0; index < data.length; index += 4 * 350) {
      colors.add(`${data[index]},${data[index + 1]},${data[index + 2]},${data[index + 3]}`);
    }

    return {
      nonBlank: colors.size > 1,
      unique: colors.size
    };
  });
}

async function canvasSignature(page: Page): Promise<string> {
  return page.getByTestId('illusion-canvas').evaluate((canvas: HTMLCanvasElement) => canvas.toDataURL('image/png'));
}
