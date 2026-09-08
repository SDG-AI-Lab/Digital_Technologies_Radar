import React from 'react';
import { render, screen } from '@testing-library/react';
import { ProjectsCollection } from './ProjectsCollection';

jest.mock('components/projectPreview/ProjectPreviewCard', () => ({
  ProjectPreviewCard: ({ project }: any) => (
    <div data-testid='preview-card'>{project.title}</div>
  )
}));

describe('ProjectsCollection', () => {
  it('renders a preview card for each project', () => {
    const projects = [
      { id: '1', title: 'Alpha' },
      { id: '2', title: 'Beta' }
    ] as any[];

    render(<ProjectsCollection projects={projects} />);

    const cards = screen.getAllByTestId('preview-card');
    expect(cards).toHaveLength(2);
    expect(screen.getByText('Alpha')).toBeInTheDocument();
    expect(screen.getByText('Beta')).toBeInTheDocument();
  });

  it('renders an empty container when there are no projects', () => {
    const { container } = render(<ProjectsCollection projects={[]} />);

    expect(container.querySelector('.projectsContainer')).toBeInTheDocument();
    expect(screen.queryByTestId('preview-card')).not.toBeInTheDocument();
  });
});
