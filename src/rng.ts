import type { Rng } from './types';

export function createRng(seedText: string): Rng {
  let state = hashSeed(seedText || 'sakushi-lab');

  const next = () => {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };

  return {
    next,
    float: (min, max, decimals = 2) => {
      const value = min + next() * (max - min);
      return Number(value.toFixed(decimals));
    },
    int: (min, max) => Math.floor(min + next() * (max - min + 1)),
    pick: (items) => items[Math.min(items.length - 1, Math.floor(next() * items.length))]
  };
}

export function randomSeed(): string {
  const bytes = new Uint32Array(2);

  if (globalThis.crypto?.getRandomValues) {
    globalThis.crypto.getRandomValues(bytes);
  } else {
    bytes[0] = Math.floor(Math.random() * 0xffffffff);
    bytes[1] = Date.now() >>> 0;
  }

  return [...bytes].map((value) => value.toString(36).padStart(7, '0')).join('');
}

function hashSeed(text: string): number {
  let hash = 1779033703 ^ text.length;

  for (let index = 0; index < text.length; index += 1) {
    hash = Math.imul(hash ^ text.charCodeAt(index), 3432918353);
    hash = (hash << 13) | (hash >>> 19);
  }

  return hash >>> 0;
}
