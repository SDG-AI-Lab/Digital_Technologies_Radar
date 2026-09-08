import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { FilterItems } from './FilterItems';
import { MultiSelectFilter } from './MultiSelectFilter';
import { RadarContext } from 'navigation/context';

jest.mock('react-multi-select-component', () => ({
  MultiSelect: ({ options, onChange, value }: any) => (
    <div data-testid='multi-select'>
      <span data-testid='selected-count'>{value?.length || 0}</span>
      <button
        type='button'
        onClick={() =>
          onChange([options?.[0] || { label: 'Oceania', value: 'oceania' }])
        }
      >
        select-option
      </button>
    </div>
  )
}));

const mockSetFilteredValues = jest.fn();
const mockSetParameterCount = jest.fn();
const mockSetProjectsGroup = jest.fn();

const baseFilteredValues = {
  status: { Preparedness: false, Response: true },
  stages: { Idea: false },
  technologies: { Drones: false },
  parameters: {
    Region: [],
    'Sub Region': [],
    Country: [],
    'Disaster Type': [],
    'UN Host': [],
    SDG: [],
    Data: []
  }
};

const renderWithContext = (
  ui: React.ReactElement,
  filteredValues: any = baseFilteredValues,
  parameterCount: any = {}
) =>
  render(
    <ChakraProvider>
      <RadarContext.Provider
        value={
          {
            filteredValues,
            setFilteredValues: mockSetFilteredValues,
            parameterCount,
            setParameterCount: mockSetParameterCount,
            setProjectsGroup: mockSetProjectsGroup,
            projectsGroup: ''
          } as any
        }
      >
        {ui}
      </RadarContext.Provider>
    </ChakraProvider>
  );

describe('FilterItems', () => {
  beforeEach(() => {
    mockSetFilteredValues.mockClear();
    mockSetParameterCount.mockClear();
    mockSetProjectsGroup.mockClear();
  });

  it('toggles a filter button selection', () => {
    renderWithContext(
      <FilterItems labels={['Preparedness', 'Response']} category='status' />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Preparedness' }));

    expect(mockSetFilteredValues).toHaveBeenCalled();
    expect(mockSetProjectsGroup).toHaveBeenCalledWith('');
    const next = mockSetFilteredValues.mock.calls[0][0];
    expect(next.status.Preparedness).toBe(true);
  });

  it('marks selected items from filtered values', () => {
    renderWithContext(
      <FilterItems labels={['Preparedness', 'Response']} category='status' />
    );

    expect(screen.getByRole('button', { name: 'Response' })).toHaveClass(
      'filterItem--selected'
    );
  });

  it('updates multi-select parameter filters', () => {
    renderWithContext(
      <FilterItems
        labels={['Region']}
        category='parameters'
        multi
        options={{
          Region: [{ label: 'Oceania', value: 'oceania' }]
        }}
      />,
      baseFilteredValues,
      { Region: 1 }
    );

    expect(screen.getByText('(1)')).toBeInTheDocument();
    fireEvent.click(screen.getByText('select-option'));

    expect(mockSetFilteredValues).toHaveBeenCalled();
    expect(mockSetParameterCount).toHaveBeenCalled();
  });
});

describe('MultiSelectFilter', () => {
  it('syncs selection from context and notifies parent', () => {
    const setMultiSelected = jest.fn();
    renderWithContext(
      <MultiSelectFilter
        options={[{ label: 'Oceania', value: 'oceania' }]}
        label='Region'
        setMultiSelected={setMultiSelected}
      />,
      {
        ...baseFilteredValues,
        parameters: {
          ...baseFilteredValues.parameters,
          Region: [{ label: 'Oceania', value: 'oceania' }]
        }
      }
    );

    expect(screen.getByTestId('selected-count')).toHaveTextContent('1');
    fireEvent.click(screen.getByText('select-option'));
    expect(setMultiSelected).toHaveBeenCalled();
    expect(mockSetProjectsGroup).toHaveBeenCalledWith('');
  });
});
