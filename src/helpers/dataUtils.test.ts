import {
  formatOptions,
  getDataFromDb,
  getDisasterTypes,
  getProject,
  getTechnologies
} from './dataUtils';

jest.mock('helpers/databaseClient', () => ({
  DATA_VERSION: 'test-version'
}));

jest.mock('helpers/apiClient', () => ({
  apiRequest: jest.fn()
}));

const { apiRequest } = jest.requireMock('helpers/apiClient') as {
  apiRequest: jest.Mock;
};

describe('dataUtils', () => {
  beforeEach(() => {
    localStorage.clear();
    apiRequest.mockReset();
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    (console.error as jest.Mock).mockRestore();
  });

  describe('formatOptions', () => {
    it('maps rows to label/value options by key', () => {
      expect(
        formatOptions([{ name: 'GIS' }, { name: 'AI' }], 'name')
      ).toEqual([
        { label: 'GIS', value: 'GIS' },
        { label: 'AI', value: 'AI' }
      ]);
    });
  });

  describe('getTechnologies', () => {
    it('uses cached technologies when the version matches', async () => {
      localStorage.setItem(
        'drr-technologies',
        JSON.stringify({
          version: 'test-version',
          data: [{ name: 'Cached Tech' }]
        })
      );
      const setter = jest.fn();

      await getTechnologies(setter);

      expect(apiRequest).not.toHaveBeenCalled();
      expect(setter).toHaveBeenCalledWith([
        { label: 'Cached Tech', value: 'Cached Tech' }
      ]);
    });

    it('fetches and caches technologies when cache is missing', async () => {
      apiRequest.mockResolvedValue({ data: [{ name: 'Fresh Tech' }] });
      const setter = jest.fn();

      await getTechnologies(setter);

      expect(apiRequest).toHaveBeenCalledWith('public/technologies');
      expect(setter).toHaveBeenCalledWith([
        { label: 'Fresh Tech', value: 'Fresh Tech' }
      ]);
      expect(JSON.parse(localStorage.getItem('drr-technologies') as string)).toEqual({
        version: 'test-version',
        data: [{ name: 'Fresh Tech' }]
      });
    });
  });

  describe('getDisasterTypes', () => {
    it('returns cached disaster types without fetching', async () => {
      const cached = [{ id: 1, name: 'Flood' }];
      localStorage.setItem(
        'drr-disaster-types',
        JSON.stringify({ version: 'test-version', data: cached })
      );
      const setter = jest.fn();

      const result = await getDisasterTypes(setter);

      expect(apiRequest).not.toHaveBeenCalled();
      expect(setter).toHaveBeenCalledWith(cached);
      expect(result).toEqual({ data: cached });
    });
  });

  describe('getProject', () => {
    it('loads a radar project detail', async () => {
      apiRequest.mockResolvedValue({ data: { uuid: 'p1', title: 'Radar' } });
      const setter = jest.fn();

      await getProject(setter, true, 'p1');

      expect(apiRequest).toHaveBeenCalledWith('public/details/radar-project/p1');
      expect(setter).toHaveBeenCalledWith({ uuid: 'p1', title: 'Radar' });
    });

    it('loads a regular project detail', async () => {
      apiRequest.mockResolvedValue({ data: { uuid: 'p2' } });
      const setter = jest.fn();

      await getProject(setter, false, 'id with spaces');

      expect(apiRequest).toHaveBeenCalledWith(
        'public/details/project/id%20with%20spaces'
      );
    });
  });

  describe('getDataFromDb', () => {
    it('throws for unsupported reference resources', async () => {
      await expect(
        getDataFromDb(jest.fn(), {
          cacheKey: 'drr-x',
          tableName: 'unknown_table',
          columnName: 'all'
        })
      ).rejects.toThrow('Unsupported public reference resource: unknown_table');
    });

    it('fetches and caches a supported reference resource', async () => {
      apiRequest.mockResolvedValue({
        data: [{ theme: 'Climate' }, { theme: 'Health' }]
      });
      const setter = jest.fn();

      const result = await getDataFromDb(setter, {
        cacheKey: 'drr-themes',
        tableName: 'themes',
        columnName: 'all',
        sortBy: 'theme'
      });

      expect(apiRequest).toHaveBeenCalledWith('public/themes');
      expect(setter).toHaveBeenCalledWith([
        { label: 'Climate', value: 'Climate' },
        { label: 'Health', value: 'Health' }
      ]);
      expect(result).toEqual({
        data: [{ theme: 'Climate' }, { theme: 'Health' }]
      });
    });
  });
});
