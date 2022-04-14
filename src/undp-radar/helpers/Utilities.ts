import { RequestBuilder } from 'ts-request-builder';

import { BaseCSVType, BlipType, MappingType, TechKey } from '../types';

const getCSVFileFromUrl = async (url: string): Promise<string> =>
  new RequestBuilder(url).build<string>();

// taken from https://gist.github.com/codeguy/6684588
const createSlug = (str: string, separator = '-'): string =>
  str
    .toString()
    .normalize('NFD') // split an accented letter in the base letter and the acent
    .replace(/[\u0300-\u036f]/g, '') // remove all previously split accents
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9 ]/g, '') // remove all chars not letters, numbers and spaces (to be replaced)
    .replace(/\s+/g, separator);

const cleanupStringArray = (arr: string[]): string[] =>
  arr.map((t) => t.trim());

const cleanRawBlips = <T>(
  rawBlips: BaseCSVType[],
  mapping: MappingType<T>
): T[] => [...(rawBlips || [])].map(mapping);

const checkItemHasTechFromMultiple = (
  item: BlipType | null,
  tech: string[],
  techKey: TechKey
): boolean => {
  if (item === null) return false;
  // check if techFilter was selected
  const sluggedTechs: string[] = [];
  const itemTechs: string[] = item[techKey] as string[];
  itemTechs.forEach((t) => sluggedTechs.push(createSlug(t)));

  for (const sluggedTech of sluggedTechs) {
    // TODO: debug all of tech lifecycle to see why it is not comming as an array
    if (Array.isArray(tech) && tech.find((t) => t === sluggedTech)) return true;
  }
  return false;
};

const capitalize = (d: string): string =>
  d.charAt(0).toUpperCase() + d.slice(1);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const deepEqual = (x: Record<string, any>, y: Record<string, any>): boolean => {
  const ok = Object.keys,
    tx = typeof x,
    ty = typeof y;
  return x && y && tx === 'object' && tx === ty
    ? ok(x).length === ok(y).length &&
        ok(x).every((key) => deepEqual(x[key], y[key]))
    : x === y;
};

export const Utilities = {
  deepEqual,
  capitalize,
  createSlug,
  cleanRawBlips,
  getCSVFileFromUrl,
  cleanupStringArray,
  checkItemHasTechFromMultiple
};
