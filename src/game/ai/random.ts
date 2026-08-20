export function seededRandom(initialSeed: number): () => number {
  let seed = initialSeed >>> 0;
  return () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 0x1_0000_0000;
  };
}

export function nextSeed(random: () => number): number {
  return Math.floor(random() * 0x1_0000_0000) >>> 0;
}

export function mixSeed(...values: number[]): number {
  let mixed = 0x9e3779b9;
  for (const value of values) {
    mixed ^= value >>> 0;
    mixed = Math.imul(mixed ^ (mixed >>> 16), 0x21f0aaad);
    mixed = Math.imul(mixed ^ (mixed >>> 15), 0x735a2d97);
    mixed ^= mixed >>> 15;
  }
  return mixed >>> 0;
}
