import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { HomeCard } from './HomeCard';
import { HomeCardMini } from './HomeCardMini';
import { RecentDisasters } from './RecentDisasters';
import { RecentDisasterCardMini } from './RecentDisasterCardMini';
import { RadarContext } from 'navigation/context';

const mockSetCurrentProject = jest.fn();

const renderWithContext = (ui: React.ReactElement) =>
  render(
    <MemoryRouter>
      <RadarContext.Provider
        value={{ setCurrentProject: mockSetCurrentProject } as any}
      >
        {ui}
      </RadarContext.Provider>
    </MemoryRouter>
  );

describe('home page cards', () => {
  beforeEach(() => {
    mockSetCurrentProject.mockClear();
  });

  it('renders HomeCard and sets current project on click', () => {
    const project = {
      uuid: 'p1',
      name: 'Home Project',
      img_url: 'home.png'
    } as any;

    renderWithContext(
      <HomeCard project={project} fallbackImage='fallback.png' />
    );

    expect(screen.getByText('Home Project')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('link'));
    expect(mockSetCurrentProject).toHaveBeenCalledWith(project);
    expect(screen.getByRole('link')).toHaveAttribute('href', '/projects/p1');
  });

  it('falls back image and title fields on HomeCard', () => {
    const project = {
      'Ideas/Concepts/Examples': 'Legacy Idea',
      'Image Url': 'legacy.png'
    } as any;

    renderWithContext(
      <HomeCard project={project} fallbackImage='fallback.png' />
    );

    expect(screen.getByText('Legacy Idea')).toBeInTheDocument();
    const img = screen.getByAltText('Default Image');
    fireEvent.error(img);
    expect(img).toHaveAttribute('src', 'fallback.png');
  });

  it('renders HomeCardMini with type route and summary', () => {
    const project = {
      slug: 'drones',
      name: 'Drones',
      img_url: 'drones.png',
      summary: 'Aerial mapping'
    } as any;

    renderWithContext(
      <HomeCardMini project={project} type='technologies' />
    );

    expect(screen.getByText('Drones')).toBeInTheDocument();
    expect(screen.getByText('Aerial mapping')).toBeInTheDocument();
    expect(screen.getByRole('link')).toHaveAttribute(
      'href',
      '/technologies/drones'
    );
    fireEvent.click(screen.getByRole('link'));
    expect(mockSetCurrentProject).toHaveBeenCalledWith(project);
  });

  it('uses fallback image on HomeCardMini error', () => {
    const project = {
      slug: 'ai',
      title: 'AI',
      'Image Url': 'broken.png'
    } as any;

    renderWithContext(<HomeCardMini project={project} type='technologies' />);

    const img = screen.getByAltText('Default Image');
    fireEvent.error(img);
    expect(img).toHaveAttribute(
      'src',
      expect.stringContaining('fallback-image.png')
    );
  });

  it('lists recent disasters with links', () => {
    renderWithContext(
      <RecentDisasters
        recentDisasters={[
          {
            uuid: 'd1',
            id: 1,
            title: 'Cyclone',
            summary: 'Help needed'
          }
        ]}
      />
    );

    expect(screen.getByText('Cyclone')).toBeInTheDocument();
    expect(screen.getByText('Help needed')).toBeInTheDocument();
    expect(screen.getByRole('link')).toHaveAttribute(
      'href',
      '/disaster-events/d1'
    );
  });

  it('renders RecentDisasterCardMini and truncates long summaries', () => {
    const longSummary = 'y'.repeat(160);
    renderWithContext(
      <RecentDisasterCardMini
        recentDisaster={{
          uuid: 'e1',
          id: 1,
          title: 'Drought Event',
          summary: longSummary,
          img_url: 'drought.png'
        }}
      />
    );

    expect(screen.getByText('Drought Event')).toBeInTheDocument();
    expect(screen.getByText(/\.\.\./)).toBeInTheDocument();
    expect(screen.getByRole('link')).toHaveAttribute(
      'href',
      '/disaster-events/e1'
    );
  });

  it('omits summary on RecentDisasterCardMini when missing', () => {
    renderWithContext(
      <RecentDisasterCardMini
        recentDisaster={{
          uuid: 'e2',
          id: 2,
          title: 'Short Event',
          summary: '',
          img_url: 'img.png'
        }}
      />
    );

    expect(screen.getByText('Short Event')).toBeInTheDocument();
    expect(screen.queryByText(/\.\.\./)).not.toBeInTheDocument();
  });
});
