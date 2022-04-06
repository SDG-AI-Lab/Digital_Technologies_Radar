import { v4 as uuidv4 } from 'uuid';

import {
  BlipType,
  DisasterTypeKey,
  SelectableItem,
  UseCaseKey
} from '@undp_sdg_ai_lab/undp-radar';

const getRegions = (
  rawBlipData: BlipType[],
  regionKey: string
): SelectableItem[] => {
  const newRegions: Map<string, SelectableItem> = new Map();
  rawBlipData.forEach((val) => {
    const blipRegions: Set<string> = new Set(
      val[regionKey].split(',').map((item) => item.trim())
    );
    blipRegions.delete('');

    blipRegions.forEach((region) => {
      newRegions.set(region, { uuid: uuidv4(), name: region });
    });
  });

  return Array.from(newRegions.values()).sort((a, b) =>
    a.name.localeCompare(b.name)
  );
};

const getCountries = (
  rawBlipData: BlipType[],
  countryKey: string
): SelectableItem[] => {
  const newCountries: Map<string, SelectableItem> = new Map();
  rawBlipData.forEach((val) => {
    const blipCountries: Set<string> = new Set(
      val[countryKey].split(',').map((item) => item.trim())
    );
    blipCountries.delete('');

    blipCountries.forEach((country) => {
      newCountries.set(country, { uuid: uuidv4(), name: country });
    });
  });

  return Array.from(newCountries.values()).sort((a, b) =>
    a.name.localeCompare(b.name)
  );
};

const getDisasterTypes = (
  rawBlipData: BlipType[],
  disasterTypeKey: DisasterTypeKey
): SelectableItem[] => {
  const newDisterTypes: Map<string, SelectableItem> = new Map();
  rawBlipData.forEach((val) => {
    if (
      val[disasterTypeKey] !== '' &&
      !newDisterTypes.has(val[disasterTypeKey])
    )
      newDisterTypes.set(val[disasterTypeKey], {
        uuid: uuidv4(),
        name: val[disasterTypeKey]
      });
  });
  return Array.from(newDisterTypes.values()).sort((a, b) =>
    a.name.localeCompare(b.name)
  );
};

const getUseCases = (
  rawBlipData: BlipType[],
  useCaseKey: UseCaseKey
): SelectableItem[] => {
  const newUseCases: Map<string, SelectableItem> = new Map();
  rawBlipData.forEach((val) => {
    if (val[useCaseKey] !== '' && !newUseCases.has(val[useCaseKey]))
      newUseCases.set(val[useCaseKey], {
        uuid: uuidv4(),
        name: val[useCaseKey]
      });
  });
  return Array.from(newUseCases.values()).sort((a, b) =>
    a.name.localeCompare(b.name)
  );
};

const getImplementers = (
  rawBlipData: BlipType[],
  implementerKey: string
): SelectableItem[] => {
  const newImplementers: Map<string, SelectableItem> = new Map();
  rawBlipData.forEach((val) => {
    if (val[implementerKey] !== '' && !newImplementers.has(val[implementerKey]))
      newImplementers.set(val[implementerKey], {
        uuid: uuidv4(),
        name: val[implementerKey]
      });
  });

  let arr = Array.from(newImplementers.values()).sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  // Move 'No Information' to the back of the ordered array
  const index = arr
    .map(function (e) {
      return e.name;
    })
    .indexOf('No Information');
  arr.push(arr.splice(index, 1)[0]);

  return arr;
};

const getSDGs = (rawBlipData: BlipType[], SDGKey: string): SelectableItem[] => {
  const newSDGs: Map<string, SelectableItem> = new Map();
  rawBlipData.forEach((blip) => {
    // a blip can have multiple SDGs
    const blipSDGs: string[] = blip[SDGKey];
    blipSDGs.forEach((sdg) => {
      if (sdg !== '' && !newSDGs.has(blip[SDGKey])) {
        newSDGs.set(sdg, { uuid: uuidv4(), name: sdg });
      }
    });
  });

  // Order the resulting array
  let arr = Array.from(newSDGs.values()).sort(function (a, b) {
    // we use natural instead of lexicographical order
    return a.name.localeCompare(b.name, undefined, {
      numeric: true,
      sensitivity: 'base'
    });
  });

  // Move 'No Information' to the back of the ordered array
  const index = arr
    .map(function (e) {
      return e.name;
    })
    .indexOf('No Information');
  arr.push(arr.splice(index, 1)[0]);

  return arr;
};

const getStartYears = (
  rawBlipData: BlipType[],
  startYearKey: string
): SelectableItem[] => {
  const newStartYears: Map<string, SelectableItem> = new Map();
  rawBlipData.forEach((val) => {
    if (val[startYearKey] !== '' && !newStartYears.has(val[startYearKey]))
      newStartYears.set(val[startYearKey], {
        uuid: uuidv4(),
        name: val[startYearKey]
      });
  });
  return Array.from(newStartYears.values()).sort((a, b) =>
    a.name.localeCompare(b.name)
  );
};

const getEndYears = (
  rawBlipData: BlipType[],
  endYearKey: string
): SelectableItem[] => {
  const newEndYears: Map<string, SelectableItem> = new Map();
  rawBlipData.forEach((val) => {
    if (val[endYearKey] !== '' && !newEndYears.has(val[endYearKey]))
      newEndYears.set(val[endYearKey], {
        uuid: uuidv4(),
        name: val[endYearKey]
      });
  });
  return Array.from(newEndYears.values()).sort((a, b) =>
    a.name.localeCompare(b.name)
  );
};

export const FilterUtils = {
  getRegions,
  getCountries,
  getDisasterTypes,
  getUseCases,
  getImplementers,
  getSDGs,
  getStartYears,
  getEndYears
};
