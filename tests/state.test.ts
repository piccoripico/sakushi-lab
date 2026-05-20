import { describe, expect, it } from 'vitest';
import { illusions } from '../src/illusions/registry';
import { createRng } from '../src/rng';
import { encodeParams, readStateFromUrl, stateToSearch } from '../src/state';

describe('seeded randomization and URL state', () => {
  it('uses deterministic seeded random values', () => {
    for (const illusion of illusions) {
      const first = illusion.randomize(createRng(`${illusion.id}:same-seed`));
      const second = illusion.randomize(createRng(`${illusion.id}:same-seed`));
      const third = illusion.randomize(createRng(`${illusion.id}:other-seed`));

      expect(first).toEqual(second);
      expect(first).not.toEqual(third);
    }
  });

  it('round-trips language, illusion, seed, and params through the URL', () => {
    const params = {
      ...illusions[0].defaultParams,
      rows: 18,
      columns: 20
    };
    const search = stateToSearch({
      lang: 'ja',
      illusionId: 'cafe-wall',
      seed: 'abc123',
      seedLocked: true,
      params,
      view: 'small'
    });
    const decoded = readStateFromUrl(search, ['en-US']);

    expect(decoded).toEqual({
      lang: 'ja',
      illusionId: 'cafe-wall',
      seed: 'abc123',
      seedLocked: true,
      params,
      view: 'small'
    });
  });

  it('falls back to defaults for unknown illusions or broken params', () => {
    const decoded = readStateFromUrl('?lang=ko&i=missing&seed=x&p=not-base64', ['fr-FR']);

    expect(decoded.lang).toBe('ko');
    expect(decoded.illusionId).toBe(illusions[0].id);
    expect(decoded.seedLocked).toBe(false);
    expect(decoded.params).toEqual(illusions[0].defaultParams);
    expect(decoded.view).toBe('medium');
  });

  it('round-trips seed lock state', () => {
    const locked = readStateFromUrl('?lang=en&i=cafe-wall&seed=x&lock=1', ['en-US']);
    const unlocked = readStateFromUrl('?lang=en&i=cafe-wall&seed=x&lock=0', ['en-US']);

    expect(locked.seedLocked).toBe(true);
    expect(unlocked.seedLocked).toBe(false);
  });

  it('sanitizes stale or out-of-range params', () => {
    const search = `?lang=en&i=cafe-wall&seed=x&p=${encodeParams({ rows: 999, columns: 'old' })}`;
    const decoded = readStateFromUrl(search, ['en-US']);

    expect(decoded.params.rows).toBe(24);
    expect(decoded.params.columns).toBe(illusions[0].defaultParams.columns);
  });

  it('round-trips preview display size and defaults invalid values', () => {
    const decoded = readStateFromUrl('?lang=en&i=cafe-wall&seed=x&view=large', ['en-US']);
    const invalid = readStateFromUrl('?lang=en&i=cafe-wall&seed=x&view=poster', ['en-US']);

    expect(decoded.view).toBe('large');
    expect(invalid.view).toBe('medium');
  });
});
