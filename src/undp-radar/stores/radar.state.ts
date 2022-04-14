import { AnyAction, ProcessAction, SetupStore } from '../../kiss-react-state';

import {
  BaseCSVType,
  BlipType,
  MappingType,
  QuadrantKey,
  RadarOptionsType,
  RawBlipType
} from '../types';
import { Utilities } from '../helpers/Utilities';
import { CSVManager } from '../services/CSVManager';

export enum ActionType {
  SET_BLIPS = 'RADAR/SET_BLIPS',
  SET_RAW_BLIPS = 'RADAR/SET_RAW_BLIPS',
  SET_FILTERED_BLIPS = 'RADAR/SET_FILTERED_BLIPS',
  SET_RADAR_DATA = 'RADAR/SET_RADAR_DATA',
  SET_IS_FILTER = 'RADAR/SET_IS_FILTER',
  SET_USE_CASE_FILTER = 'RADAR/SET_USE_CASE_FILTER',
  SET_DISASTER_TYPE_FILTER = 'RADAR/SET_DISASTER_TYPE_FILTER',
  SET_TECH_FILTER = 'RADAR/SET_TECH_FILTER',
  SET_SELECTED_ITEM = 'RADAR/SET_SELECTED_ITEM',
  SET_HOVERED_ITEM = 'RADAR/SET_HOVERED_ITEM',
  SET_HOVERED_TECH = 'RADAR/SET_HOVERED_TECH',
  SET_SELECTED_QUADRANT = 'RADAR/SET_SELECTED_QUADRANT',
  RESET = 'RADAR/RESET',
  SET_POPOVER_COMPONENT = 'RADAR/SET_POPOVER_COMPONENT'
}

export interface RadarState {
  radarData: RadarOptionsType;
  rawBlips: RawBlipType[];
  blips: BlipType[];
  filteredBlips: BlipType[];
  isFiltered: boolean;
  useCaseFilter: string;
  disasterTypeFilter: string;
  techFilters: string[];
  selectedItem: BlipType | null;
  hoveredItem: BlipType | null;
  hoveredTech: string | null;
  selectedQuadrant: QuadrantKey | null;
}

export const radarModule = new SetupStore<ActionType, RadarState>('', {
  radarData: {
    width: 0,
    height: 0,
    quadrants: [],
    horizons: [],
    radarOptions: {
      horizonShiftRadius: 0,
      radiusPadding: 0,
      circlePadding: 0
    },
    tech: []
  },
  rawBlips: [],
  filteredBlips: [],
  blips: [],
  isFiltered: false,
  useCaseFilter: 'all',
  disasterTypeFilter: 'all',
  techFilters: [],
  selectedItem: null,
  hoveredItem: null,
  hoveredTech: null,
  selectedQuadrant: null
});

/**
 * Exportable Actions
 */
const setBlips = radarModule.setPayloadAction<BlipType[]>(
  ActionType.SET_BLIPS,
  (state, action) => ({
    ...state,
    blips: action.payload
  })
);

const setRawBlips = radarModule.setPayloadAction<RawBlipType[]>(
  ActionType.SET_RAW_BLIPS,
  (state, action) => ({
    ...state,
    rawBlips: action.payload
  })
);

const setRadarData = radarModule.setPayloadAction<RadarOptionsType>(
  ActionType.SET_RADAR_DATA,
  (state, action) => ({
    ...state,
    radarData: action.payload
  })
);

const setIsFilter = radarModule.setPayloadAction<boolean>(
  ActionType.SET_IS_FILTER,
  (state, action) => ({
    ...state,
    isFiltered: action.payload
  })
);

const setUseCaseFilter = radarModule.setPayloadAction<string>(
  ActionType.SET_USE_CASE_FILTER,
  (state, action) => ({
    ...state,
    useCaseFilter: action.payload
  })
);

const setDisasterTypeFilter = radarModule.setPayloadAction<string>(
  ActionType.SET_DISASTER_TYPE_FILTER,
  (state, action) => ({
    ...state,
    disasterTypeFilter: action.payload
  })
);

const setTechFilter = radarModule.setPayloadAction<string[]>(
  ActionType.SET_TECH_FILTER,
  (state, action) => ({
    ...state,
    techFilters: action.payload
  })
);

const setFilteredBlipsState = radarModule.setPayloadAction<BlipType[]>(
  ActionType.SET_FILTERED_BLIPS,
  (state, action) => ({
    ...state,
    filteredBlips: action.payload
  })
);

const setSelectedItem = radarModule.setPayloadAction<BlipType | null>(
  ActionType.SET_SELECTED_ITEM,
  (state, action) => ({
    ...state,
    selectedItem: action.payload
  })
);

const setHoveredItem = radarModule.setPayloadAction<BlipType | null>(
  ActionType.SET_HOVERED_ITEM,
  (state, action) => ({
    ...state,
    hoveredItem: action.payload
  })
);

const setHoveredTech = radarModule.setPayloadAction<string | null>(
  ActionType.SET_HOVERED_TECH,
  (state, action) => ({
    ...state,
    hoveredTech: action.payload
  })
);

const setSelectedQuadrant = radarModule.setPayloadAction<QuadrantKey | null>(
  ActionType.SET_SELECTED_QUADRANT,
  (state, action) => ({ ...state, selectedQuadrant: action.payload })
);

const reset = radarModule.setSimpleAction(ActionType.RESET, () =>
  radarModule.getInitialState()
);

/**
 * Thunks
 */
type RadarProcess<R> = ProcessAction<R, RadarState, null, AnyAction>;

type FetchRadarDataProcess = (
  content: string,
  mapping: MappingType<RawBlipType>
) => RadarProcess<void>;
const fetchRadarBlips: FetchRadarDataProcess =
  (content, mapping) =>
  async (dispatch): Promise<void> => {
    const radarCSV = await Utilities.getCSVFileFromUrl(content);
    const rawBlips = new CSVManager(radarCSV).processCSV<BaseCSVType>();
    dispatch(setRawBlips(Utilities.cleanRawBlips(rawBlips, mapping)));
  };

type SetFilterProcess = (
  isFiltered: boolean,
  filteredBlips?: BlipType[]
) => RadarProcess<void>;
const setFilteredBlips: SetFilterProcess =
  (isFiltered, filteredBlips = []) =>
  async (dispatch): Promise<void> => {
    dispatch(setFilteredBlipsState(filteredBlips));
    dispatch(setIsFilter(isFiltered));
  };

export const { Provider: RadarProvider, useContext: useRadarState } =
  radarModule.build(
    // Actions
    {
      reset,
      setBlips,
      setRadarData,
      setTechFilter,
      setHoveredTech,
      setHoveredItem,
      setSelectedItem,
      setUseCaseFilter,
      setSelectedQuadrant,
      setDisasterTypeFilter
    },
    // Procesees
    {
      fetchRadarBlips,
      setFilteredBlips
    }
  );
