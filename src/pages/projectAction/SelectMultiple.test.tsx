import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { SelectMultiple } from './SelectMultiple';

jest.mock('react-multi-select-component', () => ({
  MultiSelect: ({ options, onChange, value, isLoading }: any) => (
    <div data-testid='multi-select'>
      <span data-testid='selected-count'>{value?.length || 0}</span>
      <span data-testid='loading'>{String(!!isLoading)}</span>
      <button
        type='button'
        onClick={() =>
          onChange([
            ...(value || []),
            options?.[1] || { label: 'Samoa', value: 'Samoa' }
          ])
        }
      >
        add-option
      </button>
      <button
        type='button'
        onClick={() =>
          onChange([
            { label: ' Mapping ', value: 'Mapping' },
            { label: 'Alerting', value: 'Alerting' }
          ])
        }
      >
        set-use-case
      </button>
    </div>
  )
}));

describe('SelectMultiple', () => {
  it('initializes from selectedValues and updates parent on change', () => {
    const onChange = jest.fn();
    render(
      <SelectMultiple
        options={[
          { label: 'Fiji', value: 'Fiji', name: 'Fiji' },
          { label: 'Samoa', value: 'Samoa', name: 'Samoa' }
        ]}
        loading={false}
        label='country'
        onChange={onChange}
        selectedValues={[{ label: 'Fiji', value: 'Fiji' }]}
      />
    );

    expect(screen.getByTestId('selected-count')).toHaveTextContent('1');
    expect(onChange).toHaveBeenCalled();

    fireEvent.click(screen.getByText('add-option'));
    expect(onChange).toHaveBeenCalled();
    const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1][0];
    const next = lastCall({ country: '' });
    expect(next.country).toBe('{Fiji, Samoa}');
  });

  it('formats use_case without braces', () => {
    const onChange = jest.fn();
    render(
      <SelectMultiple
        options={[
          { label: 'Mapping', value: 'Mapping', name: 'Mapping' },
          { label: 'Alerting', value: 'Alerting', name: 'Alerting' }
        ]}
        loading
        label='use_case'
        onChange={onChange}
      />
    );

    expect(screen.getByTestId('loading')).toHaveTextContent('true');
    fireEvent.click(screen.getByText('set-use-case'));

    const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1][0];
    const next = lastCall({});
    expect(next.use_case).toBe('Mapping, Alerting');
  });
});
