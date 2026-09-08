import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { ProjectOverlay } from './projectOverlay';
import { apiRequest } from 'helpers/apiClient';
import { isAdmin } from 'components/shared/helpers/auth';

jest.mock('helpers/apiClient', () => ({
  apiRequest: jest.fn()
}));

jest.mock('components/shared/helpers/auth', () => ({
  isAdmin: jest.fn(() => false)
}));

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));

const mockedApiRequest = apiRequest as jest.MockedFunction<typeof apiRequest>;
const mockedIsAdmin = isAdmin as jest.MockedFunction<typeof isAdmin>;

const sampleProject = {
  uuid: 'proj-1',
  title: 'Overlay Project',
  description: 'Overlay description',
  source: 'https://example.com/source',
  img_url: 'overlay.png',
  technology: ['Drones', 'AI'],
  use_case: 'Assessment',
  partner: ['UNDP'],
  disaster_type: 'Flood',
  un_host: ['UNDP'],
  data: ['Spatial'],
  theme: 'DRM',
  date_of_implementation: '2021'
};

const renderOverlay = (
  props: Partial<React.ComponentProps<typeof ProjectOverlay>> = {}
) => {
  const onClose = props.onClose || jest.fn();
  return {
    onClose,
    ...render(
      <ChakraProvider>
        <ProjectOverlay
          project={sampleProject}
          isOpen
          onClose={onClose}
          {...props}
        />
      </ChakraProvider>
    )
  };
};

describe('ProjectOverlay', () => {
  beforeEach(() => {
    localStorage.clear();
    mockNavigate.mockClear();
    mockedApiRequest.mockReset();
    mockedIsAdmin.mockReturnValue(false);
    jest.spyOn(window, 'alert').mockImplementation(() => {});
    jest.spyOn(window, 'confirm').mockReturnValue(true);
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { ...window.location, reload: jest.fn() }
    });
  });

  afterEach(() => {
    (window.alert as jest.Mock).mockRestore?.();
    (window.confirm as jest.Mock).mockRestore?.();
  });

  it('returns null when there is no project', () => {
    const { container } = renderOverlay({ project: null });
    expect(container).toBeEmptyDOMElement();
  });

  it('renders project content when open', () => {
    renderOverlay();

    expect(screen.getByRole('heading', { name: 'Overlay Project' })).toBeInTheDocument();
    expect(screen.getByText('Overlay description')).toBeInTheDocument();
    expect(screen.getByText('Drones')).toBeInTheDocument();
    expect(screen.getByText('Assessment')).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /see project source/i })
    ).toHaveAttribute('href', 'https://example.com/source');
  });

  it('closes from the backdrop and close button', () => {
    const { onClose, container } = renderOverlay();

    fireEvent.click(container.querySelector('.overlay-backdrop') as Element);
    expect(onClose).toHaveBeenCalled();

    fireEvent.click(container.querySelector('.close-btn') as Element);
    expect(onClose).toHaveBeenCalledTimes(2);
  });

  it('loads the image and falls back on error', () => {
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    renderOverlay();

    expect(screen.getByText('Loading image...')).toBeInTheDocument();

    const img = screen.getByAltText('Overlay Project Image');
    fireEvent.load(img);
    expect(screen.queryByText('Loading image...')).not.toBeInTheDocument();

    fireEvent.error(img);
    expect(logSpy).toHaveBeenCalled();
    expect(img).toHaveAttribute(
      'src',
      expect.stringContaining('fallback-image.png')
    );
    logSpy.mockRestore();
  });

  it('updates the selected section and scrolls', () => {
    const scrollIntoView = jest.fn();
    jest.spyOn(document, 'getElementById').mockReturnValue({
      scrollIntoView
    } as any);

    renderOverlay();

    [
      'Details',
      'Technology',
      'Use Case',
      'Partners',
      'Other Details'
    ].forEach((label) => {
      fireEvent.click(screen.getByRole('button', { name: label }));
      expect(screen.getByRole('button', { name: label })).toHaveClass('active');
    });
    expect(scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });
  });

  it('surfaces delete click handler errors when delete rejects unexpectedly', async () => {
    mockedIsAdmin.mockReturnValue(true);
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    // Force handleDelete promise rejection outside its internal catch by throwing sync after confirm
    (window.confirm as jest.Mock).mockImplementation(() => {
      throw new Error('confirm blew up');
    });
    renderOverlay();

    fireEvent.click(screen.getByRole('button', { name: /delete/i }));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith(
        'There was an error deleting the project. Please try again.'
      );
    });
    errorSpy.mockRestore();
  });

  it('navigates to edit and closes for admins', () => {
    mockedIsAdmin.mockReturnValue(true);
    const { onClose } = renderOverlay();

    fireEvent.click(screen.getByRole('button', { name: /edit/i }));

    expect(mockNavigate).toHaveBeenCalledWith('/projects/proj-1/edit');
    expect(onClose).toHaveBeenCalled();
  });

  it('deletes as admin, closes, and reloads', async () => {
    mockedIsAdmin.mockReturnValue(true);
    mockedApiRequest.mockResolvedValue({} as any);
    localStorage.setItem('drr-projects-list', 'cached');
    const { onClose } = renderOverlay();

    fireEvent.click(screen.getByRole('button', { name: /delete/i }));

    await waitFor(() => {
      expect(mockedApiRequest).toHaveBeenCalledWith(
        'admin/projects/proj-1',
        expect.objectContaining({ method: 'DELETE' })
      );
      expect(localStorage.getItem('drr-projects-list')).toBeNull();
      expect(window.alert).toHaveBeenCalledWith('Deleted successfully');
      expect(onClose).toHaveBeenCalled();
      expect(window.location.reload).toHaveBeenCalled();
    });
  });

  it('cancels delete when confirm is declined', () => {
    mockedIsAdmin.mockReturnValue(true);
    (window.confirm as jest.Mock).mockReturnValue(false);
    renderOverlay();

    fireEvent.click(screen.getByRole('button', { name: /delete/i }));

    expect(mockedApiRequest).not.toHaveBeenCalled();
  });

  it('alerts when delete fails', async () => {
    mockedIsAdmin.mockReturnValue(true);
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    mockedApiRequest.mockRejectedValue(new Error('network'));
    renderOverlay();

    fireEvent.click(screen.getByRole('button', { name: /delete/i }));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith(
        'There was an error. Please try again'
      );
    });
    errorSpy.mockRestore();
  });

  it('uses fallback fields when optional project data is missing', () => {
    renderOverlay({
      project: {
        uuid: 'sparse',
        'Ideas/Concepts/Examples': 'Legacy Title',
        Description: 'Legacy description'
      }
    });

    expect(screen.getByRole('heading', { name: 'Legacy Title' })).toBeInTheDocument();
    expect(screen.getByText('Legacy description')).toBeInTheDocument();
    expect(screen.getByText('Artificial Intelligence')).toBeInTheDocument();
    expect(screen.getByText('ITU')).toBeInTheDocument();
  });
});
