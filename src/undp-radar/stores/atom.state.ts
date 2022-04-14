import { UseCaseKey, DisasterTypeKey, TitleKey } from './../types';
import { atom } from 'jotai';
import {
  DEFAULT_WIDTH,
  CIRCLE_PADDING,
  DEFAULT_HEIGHT,
  RADIUS_PADDING,
  HORIZON_SHIFT_RADIUS
} from '../constants/RadarData';
import {
  RawBlipType,
  BlipType,
  QuadrantKey,
  HorizonKey,
  TechItemType,
  TechKey
} from '../types';
import { D3ColorType } from '@undp_sdg_ai_lab/undp-radar';

const rawBlips = atom<RawBlipType[]>([]);
const blips = atom<BlipType[]>([]);
const filteredBlips = atom<BlipType[]>([]);
const isFiltered = atom<boolean>(false);
const useCaseFilter = atom<string>('all');
const disasterTypeFilter = atom<string>('all');
const techFilters = atom<string[]>([]);
const selectedItem = atom<BlipType | null>(null);
const hoveredItem = atom<BlipType | null>(null);
const hoveredTech = atom<string | null>(null);
const selectedQuadrant = atom<QuadrantKey | null>(null);

const quadrants = atom<QuadrantKey[]>([]);
const horizons = atom<HorizonKey[]>([]);
const techs = atom<TechItemType[]>([]);
const width = atom<number>(DEFAULT_WIDTH);
const height = atom<number>(DEFAULT_HEIGHT);
const horizonShiftRadius = atom<number>(HORIZON_SHIFT_RADIUS);
const radiusPadding = atom<number>(RADIUS_PADDING);
const circlePadding = atom<number>(CIRCLE_PADDING);

const HORIZONS_KEY = 'Status/Maturity';
const QUADRANT_KEY = 'Disaster Cycle';
const TITLE_KEY = 'Ideas/Concepts/Examples';
const TECH_KEY = 'Technology';
const USE_CASE_KEY = 'Use Case';
const DISASTER_TYPE_KEY = 'Un Host Organisation';

const techKey = atom<TechKey>(TECH_KEY);
const useCaseKey = atom<UseCaseKey>(USE_CASE_KEY);
const disasterKey = atom<DisasterTypeKey>(DISASTER_TYPE_KEY);
const titleKey = atom<TitleKey>(TITLE_KEY);
const quadrantKey = atom<QuadrantKey>(QUADRANT_KEY);
const horizonKey = atom<HorizonKey>(HORIZONS_KEY);

const horizonPriorityOrder: string[] = [
  'production',
  'validation',
  'prototype',
  'idea'
];
const quadrantPriorityOrder: string[] = [
  'response',
  'recovery',
  'resilience',
  'preparedness'
];

const horizonOrder = atom<string[]>(horizonPriorityOrder);
const quadrantOrder = atom<string[]>(quadrantPriorityOrder);

const quadrantColors = atom<D3ColorType[] | null>(null);
const initialOpacity = atom(0.7);
const clumpingOpacity = atom(1);

const popoverIsShown = atom<boolean>(false);
const popoverPosition = atom<{ left: number; top: number }>({
  left: 0,
  top: 0
});
const popoverIsDisabeld = atom<boolean>(false);

export const RadarAtoms = {
  rawBlips,
  blips,
  filteredBlips,
  isFiltered,
  useCaseFilter,
  disasterTypeFilter,
  techFilters,
  selectedItem,
  hoveredItem,
  hoveredTech,
  selectedQuadrant,
  data: {
    quadrants,
    horizons,
    techs
  },
  ui: {
    width,
    height,
    horizonShiftRadius,
    radiusPadding,
    circlePadding,
    quadrantColors,
    initialOpacity,
    clumpingOpacity,
    popover: {
      isDisabled: popoverIsDisabeld,
      isShown: popoverIsShown,
      position: popoverPosition
    }
  },
  key: {
    techKey,
    useCaseKey,
    disasterKey,
    titleKey,
    quadrantKey,
    horizonKey
  },
  orders: {
    horizonOrder,
    quadrantOrder
  }
};
