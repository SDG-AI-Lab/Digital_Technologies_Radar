import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { MemoryRouter } from 'react-router-dom';
import { ProjectFormFields } from './ProjectFormFields';
import { RadarContext } from 'navigation/context';

jest.mock('pages/projectAction/SelectMultiple', () => ({
  SelectMultiple: ({ label, options, loading, onChange, selectedValues }: any) => (
    <div data-testid={`select-multiple-${label}`}>
      <span data-testid='loading'>{String(loading)}</span>
      <span data-testid='selected'>{selectedValues?.length || 0}</span>
      <span data-testid='options'>{options?.length || 0}</span>
      <button
        type='button'
        onClick={() =>
          onChange((prev: any) => ({ ...prev, [label]: '{Opt}' }))
        }
      >
        change-{label}
      </button>
    </div>
  )
}));

const baseValues = {
  title: 'My Project',
  description: 'Details here',
  status: 'Idea',
  country: ''
};

const renderField = (
  field: any,
  {
    pathname = '/projects/new',
    search = '',
    currentProject = {},
    hasFetchedData = true,
    handleChange = jest.fn(),
    setProjectFormValues = jest.fn(),
    projectFormValues = baseValues
  }: any = {}
) =>
  render(
    <ChakraProvider>
      <MemoryRouter initialEntries={[`${pathname}${search}`]}>
        <RadarContext.Provider value={{ currentProject } as any}>
          <ProjectFormFields
            field={field}
            hasFetchedData={hasFetchedData}
            projectFormValues={projectFormValues}
            handleChange={handleChange}
            setProjectFormValues={setProjectFormValues}
          />
        </RadarContext.Provider>
      </MemoryRouter>
    </ChakraProvider>
  );

describe('ProjectFormFields', () => {
  it('renders text input and forwards changes', () => {
    const handleChange = jest.fn();
    renderField({ label: 'title', type: 'text' }, { handleChange });

    const input = screen.getByTestId('field-title');
    expect(input).toHaveValue('My Project');
    fireEvent.change(input, { target: { name: 'title', value: 'Updated' } });
    expect(handleChange).toHaveBeenCalled();
  });

  it('renders textarea fields', () => {
    renderField({ label: 'description', type: 'textArea' });
    expect(screen.getByTestId('field-description')).toHaveValue('Details here');
  });

  it('renders selectText options', () => {
    const handleChange = jest.fn();
    renderField(
      {
        label: 'status',
        type: 'selectText',
        options: [{ name: 'Idea' }, { name: 'Prototype' }]
      },
      { handleChange }
    );

    const select = screen.getByTestId('field-status');
    expect(select).toBeInTheDocument();
    expect(screen.getByText('Idea')).toBeInTheDocument();
    expect(screen.getByText('Prototype')).toBeInTheDocument();
    fireEvent.change(select, { target: { value: 'Prototype' } });
    expect(handleChange).toHaveBeenCalled();
  });

  it('renders selectArray with empty selection on new path', () => {
    renderField(
      {
        label: 'country',
        type: 'selectArray',
        options: [{ name: 'Fiji', label: 'Fiji', value: 'Fiji' }]
      },
      { hasFetchedData: false }
    );

    expect(screen.getByTestId('select-multiple-country')).toBeInTheDocument();
    expect(screen.getByTestId('loading')).toHaveTextContent('true');
    expect(screen.getByTestId('selected')).toHaveTextContent('0');
  });

  it('maps current project values for selectArray on edit path', () => {
    renderField(
      {
        label: 'country',
        type: 'selectArray',
        options: [{ name: 'Fiji', label: 'Fiji', value: 'Fiji' }]
      },
      {
        pathname: '/projects/edit/1',
        currentProject: { country: ['Fiji', 'Samoa'] }
      }
    );

    expect(screen.getByTestId('selected')).toHaveTextContent('2');
  });

  it('splits use_case and radar disaster_cycles for selected values', () => {
    renderField(
      {
        label: 'use_case',
        type: 'selectArray',
        options: []
      },
      {
        pathname: '/projects/edit/1',
        currentProject: { use_case: 'Mapping,Alerting' }
      }
    );
    expect(screen.getByTestId('selected')).toHaveTextContent('2');

    renderField(
      {
        label: 'disaster_cycles',
        type: 'selectArray',
        options: []
      },
      {
        pathname: '/projects/edit/1',
        search: '?from-radar=true',
        currentProject: { disaster_cycle: 'Preparedness,Response' }
      }
    );
    expect(screen.getAllByTestId('selected')[1]).toHaveTextContent('2');
  });

  it('falls back to default text input for unknown types', () => {
    const { container } = renderField({ label: 'other', type: 'unknown' });
    expect(container.querySelector('input[type="text"]')).toBeInTheDocument();
  });
});
