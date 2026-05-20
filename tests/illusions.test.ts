import { describe, expect, it } from 'vitest';
import { illusionGroups, illusionIds, illusions } from '../src/illusions/registry';

describe('illusion registry', () => {
  it('registers the 24 v0.2 illusions in display order', () => {
    expect(illusionIds).toEqual([
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
    ]);
  });

  it('exposes renderers, schemas, defaults, and SVG output for every illusion', () => {
    for (const illusion of illusions) {
      expect(typeof illusion.renderCanvas).toBe('function');
      expect(typeof illusion.renderSvg).toBe('function');
      expect(illusion.paramSchema.length).toBeGreaterThan(0);
      expect(Object.keys(illusion.defaultParams).sort()).toEqual(illusion.paramSchema.map((control) => control.key).sort());
      expect(illusion.renderSvg(illusion.defaultParams)).toMatch(/^<svg /);
    }
  });

  it('groups every illusion exactly once', () => {
    expect(illusionGroups.map((group) => group.id)).toEqual(['geometry', 'colorBrightness', 'motion']);
    expect(illusionGroups.map((group) => group.titleKey)).toEqual([
      'category.geometry',
      'category.colorBrightness',
      'category.motion'
    ]);

    const groupedIds = illusionGroups.flatMap((group) => group.illusions.map((illusion) => illusion.id));
    expect(groupedIds).toEqual(illusionIds);
    expect(new Set(groupedIds).size).toBe(illusionIds.length);
    expect(illusionGroups.map((group) => group.illusions.length)).toEqual([15, 4, 5]);
  });

  it('marks the v0.2 animated illusions', () => {
    expect(illusions.filter((illusion) => illusion.supportsAnimation).map((illusion) => illusion.id)).toEqual([
      'moire-motion',
      'peripheral-drift',
      'ouchi-illusion',
      'lilac-chaser',
      'pinna-brelstaff'
    ]);
  });

  it('lets Müller-Lyer hide the guide line in SVG output', () => {
    const muller = illusions.find((illusion) => illusion.id === 'muller-lyer');

    expect(muller).toBeTruthy();
    const withGuide = muller!.renderSvg({ ...muller!.defaultParams, showGuide: true });
    const withoutGuide = muller!.renderSvg({ ...muller!.defaultParams, showGuide: false });

    expect(withGuide).toContain(String(muller!.defaultParams.accentColor));
    expect(withoutGuide).not.toContain(String(muller!.defaultParams.accentColor));
  });
});
