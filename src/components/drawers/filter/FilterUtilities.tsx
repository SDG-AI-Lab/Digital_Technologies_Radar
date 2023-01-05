import { v4 as uuidv4 } from 'uuid';

import {
  BlipType,
  DisasterTypeKey,
  SelectableItem,
  UseCaseKey,
  QuadrantKey,
  HorizonKey
} from '@undp_sdg_ai_lab/undp-radar';

const getSubregions = (
  rawBlipData: BlipType[],
  regionKey: string
): SelectableItem[] => {
  const newSubregions: Map<string, SelectableItem> = new Map();
  rawBlipData.forEach((val) => {
    const blipRegions: Set<string> = new Set(val[regionKey]);
    blipRegions.delete('');

    blipRegions.forEach((region) => {
      newSubregions.set(region, { uuid: uuidv4(), name: region });
    });
  });

  return Array.from(newSubregions.values()).sort((a, b) =>
    a.name.localeCompare(b.name)
  );
};

const getRegions = (
  rawBlipData: BlipType[],
  regionKey: string
): SelectableItem[] => {
  const newRegions: Map<string, SelectableItem> = new Map();
  rawBlipData.forEach((val) => {
    const blipRegions: Set<string> = new Set(val[regionKey]);
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
    const blipCountries: Set<string> = new Set(val[countryKey]);
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

const getDisasterCycles = (
  rawBlipData: BlipType[],
  disasterCycleKey: QuadrantKey
): SelectableItem[] => {
  const newDisterCycles: Map<string, SelectableItem> = new Map();
  rawBlipData.forEach((val) => {
    let disasterCycleName = val[disasterCycleKey].split(',')[0];
    // convert to title case
    disasterCycleName = disasterCycleName.replace(/\w\S*/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
    if (disasterCycleName !== '' && !newDisterCycles.has(disasterCycleName))
      newDisterCycles.set(disasterCycleName, {
        uuid: uuidv4(),
        name: disasterCycleName
      });
  });
  return Array.from(newDisterCycles.values()).sort((a, b) =>
    a.name.localeCompare(b.name)
  );
};

const getMaturityStages = (
  rawBlipData: BlipType[],
  maturityStageKey: HorizonKey
): SelectableItem[] => {
  const newMaturityStages: Map<string, SelectableItem> = new Map();
  rawBlipData.forEach((val) => {
    let maturityStage = val[maturityStageKey] as string;
    // convert to title case
    maturityStage = maturityStage.replace(/\w\S*/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
    if (maturityStage !== '' && !newMaturityStages.has(maturityStage))
      newMaturityStages.set(maturityStage, {
        uuid: uuidv4(),
        name: maturityStage
      });
  });
  return Array.from(newMaturityStages.values()).sort((a, b) =>
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
    const blipImplementers: Set<string> = new Set(val[implementerKey]);
    blipImplementers.delete('');

    blipImplementers.forEach((implementer) => {
      newImplementers.set(implementer, { uuid: uuidv4(), name: implementer });
    });
  });

  const arr = Array.from(newImplementers.values()).sort((a, b) =>
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
  const arr = Array.from(newSDGs.values()).sort(function (a, b) {
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

const getYears = (
  rawBlipData: BlipType[],
  yearKey: string
): SelectableItem[] => {
  const yearSet = new Set<number>();
  rawBlipData.forEach((val) => {
    if (!isNaN(Number(val[yearKey]))) {
      yearSet.add(Number(val[yearKey]));
    }
  });

  const yearMap: Map<string, SelectableItem> = new Map();
  const min = Math.min.apply(this, Array.from(yearSet));
  const max = new Date().getFullYear();

  Array(max - min + 1)
    .fill(0)
    .map((_, idx) => String(min + idx))
    .forEach((num) => {
      yearMap.set(num, {
        uuid: uuidv4(),
        name: num
      });
    });

  return Array.from(yearMap.values());
};

const getData = (
  rawBlipData: BlipType[],
  regionKey: string
): SelectableItem[] => {
  const newData: Map<string, SelectableItem> = new Map();
  rawBlipData.forEach((val) => {
    const blipRegions: Set<string> = new Set(val[regionKey]);
    blipRegions.delete('');

    blipRegions.forEach((region) => {
      newData.set(region, { uuid: uuidv4(), name: region });
    });
  });

  const arr = Array.from(newData.values()).sort((a, b) =>
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

export const FilterUtils = {
  getSubregions,
  getRegions,
  getCountries,
  getDisasterTypes,
  getDisasterCycles,
  getMaturityStages,
  getUseCases,
  getImplementers,
  getSDGs,
  getYears,
  getData
};
