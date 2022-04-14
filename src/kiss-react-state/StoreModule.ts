import React, { Context, Dispatch } from 'react';
import {
  Action,
  AnyAction,
  PayloadAction,
  ProcessAction,
  SimpleAction,
  StoreModuleActions
} from '.';

export class StoreModule<ActionType extends string | number, S extends {}> {
  path: string;

  initialState: S;

  reducers: {
    [key in ActionType]?: <
      A extends PayloadAction<ActionType, unknown> | SimpleAction<ActionType>
    >(
      state: S,
      action: A
    ) => S;
  } = {};

  selectors: { [key in ActionType]?: (state: S) => any[] } = {};

  constructor(path: string, initialState: S) {
    this.path = path;
    this.initialState = initialState;
  }

  setPayloadAction<P extends any>(
    type: ActionType,
    tinyReducer: (state: S, action: PayloadAction<ActionType, P>) => S
  ) {
    this.reducers[type] = tinyReducer as (state: S, action: Action<any>) => S;
    return (payload: P) => ({ type, payload });
  }

  setSimpleAction(
    type: ActionType,
    tinyReducer: (state: S, action: SimpleAction<ActionType> | Action<any>) => S
  ) {
    this.reducers[type] = tinyReducer;
    return () => ({ type });
  }

  getReducer() {
    return <
      A extends PayloadAction<ActionType, any> | SimpleAction<ActionType>
    >(
      state: S = this.initialState,
      action: A
    ) => {
      const thisReducer = this.reducers[action.type];
      if (thisReducer) return thisReducer(state, action);
      return state;
    };
  }

  helper<T>(state: T, separator = '.'): S {
    return this.resolve(this.path, state, separator);
  }

  getMemoValueHook: () => () => [S, Dispatch<StoreModuleActions<ActionType>>] =
    () => () => {
      const [state, dispatch] = React.useReducer(
        this.getReducer(),
        this.initialState
      );
      return React.useMemo(() => [state, dispatch], [state]);
    };

  getContext() {
    return React.createContext<[S, Dispatch<StoreModuleActions<ActionType>>]>([
      this.initialState,
      (): void => undefined
    ]);
  }

  useContext =
    <
      A extends
        | { [key: string]: (...args: any) => PayloadAction<ActionType, any> }
        | { [key: string]: (...args: any) => SimpleAction<ActionType> },
      T extends {
        [key: string]: <R>(
          ...args: any
        ) => ProcessAction<R, S, null, AnyAction>;
      }
    >(
      contextArg: Context<[S, Dispatch<StoreModuleActions<ActionType>>]>,
      newActions: A = {} as A,
      newThunks: T = {} as T
    ) =>
    () => {
      const context = React.useContext(contextArg);
      if (!context) {
        throw new Error(`useContext must be used within a Provider`);
      }

      const [state, dispatch] = context;

      type OwnActionType = {
        [P in keyof A]: (...args: Parameters<A[P]>) => void;
      };
      const actions: OwnActionType = Object();

      if (newActions) {
        Object.entries(newActions).forEach(([key, value]) => {
          actions[key as keyof A] = (...arg: any) => dispatch(value(...arg));
        });
      }

      type ProcessReturn = ReturnType<ReturnType<T[keyof T]>>;
      type OwnProcessType = {
        [P in keyof T]: (...args: Parameters<T[P]>) => ProcessReturn;
      };
      const processes: OwnProcessType = Object();
      if (newThunks) {
        Object.entries(newThunks).forEach(([key, value]) => {
          processes[key as keyof T] = (...args: any) =>
            value(...args)(dispatch as any, () => state, null) as ProcessReturn;
        });
      }

      return {
        state,
        dispatch,
        actions,
        processes
      };
    };

  private resolve<T>(path: string, object: T, separator = '.'): S {
    return path
      .split(separator)
      .reduce(
        (r: Record<string, any>, val) => (r ? (r as any)[val] : undefined),
        object
      ) as S;
  }
}
