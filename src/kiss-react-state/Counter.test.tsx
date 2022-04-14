import React from 'react';
import ReactDOM from 'react-dom';
import { fireEvent, getByTestId, render } from '@testing-library/react';

import { AnyAction, ProcessAction, SetupStore } from './index';

enum ActionType {
  INCREMENT,
  DECREMENT,
  RESET,
}
type CountState = { counter: number };

const s = new SetupStore<ActionType, CountState>('', { counter: 0 });

/**
 * Exportable Actions
 */
const increment = s.setPayloadAction<number>(
  ActionType.INCREMENT,
  (state, action) => ({
    ...state,
    counter: state.counter + action.payload,
  })
);
const decrement = s.setPayloadAction<number>(
  ActionType.DECREMENT,
  (state, action) => ({
    ...state,
    counter: state.counter - action.payload,
  })
);
const reset = s.setSimpleAction(ActionType.RESET, () => s.getInitialState());

/**
 * Processees
 */
type AppProcessType<R> = ProcessAction<R, CountState, null, AnyAction>;

type TestAsyncProcess = (amount: number) => AppProcessType<Promise<boolean>>;
const testAsync: TestAsyncProcess = (amount) => async (dispatch) => {
  setTimeout(() => dispatch(increment(amount)), 1000);
  return true;
};

const { Provider: CountProvider, useContext: useCount } = s.build(
  { increment, decrement, reset },
  { testAsync }
);

const Counter = () => {
  let {
    state,
    actions: { increment, decrement },
  } = useCount();

  return (
    <div className="App">
      <h1>Testing React Hooks</h1>
      <p data-testid="countvalue">{state.counter}</p>
      <button data-testid="decrement" onClick={() => decrement(1)}>
        -
      </button>
      <button data-testid="increment" onClick={() => increment(1)}>
        +
      </button>
    </div>
  );
};

const Count = () => (
  <CountProvider>
    <Counter />
  </CountProvider>
);

describe('Counter works', () => {
  // test stuff

  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Count />, div);
    ReactDOM.unmountComponentAtNode(div);
  });

  it('App loads with initial state of 0', () => {
    const { container } = render(<Count />);
    expect(getByTestId(container, 'countvalue').textContent).toEqual('0');
  });

  it('Increment and decrement buttons work', async () => {
    const { container } = render(<Count />);
    const countValue = getByTestId(container, 'countvalue');
    expect(countValue.textContent).toBe('0');

    await fireEvent.click(getByTestId(container, 'increment'));
    expect(countValue.textContent).toBe('1');

    await fireEvent.click(getByTestId(container, 'decrement'));
    expect(countValue.textContent).toBe('0');
  });
});
