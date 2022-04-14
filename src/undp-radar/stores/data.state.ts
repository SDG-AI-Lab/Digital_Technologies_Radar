/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { AnyAction, ProcessAction, SetupStore } from '../../kiss-react-state';

import { RADAR_OPTIONS } from '../constants/RadarData';
import {
  TechKey,
  TitleKey,
  HorizonKey,
  KeysObject,
  UseCaseKey,
  D3ColorType,
  QuadrantKey,
  PriorityType,
  DisasterTypeKey,
  RadarOptionsType
} from '../types';

type UiPopupType = {
  left: number;
  top: number;
  isShown: boolean;
};
export interface DataState {
  keys: KeysObject;
  priorityOrders: PriorityType;
  radarOptions: RadarOptionsType;
  radarColors: {
    quadrants: {
      colors: D3ColorType[] | null;
      initialOpacity: number;
      clumpingOpacity: number;
    };
  };
  ui: {
    popup: UiPopupType;
    popupDisabled: boolean;
  };
}

export enum ActionType {
  SET_UI_POPUP,
  SET_TECH_KEY,
  SET_TITLE_KEY,
  SET_HORIZON_KEY,
  SET_USE_CASE_KEY,
  SET_QUADRANT_KEY,
  SET_RADAR_OPTIONS,
  SET_UI_POPUP_DISABLED,
  SET_DISASTER_TYPE_KEY,
  SST_RADAR_QUADRANT_COLORS,
  SET_PRIORITY_HORIZON_ORDER,
  SET_PRIORITY_QUADRANT_ORDER,
  SST_RADAR_QUADRANT_INITIAL_OPACITY,
  SST_RADAR_QUADRANT_CLUMPING_OPACITY,

  RESET
}

// TODO: setters for these
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

const HORIZONS_KEY = 'Status/Maturity';
const QUADRANT_KEY = 'Disaster Cycle';
const TITLE_KEY = 'Ideas/Concepts/Examples';
const TECH_KEY = 'Technology';
const USE_CASE_KEY = 'Use Case';
const DISASTER_TYPE_KEY = 'Un Host Organisation';

export const dataState = new SetupStore<ActionType, DataState>('', {
  keys: {
    techKey: TECH_KEY,
    useCaseKey: USE_CASE_KEY,
    disasterTypeKey: DISASTER_TYPE_KEY,
    titleKey: TITLE_KEY,
    quadrantKey: QUADRANT_KEY,
    horizonKey: HORIZONS_KEY
  },
  priorityOrders: {
    horizon: horizonPriorityOrder,
    quadrant: quadrantPriorityOrder
  },
  radarOptions: RADAR_OPTIONS,
  radarColors: {
    quadrants: {
      colors: null,
      initialOpacity: 0.7,
      clumpingOpacity: 1
    }
  },
  ui: {
    popup: {
      left: 0,
      top: 0,
      isShown: false
    },
    popupDisabled: false
  }
});

/**
 * Exportable Actions
 */
const setUiPopup = dataState.setPayloadAction<Partial<UiPopupType>>(
  ActionType.SET_UI_POPUP,
  (state, action) => ({
    ...state,
    ui: {
      ...state.ui,
      popup: {
        ...state.ui.popup,
        ...action.payload
      }
    }
  })
);

const setUiPopupDisabled = dataState.setPayloadAction<boolean>(
  ActionType.SET_UI_POPUP_DISABLED,
  (state, action) => ({
    ...state,
    ui: { ...state.ui, popupDisabled: action.payload }
  })
);

const setHorizonPriorityOrder = dataState.setPayloadAction<string[]>(
  ActionType.SET_PRIORITY_HORIZON_ORDER,
  (state, action) => ({
    ...state,
    priorityOrders: {
      ...state.priorityOrders,
      horizon: action.payload.map((v) => v.toLowerCase()) // make it consistent
    }
  })
);

const setQuadrantPriorityOrder = dataState.setPayloadAction<string[]>(
  ActionType.SET_PRIORITY_QUADRANT_ORDER,
  (state, action) => ({
    ...state,
    priorityOrders: {
      ...state.priorityOrders,
      quadrant: action.payload.map((v) => v.toLowerCase()) // make it consistent
    }
  })
);

const setRadarOptions = dataState.setPayloadAction<Partial<RadarOptionsType>>(
  ActionType.SET_RADAR_OPTIONS,
  (state, action) => ({
    ...state,
    radarOptions: {
      ...state.radarOptions,
      ...action.payload
    }
  })
);
const setTechKey = dataState.setPayloadAction<TechKey>(
  ActionType.SET_TECH_KEY,
  (state, action) => ({
    ...state,
    keys: {
      ...state.keys,
      techKey: action.payload
    }
  })
);
const setTitleKey = dataState.setPayloadAction<TitleKey>(
  ActionType.SET_TITLE_KEY,
  (state, action) => ({
    ...state,
    keys: {
      ...state.keys,
      titleKey: action.payload
    }
  })
);
const setHorizonKey = dataState.setPayloadAction<HorizonKey>(
  ActionType.SET_HORIZON_KEY,
  (state, action) => ({
    ...state,
    keys: {
      ...state.keys,
      horizonKey: action.payload
    }
  })
);
const setQuadrantKey = dataState.setPayloadAction<QuadrantKey>(
  ActionType.SET_QUADRANT_KEY,
  (state, action) => ({
    ...state,
    keys: {
      ...state.keys,
      quadrantKey: action.payload
    }
  })
);

const setUseCaseKey = dataState.setPayloadAction<UseCaseKey>(
  ActionType.SET_USE_CASE_KEY,
  (state, action) => ({
    ...state,
    keys: {
      ...state.keys,
      useCaseKey: action.payload
    }
  })
);

const setDisasterTypeKey = dataState.setPayloadAction<DisasterTypeKey>(
  ActionType.SET_DISASTER_TYPE_KEY,
  (state, action) => ({
    ...state,
    keys: {
      ...state.keys,
      disasterTypeKey: action.payload
    }
  })
);

const setRadarQuadrantColors = dataState.setPayloadAction<D3ColorType[] | null>(
  ActionType.SST_RADAR_QUADRANT_COLORS,
  (state, action) => ({
    ...state,
    radarColors: {
      ...state.radarColors,
      quadrants: {
        ...state.radarColors.quadrants,
        colors: action.payload
      }
    }
  })
);

const setRadarQuadrantInitialOpacity = dataState.setPayloadAction<number>(
  ActionType.SST_RADAR_QUADRANT_INITIAL_OPACITY,
  (state, action) => ({
    ...state,
    radarColors: {
      ...state.radarColors,
      quadrants: {
        ...state.radarColors.quadrants,
        initialOpacity: action.payload
      }
    }
  })
);

const setRadarQuadrantClumpingOpacity = dataState.setPayloadAction<number>(
  ActionType.SST_RADAR_QUADRANT_CLUMPING_OPACITY,
  (state, action) => ({
    ...state,
    radarColors: {
      ...state.radarColors,
      quadrants: {
        ...state.radarColors.quadrants,
        clumpingOpacity: action.payload
      }
    }
  })
);

const reset = dataState.setSimpleAction(ActionType.RESET, () =>
  dataState.getInitialState()
);

/**
 * Thunks
 */
type DataProcess<R> = ProcessAction<R, DataState, null, AnyAction>;

type SetKeysProcess = (keys: Partial<KeysObject>) => DataProcess<void>;
const setKeys: SetKeysProcess = (keys) => (dispatch) => {
  const {
    techKey,
    titleKey,
    horizonKey,
    quadrantKey,
    useCaseKey,
    disasterTypeKey
  } = keys;
  if (techKey) dispatch(setTechKey(techKey));
  if (titleKey) dispatch(setTitleKey(titleKey));
  if (horizonKey) dispatch(setHorizonKey(horizonKey));
  if (quadrantKey) dispatch(setQuadrantKey(quadrantKey));
  if (useCaseKey) dispatch(setUseCaseKey(useCaseKey));
  if (disasterTypeKey) dispatch(setDisasterTypeKey(disasterTypeKey));
};

type SetRadarConfProcess = (
  conf: Partial<RadarOptionsType>
) => DataProcess<void>;
const setRadarConf: SetRadarConfProcess = (conf) => (dispatch) =>
  dispatch(setRadarOptions(conf));

export const { Provider: DataProvider, useContext: useDataState } =
  dataState.build(
    // Actions
    {
      setUiPopup,
      setUiPopupDisabled,
      setRadarQuadrantColors,
      setHorizonPriorityOrder,
      setQuadrantPriorityOrder,
      setRadarQuadrantInitialOpacity,
      setRadarQuadrantClumpingOpacity,
      reset
    },
    // Processess
    {
      setKeys,
      setRadarConf
    }
  );
