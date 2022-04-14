import { SetupStore } from './SetupStore';

export interface Action<T = any> {
  type: T;
}
export type AnyAction = Action<any>;

export interface SimpleAction<TType = Action> {
  type: TType;
}
export interface PayloadAction<TType, TPayload> extends SimpleAction<TType> {
  payload: TPayload;
}

export type StoreModuleActions<ActionType> =
  | SimpleAction<ActionType>
  | PayloadAction<ActionType, any>;

/**
 * The folowing ProcessDispatch and ProcessAction are taken from redux-thunk
 * https://github.com/reduxjs/redux-thunk/blob/84128f08b2bc4883e46bb9a6042778b4c37b9bb2/src/types.ts
 *
 * Since it works the same, I decided to leave it as is. I like the overloading and naming they use, so why re-invent the wheel?
 */

/**
 * The dispatch method as modified by React-Kiss; overloaded so that you can
 * dispatch:
 *   - standard (object) actions: `dispatch()` returns the action itself
 *   - thunk actions: `dispatch()` returns the thunk's return value
 *
 * @template State The redux state
 * @template ExtraThunkArg The extra argument passed to the inner function of
 * thunks (if specified when setting up the Thunk middleware)
 * @template BasicAction The (non-thunk) actions that can be dispatched.
 */
export interface ProcessDispatch<
  State,
  ExtraThunkArg,
  BasicAction extends Action
> {
  // When the thunk middleware is added, `store.dispatch` now has three overloads (NOTE: the order here matters for correct behavior and is very fragile - do not reorder these!):

  // 1) The specific thunk function overload
  /** Accepts a thunk function, runs it, and returns whatever the thunk itself returns */
  <ReturnType>(
    thunkAction: ProcessAction<ReturnType, State, ExtraThunkArg, BasicAction>
  ): ReturnType;

  // 2) The base overload.
  /** Accepts a standard action object, and returns that action object */
  <Action extends BasicAction>(action: Action): Action;

  // 3) A union of the other two overloads. This overload exists to work around a problem
  //   with TS inference ( see https://github.com/microsoft/TypeScript/issues/14107 )
  /** A union of the other two overloads for TS inference purposes */
  <ReturnType, Action extends BasicAction>(
    action:
      | Action
      | ProcessAction<ReturnType, State, ExtraThunkArg, BasicAction>
  ): Action | ReturnType;
}

/**
 * A "thunk" action (a callback function that can be dispatched to the Redux
 * store.)
 *
 * Also known as the "thunk inner function", when used with the typical pattern
 * of an action creator function that returns a thunk action.
 *
 * @template ReturnType The return type of the thunk's inner function
 * @template State The redux state
 * @template ExtraThunkArg Optional extra argument passed to the inner function
 * (if specified when setting up the Thunk middleware)
 * @template BasicAction The (non-thunk) actions that can be dispatched.
 */
export type ProcessAction<
  ReturnType,
  State,
  ExtraThunkArg,
  BasicAction extends Action
> = (
  dispatch: ProcessDispatch<State, ExtraThunkArg, BasicAction>,
  getState: () => State,
  extraArgument: ExtraThunkArg
) => ReturnType;

export { SetupStore };
