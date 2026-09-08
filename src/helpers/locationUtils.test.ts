import {
  fetchLocationData,
  isCountryInRegions,
  isCountryInSubregions,
  isSubregionInRegions
} from './locationUtils';

jest.mock('helpers/apiClient', () => ({
  apiRequest: jest.fn()
}));

const { apiRequest } = jest.requireMock('helpers/apiClient') as {
  apiRequest: jest.Mock;
};

describe('locationUtils', () => {
  beforeEach(() => {
    apiRequest.mockReset();
    jest.spyOn(console, 'error').mockImplementation(() => {});
    // Force cache miss by advancing time via re-import is hard; fetch with empty
    // first then populate. Module cache persists across tests in the same file,
    // so seed through fetchLocationData and rely on CACHE_EXPIRY.
  });

  afterEach(() => {
    (console.error as jest.Mock).mockRestore();
  });

  describe('isSubregionInRegions without mapping cache', () => {
    it('allows all subregions when no regions are selected', () => {
      expect(isSubregionInRegions('Pacific', [])).toBe(true);
    });

    it('allows all subregions when Global is selected', () => {
      expect(isSubregionInRegions('Pacific', ['Global'])).toBe(true);
    });

    it('falls back to rawData Region matching', () => {
      expect(
        isSubregionInRegions('Pacific', ['Oceania'], { Region: 'Oceania' })
      ).toBe(true);
      expect(
        isSubregionInRegions('Pacific', ['Africa'], { Region: 'Oceania' })
      ).toBe(false);
    });
  });

  describe('isCountryInRegions / isCountryInSubregions without mapping', () => {
    it('allows all countries when filters are empty', () => {
      expect(isCountryInRegions('Fiji', [])).toBe(true);
      expect(isCountryInSubregions('Fiji', [])).toBe(true);
    });

    it('allows all countries when Global region is selected', () => {
      expect(isCountryInRegions('Fiji', ['Global'])).toBe(true);
    });

    it('uses rawData fallbacks', () => {
      expect(
        isCountryInRegions('Fiji', ['Oceania'], { Region: 'Oceania' })
      ).toBe(true);
      expect(
        isCountryInSubregions('Fiji', ['Melanesia'], {
          Subregion: 'Melanesia'
        })
      ).toBe(true);
    });
  });

  describe('fetchLocationData and mapping-backed checks', () => {
    it('builds region/subregion maps and uses them for membership checks', async () => {
      apiRequest.mockResolvedValue({
        data: [
          { country: 'Fiji', region: 'Oceania', subregion: 'Melanesia' },
          { country: 'Kenya', region: 'Africa', subregion: 'Eastern Africa' },
          { country: 'Vanuatu', region: 'Oceania', subregion: 'Melanesia' }
        ]
      });

      const result = await fetchLocationData();

      expect(apiRequest).toHaveBeenCalledWith('public/locations');
      expect(result.regionToSubregionMap).toEqual({
        Oceania: ['Melanesia'],
        Africa: ['Eastern Africa']
      });
      expect(isSubregionInRegions('Melanesia', ['Oceania'])).toBe(true);
      expect(isSubregionInRegions('Eastern Africa', ['Oceania'])).toBe(false);
      expect(isCountryInRegions('Fiji', ['Oceania'])).toBe(true);
      expect(isCountryInRegions('Kenya', ['Oceania'])).toBe(false);
      expect(isCountryInSubregions('Vanuatu', ['Melanesia'])).toBe(true);
      expect(isCountryInSubregions('Kenya', ['Melanesia'])).toBe(false);
    });

    it('returns empty collections when the API fails', async () => {
      // Bypass in-memory cache from the previous test by mocking expiry:
      // call with a forced failure after clearing module is not available,
      // so assert the error path via a fresh mock rejection when cache expired.
      // When cache is still warm this may hit cache instead — force by
      // temporarily manipulating Date.now.
      const realNow = Date.now;
      Date.now = () => realNow() + 25 * 60 * 60 * 1000;
      apiRequest.mockRejectedValue(new Error('network'));

      const result = await fetchLocationData();

      expect(result).toEqual({ locationData: [], regionToSubregionMap: {} });
      Date.now = realNow;
    });
  });
});
