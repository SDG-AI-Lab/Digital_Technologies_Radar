import { v4 as uuidv4 } from 'uuid';

import {
  BlipType,
  DisasterTypeKey,
  SelectableItem,
  UseCaseKey
} from '@undp_sdg_ai_lab/undp-radar';

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
      } as SelectableItem);
  });
  return Array.from(newUseCases.values());
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
      } as SelectableItem);
  });
  return Array.from(newDisterTypes.values());
};

export const FilterUtils = {
  getUseCases,
  getDisasterTypes
};
