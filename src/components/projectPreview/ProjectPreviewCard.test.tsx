import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ProjectPreviewCard } from './ProjectPreviewCard';
import { RadarContext } from 'navigation/context';

jest.mock('components/shared/projectBadges/ProjectBadges', () => ({
  ProjectBadge: () => <div data-testid='project-badge'>badges</div>
}));

const mockSetCurrentProject = jest.fn();

const project = {
  uuid: 'proj-1',
  id: '1',
  title: 'Coastal Sensors',
  description: 'Monitors sea levels',
  img_url: 'https://example.com/coastal.png'
} as any;

const renderCard = () =>
  render(
    <MemoryRouter>
      <RadarContext.Provider
        value={{ setCurrentProject: mockSetCurrentProject } as any}
      >
        <ProjectPreviewCard project={project} />
      </RadarContext.Provider>
    </MemoryRouter>
  );

describe('ProjectPreviewCard', () => {
  beforeEach(() => {
    mockSetCurrentProject.mockClear();
  });

  it('renders title, description, image, and badges', () => {
    renderCard();

    expect(screen.getByText('Coastal Sensors')).toBeInTheDocument();
    expect(screen.getByText('Monitors sea levels')).toBeInTheDocument();
    expect(screen.getByText('Learn More')).toBeInTheDocument();
    expect(screen.getByTestId('project-badge')).toBeInTheDocument();

    const img = screen.getByAltText('Project image');
    expect(img).toHaveAttribute('src', 'https://example.com/coastal.png');
  });

  it('links to project details and sets current project', () => {
    renderCard();

    const links = screen.getAllByRole('link');
    expect(links[0]).toHaveAttribute('href', '/projects/proj-1');

    fireEvent.click(links[0]);
    expect(mockSetCurrentProject).toHaveBeenCalledWith(project);

    fireEvent.click(screen.getByText('Learn More'));
    expect(mockSetCurrentProject).toHaveBeenCalledTimes(2);
  });

  it('falls back to default image on error', () => {
    renderCard();

    const img = screen.getByAltText('Project image') as HTMLImageElement;
    fireEvent.error(img);

    expect(img.src).toContain('fallback-image.png');
  });
});
