import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { ProjectForm } from './ProjectForm';

jest.mock('./ProjectFormFields', () => ({
  ProjectFormFields: ({ field }: any) => (
    <div data-testid={`mock-field-${field.label}`}>{field.type}</div>
  )
}));

const fields = [
  { label: 'title', type: 'text' },
  { label: 'use_case', type: 'selectArray' }
];

const renderForm = (title = 'Add New Project') => {
  const action = jest.fn();
  const utils = render(
    <ChakraProvider>
      <ProjectForm
        data={fields}
        title={title}
        action={action}
        hasFetchedData
        projectFormValues={{ title: '', use_case: '' }}
        handleChange={jest.fn()}
        setProjectFormValues={jest.fn()}
      />
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
    expect(screen.getByText('TITLE:')).toBeInTheDocument();
    expect(screen.getByText('USE CASE:')).toBeInTheDocument();
    expect(screen.getByTestId('mock-field-title')).toHaveTextContent('text');
    expect(screen.getByTestId('mock-field-use_case')).toHaveTextContent(
      'selectArray'
    );

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
});
