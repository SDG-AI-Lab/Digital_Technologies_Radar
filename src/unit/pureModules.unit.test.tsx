import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { AppConst } from 'components/constants/app';
import { techButtonColors } from 'components/drawers/tech/colors';
import { DATA_VERSION, getDataVersion } from 'helpers/databaseClient';
import { OutletContext } from 'pages/views/OutletContext';
import { aboutContentList } from 'pages/about/AboutContent';
import { volunteerContentList } from 'pages/volunteers/VolunteerContent';
import usePagination from 'pages/search/Pagination';

jest.mock('helpers/apiClient', () => ({
  apiRequest: jest.fn()
}));

jest.mock('@undp_sdg_ai_lab/undp-radar', () => ({
  Utilities: {
    createSlug: (s: string) => String(s).toLowerCase().replace(/\s+/g, '-')
  }
}));

const { apiRequest } = jest.requireMock('helpers/apiClient') as {
  apiRequest: jest.Mock;
};

const PaginationProbe: React.FC = () => {
  const pager = usePagination([{ a: 1 }, { a: 2 }, { a: 3 }] as any, 2);
  return (
    <div>
      <span data-testid='page'>{pager.currentPage}</span>
      <span data-testid='count'>{pager.currentData().length}</span>
      <button type='button' onClick={() => pager.next()}>
        next
      </button>
    </div>
  );
};

describe('unit: constants, helpers, and pure page modules', () => {
  beforeEach(() => {
    localStorage.clear();
    apiRequest.mockReset();
  });

  it('exposes AppConst and tech button colors', () => {
    expect(AppConst.technologyDescriptions.size).toBeGreaterThan(0);
    expect(techButtonColors.length).toBeGreaterThan(0);
    expect(techButtonColors[0]).toMatch(/^#/);
  });

  it('loads DATA_VERSION and refreshes stale local cache keys', async () => {
    expect(typeof DATA_VERSION).toBe('string');
    localStorage.setItem('drr-data-version', 'old');
    localStorage.setItem('drr-technologies', 'x');
    localStorage.setItem('drr-access-token', 'keep');
    apiRequest.mockResolvedValue({ data: { data_version: 'new-v' } });

    await getDataVersion();

    expect(localStorage.getItem('drr-data-version')).toBe('new-v');
    expect(localStorage.getItem('drr-technologies')).toBeNull();
    expect(localStorage.getItem('drr-access-token')).toBe('keep');
  });

  it('exposes OutletContext default and content lists', () => {
    expect(OutletContext).toBeTruthy();
    expect(aboutContentList.length).toBeGreaterThan(0);
    expect(aboutContentList[0].title).toBeTruthy();
    expect(volunteerContentList.length).toBeGreaterThan(0);
    expect(volunteerContentList[0].name).toBeTruthy();
  });

  it('paginates with usePagination', () => {
    render(<PaginationProbe />);
    expect(screen.getByTestId('count')).toHaveTextContent('2');
    fireEvent.click(screen.getByText('next'));
    expect(screen.getByTestId('page')).toHaveTextContent('2');
    expect(screen.getByTestId('count')).toHaveTextContent('1');
  });
});
