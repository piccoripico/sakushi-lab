import { expect, test, type Page } from '@playwright/test';

const ILLUSION_IDS = [
  'cafe-wall',
  'hermann-grid',
  'muller-lyer',
  'ponzo',
  'poggendorff',
  'zollner',
  'hering',
  'wundt',
  'vertical-horizontal',
  'jastrow',
  'ebbinghaus',
  'delboeuf',
  'sander-parallelogram',
  'kanizsa-triangle',
  'fraser-spiral',
  'simultaneous-contrast',
  'mach-bands',
  'whites-illusion',
  'cornsweet',
  'moire-motion',
  'peripheral-drift',
  'ouchi-illusion',
  'lilac-chaser',
  'pinna-brelstaff'
] as const;

test.describe('Sakushi Lab', () => {
  test('starts in the browser language and draws a nonblank canvas', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Sakushi Lab');
    await expect(page.getByText('Classic perception experiments')).toHaveCount(0);
    await expect(page.getByText('Explore how easily illusions appear')).toBeVisible();
    await page.getByTestId('language-select').selectOption('ja');
    await expect(page.locator('.app-description')).toContainText('錯視の起こりやすさを、パラメータ（条件）を変えながら試せます。');
    await expect(page.locator('.app-description')).toContainText('作成した画像・動画のダウンロードや、再現用URLの共有ができます。');
    await page.getByTestId('language-select').selectOption('en');
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

  test('switches through all 24 illusions and keeps the canvas painted', async ({ page }) => {
    await page.goto('/');

    for (const id of ILLUSION_IDS) {
      await page.getByTestId('illusion-select').selectOption(id);
      await page.waitForTimeout(120);
      expect(await canvasStats(page), id).toMatchObject({ nonBlank: true });
    }
  });

  test('groups the illusion select into the planned categories', async ({ page }) => {
    await page.goto('/');

    const groups = await page.getByTestId('illusion-select').evaluate((select) =>
      Array.from(select.querySelectorAll('optgroup')).map((group) => ({
        label: group.label,
        values: Array.from(group.querySelectorAll('option')).map((option) => option.value)
      }))
    );

    expect(groups).toEqual([
      {
        label: 'Geometry / form',
        values: ILLUSION_IDS.slice(0, 15)
      },
      {
        label: 'Color / brightness',
        values: ILLUSION_IDS.slice(15, 19)
      },
      {
        label: 'Motion',
        values: ILLUSION_IDS.slice(19)
      }
    ]);
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

      return Math.max(generate.bottom, surprise.bottom) <= seedPanel.top + 2;
    });
    expect(order).toBe(true);

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

  test('can hide the Müller-Lyer guide line', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('illusion-select').selectOption('muller-lyer');

    await expect(page.getByTestId('param-showGuide')).toBeChecked();
    const withGuide = await canvasSignature(page);
    await page.getByTestId('param-showGuide').uncheck();
    await expect(page.getByTestId('param-showGuide')).not.toBeChecked();
    await page.waitForFunction((previous) => {
      const canvas = document.querySelector<HTMLCanvasElement>('[data-testid="illusion-canvas"]');
      return canvas?.toDataURL() !== previous;
    }, withGuide);
    expect(await canvasSignature(page)).not.toBe(withGuide);
  });


  test('exports PNG, SVG, WebM, and copies a shareable URL', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/');
    await expect(page.getByTestId('share-url')).toHaveCount(0);
    await expect(page.getByTestId('export-menu').getByRole('button')).toHaveCount(3);
    await expect(page.getByTestId('export-menu').getByTestId('url-button')).toHaveCount(0);
    await expect(page.getByTestId('webm-button')).toBeDisabled();
    await expect(page.getByTestId('share-menu')).toHaveCount(0);
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

    for (const id of ['moire-motion', 'peripheral-drift', 'ouchi-illusion', 'lilac-chaser', 'pinna-brelstaff']) {
      await page.getByTestId('illusion-select').selectOption(id);
      await expect(page.getByTestId('webm-button')).toBeEnabled();
    }

    await page.getByTestId('illusion-select').selectOption('moire-motion');
    const webm = page.waitForEvent('download');
    await page.getByTestId('webm-button').click();
    expect((await webm).suggestedFilename()).toMatch(/^moire-motion-.+-\d{8}-\d{6}\.webm$/);
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

  test('keeps preview size control left of language and about panel directly under preview', async ({ page }) => {
    await page.goto('/');

    const layout = await page.evaluate(() => {
      const previewSize = document.querySelector('[data-testid="preview-size-select"]')!.getBoundingClientRect();
      const language = document.querySelector('[data-testid="language-select"]')!.getBoundingClientRect();
      const preview = document.querySelector('.preview-panel')!.getBoundingClientRect();
      const info = document.querySelector('[data-testid="info-panel"]')!.getBoundingClientRect();

      return {
        controlsOrdered: previewSize.right <= language.left + 2,
        panelGap: info.top - preview.bottom,
        sameColumn: Math.abs(info.left - preview.left)
      };
    });

    expect(layout.controlsOrdered).toBe(true);
    expect(layout.panelGap).toBeGreaterThanOrEqual(12);
    expect(layout.panelGap).toBeLessThanOrEqual(20);
    expect(layout.sameColumn).toBeLessThanOrEqual(2);
  });

  test('switches all planned UI languages without mojibake or empty labels', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('seed-panel').locator('summary').click();

    for (const language of ['en', 'fr', 'es', 'de', 'ja', 'zh-Hans', 'zh-Hant', 'ko']) {
      await page.getByTestId('language-select').selectOption(language);
      await expect(page.getByTestId('language-select')).toHaveValue(language);
      await expect(page.getByTestId('generate-button')).not.toBeEmpty();
      await expect(page.getByTestId('seed-panel').locator('summary')).not.toBeEmpty();
      await expect(page.locator('#controlsTitle')).not.toBeEmpty();
      await expect(page.getByTestId('illusion-description')).not.toBeEmpty();
      const groupLabels = await page.getByTestId('illusion-select').evaluate((select) =>
        Array.from(select.querySelectorAll('optgroup')).map((group) => group.label)
      );
      expect(groupLabels).toHaveLength(3);
      expect(groupLabels.every((label) => label.length > 0)).toBe(true);
      expect(groupLabels.join('\n')).not.toMatch(/[�縺譁郢]/);
      const bodyText = await page.locator('body').innerText();
      expect(bodyText).not.toMatch(/[�縺譁郢]/);
    }
  });

  test('fits controls on a narrow mobile viewport for every preview size', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 860 });
    await page.goto('/');
    await page.getByTestId('illusion-select').selectOption('moire-motion');

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
    await expect(page.getByTestId('param-controls')).toContainText('行数');
    await expect(page.getByTestId('param-controls')).not.toContainText('Rows');

    await page.getByTestId('language-select').selectOption('zh-Hant');
    await expect(page.getByTestId('param-controls')).toContainText('列數');
    await expect(page.getByTestId('param-controls')).not.toContainText('Rows');

    await page.getByTestId('language-select').selectOption('ko');
    await expect(page.getByTestId('param-controls')).toContainText('행 수');
    await expect(page.getByTestId('param-controls')).not.toContainText('Rows');
  });
});

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
      nonBlank: colors.size > 4,
      unique: colors.size
    };
  });
}

async function canvasSignature(page: Page): Promise<string> {
  return page.getByTestId('illusion-canvas').evaluate((canvas: HTMLCanvasElement) => canvas.toDataURL('image/png'));
}
