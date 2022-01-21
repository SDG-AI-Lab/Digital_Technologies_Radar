import { v4 as uuidv4 } from 'uuid';

import {
  BlipType,
  DisasterTypeKey,
  SelectableItem,
  UseCaseKey
} from '@undp_sdg_ai_lab/undp-radar';

const getCountries = (
  rawBlipData: BlipType[],
  countryKey: string
): SelectableItem[] => {
  const newCountries: Map<string, SelectableItem> = new Map();
  rawBlipData.forEach((val) => {
    if (val[countryKey] !== '' && !newCountries.has(val[countryKey]))
      newCountries.set(val[countryKey], {
        uuid: uuidv4(),
        name: val[countryKey]
      });
  });
  return Array.from(newCountries.values());
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
  return Array.from(newDisterTypes.values());
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
  return Array.from(newUseCases.values());
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
  return Array.from(newImplementers.values());
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
  return Array.from(newSDGs.values());
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
  return Array.from(newStartYears.values());
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
  return Array.from(newEndYears.values());
};

export const FilterUtils = {
  getCountries,
  getDisasterTypes,
  getUseCases,
  getImplementers,
  getSDGs,
  getStartYears,
  getEndYears
};
