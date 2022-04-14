import React from 'react';

import {
  SimpleAction,
  Action,
  PayloadAction,
  ProcessAction,
  AnyAction
} from './index';
import { StoreModule } from './StoreModule';

export class SetupStore<ActionType extends string | number, S extends {}> {
  private storeModule: StoreModule<ActionType, S>;

  constructor(path: string, initialState: S) {
    this.storeModule = new StoreModule(path, initialState);
  }

  getInitialState() {
    return this.storeModule.initialState;
  }

  setSimpleAction(
    type: ActionType,
    tinyReducer: (state: S, action: Action<any> | SimpleAction<ActionType>) => S
  ) {
    return this.storeModule.setSimpleAction(type, tinyReducer);
  }

  setPayloadAction<T>(
    type: ActionType,
    tinyReducer: (state: S, action: PayloadAction<ActionType, T>) => S
  ) {
    return this.storeModule.setPayloadAction<T>(type, tinyReducer);
  }

  build<
    A extends
      | { [key: string]: (...args: any) => PayloadAction<ActionType, any> }
      | { [key: string]: (...args: any) => SimpleAction<ActionType> },
    T extends {
      [key: string]: (...args: any) => ProcessAction<any, S, null, AnyAction>;
    }
  >(newActions: A = {} as A, newThunks: T = {} as T) {
    const Context = this.storeModule.getContext();
    const useContext = this.storeModule.useContext(
      Context,
      newActions,
      newThunks
    );

    const Provider: React.FC = ({ children }) => (
      <Context.Provider value={this.storeModule.getMemoValueHook()()}>
        {children}
      </Context.Provider>
    );

    return { Provider, useContext };
  }
}
