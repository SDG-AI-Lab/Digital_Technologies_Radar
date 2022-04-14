/* eslint-disable no-plusplus */
const randBetween = (min: number, max: number): number =>
  Math.random() * (max - min + 1) + min;

const randIntBetween = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min + 1) + min);

// min and max included
const random = (max: number): number => randBetween(0, max);
const randomInt = (max: number): number => randIntBetween(0, max);

const shuffleArray = <T>(array: T[]): T[] => {
  const tempArray = [...array];
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = tempArray[i];
    tempArray[i] = tempArray[j];
    tempArray[j] = temp;
  }
  return tempArray;
};

const randomUnitVector = (): number[] => {
  const i = randBetween(-1, 1);
  const j = randBetween(-Math.sqrt(1 - i * i), Math.sqrt(1 - i * i));
  const tempK = Math.sqrt(1 - i * i - j * j);
  const k = randBetween(-1, 1) < 0 ? -tempK : tempK;
  return shuffleArray([i, j, k]);
};

export const MathUtils = {
  random,
  randomInt,
  randBetween,
  randIntBetween,

  randomUnitVector
};
