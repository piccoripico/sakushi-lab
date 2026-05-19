import { describe, expect, it } from 'vitest';
import { createExportBaseName, formatTimestamp } from '../src/filenames';

describe('export filenames', () => {
  it('formats local timestamps as YYYYMMDD-HHMMSS', () => {
    expect(formatTimestamp(new Date(2026, 4, 19, 7, 8, 9))).toBe('20260519-070809');
  });

  it('adds illusion id, seed, and timestamp to export basenames', () => {
    expect(createExportBaseName('cafe-wall', 'Seed ABC', new Date(2026, 4, 19, 7, 8, 9))).toBe(
      'cafe-wall-seed-abc-20260519-070809'
    );
  });
});
