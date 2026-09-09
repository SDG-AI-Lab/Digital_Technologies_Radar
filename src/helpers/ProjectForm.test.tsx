import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { MemoryRouter } from 'react-router-dom';
import { axe } from 'jest-axe';
import { ProjectForm } from './ProjectForm';
import { RadarContext } from 'navigation/context';

jest.mock('pages/projectAction/SelectMultiple', () => ({
  SelectMultiple: ({ label }: any) => (
    <div data-testid={`select-multiple-${label}`} />
  )
}));

const fields = [
  { label: 'title', type: 'text' },
  { label: 'description', type: 'textArea' },
  {
    label: 'status',
    type: 'selectText',
    options: ['Idea', 'Validation']
  }
];

const renderForm = (title = 'Add New Project') => {
  const action = jest.fn();
  const utils = render(
    <ChakraProvider>
      <MemoryRouter initialEntries={['/projects/new']}>
        <RadarContext.Provider value={{ currentProject: {} } as any}>
          <ProjectForm
            data={fields}
            title={title}
            action={action}
            hasFetchedData
            projectFormValues={{
              title: 'Demo',
              description: 'About the project',
              status: 'Idea'
            }}
            handleChange={jest.fn()}
            setProjectFormValues={jest.fn()}
          />
        </RadarContext.Provider>
      </MemoryRouter>
    </ChakraProvider>
  );
  return { ...utils, action };
};

describe('ProjectForm', () => {
  it('renders title, labeled fields, and Add submit CTA', () => {
    const { action } = renderForm('Add New Project');

    expect(
      screen.getByRole('heading', { name: 'Add New Project' })
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/TITLE:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/DESCRIPTION:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/STATUS:/i)).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('project-form-submit'));
    expect(screen.getByTestId('project-form-submit')).toHaveTextContent(
      'Add Project'
    );
    expect(action).toHaveBeenCalled();
  });

  it('shows Update Project CTA for edit titles', () => {
    renderForm('Update Project Details');

    expect(screen.getByTestId('project-form-submit')).toHaveTextContent(
      'Update Project'
    );
  });

  it('associates labels with fields and has no basic a11y violations', async () => {
    const { container } = renderForm();

    expect(screen.getByLabelText(/TITLE:/i)).toHaveValue('Demo');
    expect(screen.getByLabelText(/DESCRIPTION:/i)).toHaveValue(
      'About the project'
    );

    expect(
      await axe(container, {
        rules: { 'color-contrast': { enabled: false } }
      })
    ).toHaveNoViolations();
  });
});
