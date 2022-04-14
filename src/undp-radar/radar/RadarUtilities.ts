/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-empty-function */
import { v4 as uuidv4 } from 'uuid';
import * as d3 from 'd3';
// Lorem Ipsum from https://fatihtelis.github.io/react-lorem-ipsum/
// import { loremIpsum } from 'react-lorem-ipsum';

import { Utilities } from '../helpers/Utilities';

import {
  BlipType,
  DisasterTypeKey,
  HorizonKey,
  QuadrantKey,
  QuadsType,
  RadarDataBlipsAndLogic,
  RadarOptionsType,
  RawBlipType,
  RgbOut,
  SelectableItem,
  TechItemType,
  TechKey,
  UseCaseKey,
  D3ColorType
} from '../types';
import { PoissonAlgo, Vector2D } from '../helpers/poisson_dist';
import { MAX_TRIES_TO_FIND_SPOT_PER_BLIP } from '../constants/RadarData';

/* eslint-disable no-plusplus */
const blipsSorting = (a: BlipType, b: BlipType): number => {
  if (a.quadrantIndex < b.quadrantIndex) return -1;
  if (a.quadrantIndex > b.quadrantIndex) return 1;
  return 0;
};

// TODO: this is to be driven by supplied DATA
const getTechnologies = (
  rawBlipData: (RawBlipType | BlipType)[],
  techKey: TechKey
): TechItemType[] => {
  const newTechItems: Map<string, TechItemType> = new Map();
  rawBlipData.forEach((val) => {
    const valTechs: string[] = val[techKey] as string[];
    valTechs.forEach((type) => {
      const slug = Utilities.createSlug(type);
      if (!newTechItems.has(slug)) {
        const color = `#${(0x1000000 + Math.random() * 0xffffff)
          .toString(16)
          .substr(1, 6)}`;
        const description = ['Description 1', 'Description 2']; //loremIpsum({ p: 2, avgSentencesPerParagraph: 10, avgWordsPerSentence: 8 }); // TODO
        newTechItems.set(slug, {
          uuid: uuidv4(),
          color,
          type,
          slug,
          description
        });
      }
    });
  });
  return Array.from(newTechItems.values());
};

const randomFromInterval = (min: number, max: number): number =>
  Math.random() * (max - min) + min;

const processBlips = (
  data: RadarOptionsType,
  rawBlips: RawBlipType[],
  keys: { quadrantKey: QuadrantKey; horizonKey: HorizonKey },
  quadrants: QuadrantKey[],
  horizons: HorizonKey[]
): BlipType[] => {
  // go through the data
  const results: BlipType[] = [];

  const width = data.width || 800;
  const height = data.height || 600;
  const horizonWidth = (0.95 * (width > height ? height : width)) / 2;
  const horizonUnit =
    (horizonWidth - data.radarOptions.horizonShiftRadius) / horizons.length;

  // we need multiple poissonDists
  const t0 = Date.now();
  const poissonDist = new PoissonAlgo(data.width, data.height, {
    distance: 12
  });
  poissonDist.setup();
  poissonDist.sample(10000);
  const duration = Date.now() - t0;
  // eslint-disable-next-line no-console
  console.log(`Poisson distribution took ${duration} ms`);

  const usedItems: Map<string, Vector2D> = new Map();

  rawBlips.forEach((blip) => {
    // get angle
    const quadrantIndex = quadrants.indexOf(blip[keys.quadrantKey]);
    const minAngle =
      (quadrantIndex - 1) * (Math.PI / 2) + data.radarOptions.circlePadding;
    const maxAngle =
      (quadrantIndex - 1) * (Math.PI / 2) +
      Math.PI / 2 -
      data.radarOptions.circlePadding;
    let angle = randomFromInterval(minAngle, maxAngle);

    // get radius
    const horizonIndex = horizons.indexOf(blip[keys.horizonKey]) + 1;

    const outerRadius =
      horizonIndex * horizonUnit +
      data.radarOptions.horizonShiftRadius -
      data.radarOptions.radiusPadding;
    const innerRadius =
      horizonIndex === 1
        ? data.radarOptions.radiusPadding
        : (horizonIndex - 1) * horizonUnit +
          (horizonIndex === 0 ? 0 : data.radarOptions.horizonShiftRadius) +
          data.radarOptions.radiusPadding;

    let radius = randomFromInterval(innerRadius, outerRadius);
    const x = radius * Math.cos(angle);
    const y = radius * Math.sin(angle);

    let item: Vector2D | null = null;
    let counter = 0;
    while (item === null) {
      if (counter > MAX_TRIES_TO_FIND_SPOT_PER_BLIP) {
        // eslint-disable-next-line no-console
        console.log(
          `Item failed to find spot at iteration ${counter} - it might overlap.`
        );
        break;
      }
      angle = randomFromInterval(minAngle, maxAngle);
      radius = randomFromInterval(innerRadius, outerRadius);
      const newX = radius * Math.cos(angle);
      const newY = radius * Math.sin(angle);
      const potentialNewitem =
        poissonDist.getNearesGridItem({ x: newX, y: newY }) || null;
      if (!usedItems.has(potentialNewitem.id)) {
        item = potentialNewitem;
        usedItems.set(item.id, item);
      }
      counter++;
    }
    // not using a 'nearest grid item' and falling back to previous random ones will allow less overlap
    results.push({
      ...blip,
      id: uuidv4(),
      quadrantIndex,
      x: item?.x || x,
      y: item?.y || y
    } as BlipType);
  });

  return results;
};

const getHorizons = (
  rawBlipData: (RawBlipType | BlipType)[],
  horizonKey: HorizonKey
): HorizonKey[] => {
  const newHorizons: HorizonKey[] = [];
  rawBlipData.forEach((val) => {
    if (!newHorizons.includes(val[horizonKey]))
      newHorizons.push(val[horizonKey]);
  });
  return newHorizons;
};

const getQuadrants = (
  rawBlipData: (RawBlipType | BlipType)[],
  quadrantKey: QuadrantKey
): QuadrantKey[] => {
  const newQuadrants: QuadrantKey[] = [];
  rawBlipData.forEach((val) => {
    if (!newQuadrants.includes(val[quadrantKey] as QuadrantKey))
      newQuadrants.push(val[quadrantKey] as QuadrantKey);
  });
  return newQuadrants;
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
      } as SelectableItem);
  });
  return Array.from(newUseCases.values());
};

const getDisasterTypes = (
  rawBlipData: BlipType[],
  disasterKey: DisasterTypeKey
): SelectableItem[] => {
  const newDisterTypes: Map<string, SelectableItem> = new Map();
  rawBlipData.forEach((val) => {
    if (val[disasterKey] !== '' && !newDisterTypes.has(val[disasterKey]))
      newDisterTypes.set(val[disasterKey], {
        uuid: uuidv4(),
        name: val[disasterKey]
      } as SelectableItem);
  });
  return Array.from(newDisterTypes.values());
};

const order = (a: string, b: string, order: string[]): number => {
  if (order.indexOf(a.toLowerCase()) < order.indexOf(b.toLowerCase()))
    return -1;
  if (order.indexOf(a.toLowerCase()) > order.indexOf(b.toLowerCase())) return 1;
  return 0;
};

const getRadarData = (
  rawBlips: RawBlipType[],
  passedRadarData: RadarOptionsType,
  keys: {
    quadrantKey: QuadrantKey;
    horizonKey: HorizonKey;
    useCaseKey: UseCaseKey;
    disasterKey: DisasterTypeKey;
    techKey: TechKey;
  },
  priorityOrders: { horizon: string[]; quadrant: string[] }
): RadarDataBlipsAndLogic => {
  const { horizon, quadrant } = priorityOrders;
  const sortHorizon = (a: string, b: string) => order(a, b, horizon);
  const sortQuadrant = (a: string, b: string) => order(a, b, quadrant);
  const horizons = getHorizons(rawBlips, keys.horizonKey).sort(sortHorizon);
  const quadrants = getQuadrants(rawBlips, keys.quadrantKey).sort(sortQuadrant);
  return {
    blips: processBlips(passedRadarData, rawBlips, keys, quadrants, horizons),
    logic: {
      setHoveredItem: () => {},
      setSelectedItem: () => {},
      setSelectedQuadrant: () => {}
    },
    horizons,
    quadrants,
    techs: getTechnologies(rawBlips, keys.techKey)
  };
};

const filterBlips = (
  blips: BlipType[],
  useCaseDisasterKey: { useCaseKey: UseCaseKey; disasterKey: DisasterTypeKey },
  useCaseFilter = 'all',
  disasterTypeFilter = 'all'
): BlipType[] => {
  let filtered = blips;
  if (useCaseFilter !== 'all')
    filtered = filtered.filter(
      (i) => i[useCaseDisasterKey.useCaseKey] === useCaseFilter
    );
  if (disasterTypeFilter !== 'all')
    filtered = filtered.filter(
      (i) => i[useCaseDisasterKey.disasterKey] === disasterTypeFilter
    );
  return filtered;
};

// QUADRANTS
const drawArcs: (
  h: QuadsType,
  horizonUnit: number,
  horizonShiftRadius?: number,
  scaleFactor?: number
) => string | null = (
  h,
  horizonUnit,
  horizonShiftRadius = 0,
  scaleFactor = 1
) =>
  d3
    .arc<QuadsType>()
    .outerRadius(
      (d) => ((d.horizon + 1) * horizonUnit + horizonShiftRadius) * scaleFactor
    )
    .innerRadius(
      (d) =>
        (d.horizon * horizonUnit + (d.horizon === 0 ? 0 : horizonShiftRadius)) *
        scaleFactor
    )
    .startAngle((d) => d.quadrant * (Math.PI / 2))
    .endAngle((d) => d.quadrant * (Math.PI / 2) + Math.PI / 2)(h) || null;

const thisColorScale = d3.scaleOrdinal(d3.schemePastel2);

const fillArcs = (
  d: QuadsType,
  horizons: unknown[],
  quadrant: {
    color?: D3ColorType | null;
    initialOpacity: number;
    clumpingOpacity: number;
  } = {
    initialOpacity: 0.7,
    clumpingOpacity: 1
  }
): RgbOut => {
  const quadrantInput = d.label;
  const brighter = (d.horizon / horizons.length) * 0.7;
  const { color, initialOpacity, clumpingOpacity } = quadrant;
  const result = color
    ? d3.rgb(
        color.r,
        color.g,
        color.b,
        initialOpacity - brighter * clumpingOpacity
      )
    : d3.rgb(thisColorScale(quadrantInput.toString())).brighter(brighter);
  return result as unknown as RgbOut;
};

const getY = (d: QuadsType, width: number): number => {
  switch (d.quadrant) {
    case 1:
      return width / 3;
    case 2:
      return width / 3;
    case 3:
      return -width / 3;
    case 0:
      return -width / 3;
    default:
      return 0;
  }
};

const getX = (d: QuadsType, height: number): number => {
  switch (d.quadrant) {
    case 1:
      return height / 2.2;
    case 2:
      return -height / 2.2;
    case 3:
      return -height / 2.2;
    case 0:
      return height / 2.2;
    default:
      return 0;
  }
};
const getLabelAnchor = (d: QuadsType): string => {
  switch (d.quadrant) {
    case 1:
      return 'end';
    case 2:
      return 'start';
    case 3:
      return 'start';
    case 0:
      return 'end';
    default:
      return '';
  }
};
// END QUADRANTS

export const RadarUtilities = {
  processBlips,
  blipsSorting,
  getHorizons,
  getQuadrants,
  getTechnologies,
  getUseCases,
  getDisasterTypes,
  getRadarData,
  filterBlips,
  quadrants: {
    drawArcs,
    fillArcs,
    getY,
    getX,
    getLabelAnchor
  }
};
