import React from 'react';
import ReactDOM from 'react-dom';
import { fireEvent, getByTestId, render } from '@testing-library/react';

import { SetupStore } from './SetupStore';

type ElementType = {
  id: string;
  x: number;
  y: number;
};

enum ActionType {
  INCREMENT,
  DECREMENT,
  RESET,
}
type CountState = { elements: ElementType[] };

const s = new SetupStore<ActionType, CountState>('', { elements: [] });

/**
 * Exportable Actions
 */
const addMultiple = s.setPayloadAction<ElementType[]>(
  ActionType.INCREMENT,
  (state, action) => ({
    ...state,
    elements: [...state.elements, ...action.payload],
  })
);
const reset = s.setSimpleAction(ActionType.RESET, () => s.getInitialState());

const { Provider: AdditionProvider, useContext: useCount } = s.build({
  addMultiple: (els: ElementType[]) => addMultiple(els),
  reset,
});

const AdditionRaw = () => {
  let {
    state,
    actions: { addMultiple, reset },
  } = useCount();

  const toLocaleNumber = (num: number) => {
    const firstPart = Number(num.toFixed(0))
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    const secondPart = Number(num.toString().slice(num.toString().indexOf('.')))
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    return firstPart + (secondPart === '0' ? '' : ',' + secondPart);
  };

  const add = async (value: number) => {
    const t0 = Date.now();
    const toAdd = [];
    for (let index = 0; index < value; index++) {
      const element: ElementType = { id: 'test', x: 1, y: 1 };
      toAdd.push(element);
    }
    await addMultiple(toAdd);
    console.log(`Added ${toLocaleNumber(value)} in ${Date.now() - t0}ms`);
  };

  return (
    <div className="App">
      <h1>Testing React Hooks</h1>
      <p data-testid="countvalue">{state.elements.length}</p>

      <button data-testid="reset" onClick={reset}>
        reset
      </button>

      <button data-testid="addHundred" onClick={() => add(100)}>
        100
      </button>

      <button data-testid="addThousand" onClick={() => add(1000)}>
        10 00
      </button>

      <button data-testid="addTenThousand" onClick={() => add(10000)}>
        10 000
      </button>

      <button data-testid="addMillion" onClick={() => add(1000000)}>
        1 000 000
      </button>

      <button data-testid="addTenMillion" onClick={() => add(10000000)}>
        10 000 000
      </button>

      <button data-testid="addTwentyMillion" onClick={() => add(20000000)}>
        20 000 000
      </button>
    </div>
  );
};

const Addition = () => (
  <AdditionProvider>
    <AdditionRaw />
  </AdditionProvider>
);

describe('Filter function', () => {
  // test stuff

  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Addition />, div);
    ReactDOM.unmountComponentAtNode(div);
  });

  it('App loads with initial state of 0', () => {
    const { container } = render(<Addition />);
    expect(getByTestId(container, 'countvalue').textContent).toEqual('0');
  });

  it('Accomulating', async () => {
    const { container } = render(<Addition />);
    const countValue = getByTestId(container, 'countvalue');
    expect(countValue.textContent).toBe('0');

    await fireEvent.click(getByTestId(container, 'addHundred'));
    expect(countValue.textContent).toBe('100');

    await fireEvent.click(getByTestId(container, 'addThousand'));
    expect(countValue.textContent).toBe('1100');

    await fireEvent.click(getByTestId(container, 'addTenThousand'));
    expect(countValue.textContent).toBe('11100');

    await fireEvent.click(getByTestId(container, 'addMillion'));
    expect(countValue.textContent).toBe('1011100');

    await fireEvent.click(getByTestId(container, 'addTenMillion'));
    expect(countValue.textContent).toBe('11011100');

    await fireEvent.click(getByTestId(container, 'addTwentyMillion'));
    expect(countValue.textContent).toBe('31011100');
  });

  it('Resetting', async () => {
    const { container } = render(<Addition />);
    const countValue = getByTestId(container, 'countvalue');
    expect(countValue.textContent).toBe('0');

    await fireEvent.click(getByTestId(container, 'reset'));
    await fireEvent.click(getByTestId(container, 'addHundred'));
    expect(countValue.textContent).toBe('100');

    await fireEvent.click(getByTestId(container, 'reset'));
    await fireEvent.click(getByTestId(container, 'addThousand'));
    expect(countValue.textContent).toBe('1000');

    await fireEvent.click(getByTestId(container, 'reset'));
    await fireEvent.click(getByTestId(container, 'addTenThousand'));
    expect(countValue.textContent).toBe('10000');

    await fireEvent.click(getByTestId(container, 'reset'));
    await fireEvent.click(getByTestId(container, 'addMillion'));
    expect(countValue.textContent).toBe('1000000');

    await fireEvent.click(getByTestId(container, 'reset'));
    await fireEvent.click(getByTestId(container, 'addTenMillion'));
    expect(countValue.textContent).toBe('10000000');

    await fireEvent.click(getByTestId(container, 'reset'));
    await fireEvent.click(getByTestId(container, 'addTwentyMillion'));
    expect(countValue.textContent).toBe('20000000');
  });
});
