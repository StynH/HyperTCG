const UINT32_RANGE = 0x1_0000_0000;

export interface RandomGenerator {
  (): number;
  integer?: (maxExclusive: number) => number;
}

function secureUint32() {
  const entropy = new Uint32Array(1);
  globalThis.crypto.getRandomValues(entropy);
  return entropy[0];
}

function assertValidMaximum(maxExclusive: number) {
  if (!Number.isSafeInteger(maxExclusive) || maxExclusive < 1 || maxExclusive > UINT32_RANGE) {
    throw new RangeError('Random integer maximum must be between 1 and 2^32.');
  }
}

function secureRandomInteger(maxExclusive: number) {
  assertValidMaximum(maxExclusive);
  const unbiasedRange = UINT32_RANGE - (UINT32_RANGE % maxExclusive);
  let value: number;
  do value = secureUint32();
  while (value >= unbiasedRange);
  return value % maxExclusive;
}

export const secureRandom: RandomGenerator = Object.assign(
  () => secureUint32() / UINT32_RANGE,
  { integer: secureRandomInteger },
);

export function randomInteger(random: RandomGenerator, maxExclusive: number) {
  assertValidMaximum(maxExclusive);
  if (random.integer) return random.integer(maxExclusive);
  const value = random();
  if (value < 0 || value >= 1 || !Number.isFinite(value)) {
    throw new RangeError('Random generator must return a finite value from 0 up to, but not including, 1.');
  }
  return Math.floor(value * maxExclusive);
}

export function rollDie(sides: number, random: RandomGenerator = secureRandom) {
  return randomInteger(random, sides) + 1;
}
