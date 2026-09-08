import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Project } from './Project';
import { RadarContext } from 'navigation/context';

jest.mock('components/shared/projectBadges/ProjectBadges', () => ({
  ProjectBadge: () => <div data-testid='project-badge'>badges</div>
}));

const mockSetCurrentProject = jest.fn();

const sampleProject = {
  uuid: 'p1',
  title: 'Project Title',
  description: 'Project description',
  img_url: 'project.png'
} as any;

const renderProject = (
  props: Partial<React.ComponentProps<typeof Project>> = {}
) =>
  render(
    <MemoryRouter initialEntries={['/projects']}>
      <RadarContext.Provider
        value={{ setCurrentProject: mockSetCurrentProject } as any}
      >
        <Project project={sampleProject} {...props} />
      </RadarContext.Provider>
    </MemoryRouter>
  );

describe('Project', () => {
  beforeEach(() => {
    mockSetCurrentProject.mockClear();
  });

  it('renders title, description, and badges', () => {
    renderProject();

    expect(screen.getByText('Project Title')).toBeInTheDocument();
    expect(screen.getByText('Project description')).toBeInTheDocument();
    expect(screen.getByTestId('project-badge')).toBeInTheDocument();
  });

  it('navigates via MORE link and sets current project', () => {
    renderProject();

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute(
      'href',
      expect.stringContaining('/projects/p1?from=projects')
    );
    fireEvent.click(link);
    expect(mockSetCurrentProject).toHaveBeenCalledWith(sampleProject);
  });

  it('calls onProjectSelect for overlay mode', () => {
    const onProjectSelect = jest.fn();
    renderProject({ onProjectSelect });

    fireEvent.click(screen.getByRole('button', { name: 'MORE' }));
    expect(onProjectSelect).toHaveBeenCalledWith(sampleProject);
    expect(mockSetCurrentProject).not.toHaveBeenCalled();
  });

  it('uses Review CTA with handler', () => {
    const handler = jest.fn();
    renderProject({ ctaText: 'Review', handler });

    fireEvent.click(screen.getByRole('button', { name: 'Review' }));
    expect(handler).toHaveBeenCalledWith(sampleProject);
  });

  it('falls back to legacy fields and image fallback', () => {
    const legacy = {
      'Ideas/Concepts/Examples': 'Legacy Title',
      Description: 'Legacy description',
      'Image Url': 'legacy.png'
    } as any;

    render(
      <MemoryRouter>
        <RadarContext.Provider
          value={{ setCurrentProject: mockSetCurrentProject } as any}
        >
          <Project project={legacy} />
        </RadarContext.Provider>
      </MemoryRouter>
    );

    expect(screen.getByText('Legacy Title')).toBeInTheDocument();
    expect(screen.getByText('Legacy description')).toBeInTheDocument();

    const img = screen.getByAltText('Default Image');
    fireEvent.error(img);
    expect(img).toHaveAttribute(
      'src',
      expect.stringContaining('fallback-image.png')
    );
  });
});
