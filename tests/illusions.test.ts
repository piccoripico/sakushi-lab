import { describe, expect, it } from 'vitest';
import { illusionIds, illusions } from '../src/illusions/registry';

describe('illusion registry', () => {
  it('registers the six v1 illusions in display order', () => {
    expect(illusionIds).toEqual([
      'cafe-wall',
      'hermann-grid',
      'muller-lyer',
      'ebbinghaus',
      'fraser-spiral',
      'moire-motion'
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

  it('marks only motion field as animated in v1', () => {
    expect(illusions.filter((illusion) => illusion.supportsAnimation).map((illusion) => illusion.id)).toEqual(['moire-motion']);
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
