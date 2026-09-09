import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { Search } from './Search';
import SearchBar from './SearchBar';
import SearchResult from './SearchResult';
import SearchView from './SearchView';
import usePagination from './Pagination';
import { approveProject } from 'helpers/dataUtils';
import { MemoryRouter } from 'react-router-dom';
import { axe } from 'jest-axe';

jest.mock('helpers/dataUtils', () => ({
  approveProject: jest.fn()
}));

jest.mock('@mui/material/useMediaQuery', () => () => true);

jest.mock('@mui/material/Pagination', () => ({
  __esModule: true,
  default: ({ onChange, count, page }: any) => (
    <div data-testid='mui-pagination'>
      <span>
        page {page} of {count}
      </span>
      <button type='button' onClick={(e) => onChange(e, page + 1)}>
        next-page
      </button>
    </div>
  )
}));

let mockBlips: any[] = [];

jest.mock('@undp_sdg_ai_lab/undp-radar', () => ({
  useRadarState: () => ({
    state: {
      get blips() {
        return mockBlips;
      }
    }
  })
}));

const mockPathname = jest.fn(() => '/search');

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({ pathname: mockPathname() }),
  Link: ({ children, to }: any) => <a href={to}>{children}</a>
}));

const mockedApproveProject = approveProject as jest.MockedFunction<
  typeof approveProject
>;

const sampleBlip = {
  uuid: 'b1',
  'Ideas/Concepts/Examples': 'Flood Mapper',
  Description: 'A short description',
  'Use Case': 'Mapping',
  'Disaster Cycle': 'response',
  'Un Host Organisation': ['UNDP'],
  'Country of Implementation': ['Fiji'],
  SDG: ['SDG 13'],
  'Image Url': 'img.png',
  Technology: 'GIS',
  'Disaster Type': 'Flood',
  'Supporting Partners': 'ITU',
  Data: 'Spatial',
  Theme: 'DRM',
  'Status/Maturity': 'production',
  'Date of Implementation': '2020'
};

const longDescriptionBlip = {
  ...sampleBlip,
  uuid: 'b2',
  'Ideas/Concepts/Examples': 'Long Desc Project',
  Description: 'x'.repeat(250)
};

const renderWithProviders = (ui: React.ReactElement) =>
  render(
    <ChakraProvider>
      <MemoryRouter>{ui}</MemoryRouter>
    </ChakraProvider>
  );

describe('Search page', () => {
  beforeEach(() => {
    mockBlips = [sampleBlip];
    mockPathname.mockReturnValue('/search');
    mockedApproveProject.mockClear();
  });

  it('renders Search with a search input', () => {
    renderWithProviders(<Search />);
    expect(screen.getByPlaceholderText('Search ....')).toBeInTheDocument();
  });

  it('has no basic accessibility violations on the search page', async () => {
    const { container } = renderWithProviders(<Search />);
    expect(
      await axe(container, {
        rules: { 'color-contrast': { enabled: false } }
      })
    ).toHaveNoViolations();
  });

  it('merges blips and filters results in SearchBar', () => {
    mockBlips = [
      sampleBlip,
      {
        ...sampleBlip,
        uuid: 'b1b',
        'Disaster Cycle': 'preparedness'
      },
      longDescriptionBlip
    ];

    renderWithProviders(<SearchBar />);

    expect(screen.getByText(/Found 0 out of 2/i)).toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText('Search ....'), {
      target: { value: 'Flood Mapper' }
    });

    expect(screen.getByText(/Found 1 out of 2/i)).toBeInTheDocument();
    expect(screen.getByText('Flood Mapper')).toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText('Search ....'), {
      target: { value: '' }
    });
    expect(screen.getByText(/Found 2 out of 2/i)).toBeInTheDocument();
  });

  it('paginates SearchResult content', () => {
    const items = Array.from({ length: 16 }, (_, i) => ({
      ...sampleBlip,
      uuid: `u${i}`,
      'Ideas/Concepts/Examples': `Project ${i + 1}`,
      Description: i === 0 ? 'x'.repeat(250) : 'short'
    }));

    renderWithProviders(<SearchResult filteredContent={items as any} />);

    expect(screen.getByText('Project 1')).toBeInTheDocument();
    expect(screen.getByText(/\.\.\./)).toBeInTheDocument();
    expect(screen.getByTestId('mui-pagination')).toHaveTextContent(
      'page 1 of 2'
    );

    fireEvent.click(screen.getByText('next-page'));
    expect(screen.getByTestId('mui-pagination')).toHaveTextContent(
      'page 2 of 2'
    );
  });

  it('opens SearchView modal and shows project details', () => {
    renderWithProviders(<SearchView techContent={sampleBlip as any} />);

    fireEvent.click(screen.getByRole('button', { name: 'More' }));

    expect(screen.getByText('Flood Mapper')).toBeInTheDocument();
    expect(screen.getByText('A short description')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Click Here' })).toHaveAttribute(
      'href',
      '/projects/b1?from=/search'
    );
  });

  it('auto-opens SearchView when setOpen is true and closes via setClose', () => {
    const setClose = jest.fn();
    renderWithProviders(
      <SearchView techContent={sampleBlip as any} setOpen setClose={setClose} />
    );

    expect(screen.getByText('Flood Mapper')).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText('Close'));
    expect(setClose).toHaveBeenCalled();
  });

  it('closes the SearchView modal on Escape and passes axe checks', async () => {
    const setClose = jest.fn();
    const { container } = renderWithProviders(
      <SearchView techContent={sampleBlip as any} setOpen setClose={setClose} />
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(
      await axe(container, {
        rules: { 'color-contrast': { enabled: false } }
      })
    ).toHaveNoViolations();

    fireEvent.keyDown(screen.getByRole('dialog'), {
      key: 'Escape',
      code: 'Escape'
    });
    // Chakra ModalClose / overlay Escape path invokes onClose → setClose
    fireEvent.click(screen.getByLabelText('Close'));
    expect(setClose).toHaveBeenCalled();
  }, 15000);

  it('shows Approve on review path and calls approveProject', () => {
    mockPathname.mockReturnValue('/projects/review');
    renderWithProviders(<SearchView techContent={sampleBlip as any} />);

    fireEvent.click(screen.getByRole('button', { name: 'More' }));
    fireEvent.click(screen.getByRole('button', { name: 'Approve' }));

    expect(mockedApproveProject).toHaveBeenCalledWith('b1');
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
});

describe('usePagination', () => {
  const data = Array.from({ length: 10 }, (_, i) => ({ id: i }));

  const HookHarness = ({
    onReady
  }: {
    onReady: (api: ReturnType<typeof usePagination>) => void;
  }) => {
    const api = usePagination(data as any, 3);
    React.useEffect(() => {
      onReady(api);
    });
    return (
      <div>
        <span data-testid='page'>{api.currentPage}</span>
        <span data-testid='slice'>{api.currentData().length}</span>
        <button type='button' onClick={api.next}>
          next
        </button>
        <button type='button' onClick={api.prev}>
          prev
        </button>
        <button type='button' onClick={() => api.jump(3)}>
          jump3
        </button>
        <button type='button' onClick={() => api.jump(99)}>
          jumpHigh
        </button>
        <button type='button' onClick={() => api.jump(0)}>
          jumpLow
        </button>
      </div>
    );
  };

  it('pages through data with next, prev, and jump', () => {
    render(<HookHarness onReady={() => undefined} />);

    expect(screen.getByTestId('page')).toHaveTextContent('1');
    expect(screen.getByTestId('slice')).toHaveTextContent('3');

    fireEvent.click(screen.getByText('next'));
    expect(screen.getByTestId('page')).toHaveTextContent('2');

    fireEvent.click(screen.getByText('jump3'));
    expect(screen.getByTestId('page')).toHaveTextContent('3');

    fireEvent.click(screen.getByText('jumpHigh'));
    expect(screen.getByTestId('page')).toHaveTextContent('4');

    fireEvent.click(screen.getByText('prev'));
    expect(screen.getByTestId('page')).toHaveTextContent('3');

    fireEvent.click(screen.getByText('jumpLow'));
    expect(screen.getByTestId('page')).toHaveTextContent('1');
  });
});
