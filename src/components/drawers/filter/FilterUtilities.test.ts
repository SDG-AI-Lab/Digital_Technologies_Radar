import { FilterUtils } from './FilterUtilities';
import {
  countryKey,
  dataKey,
  implementerKey,
  regionKey,
  sdgKey,
  subregionKey,
  yearKey
} from './FilterConstants';

const sampleBlips = [
  {
    [regionKey]: ['Oceania', ''],
    [subregionKey]: ['Melanesia', ''],
    [countryKey]: ['Fiji', ''],
    [implementerKey]: ['UNDP', ''],
    [sdgKey]: ['SDG 13', 'SDG 1'],
    [yearKey]: '2018',
    [dataKey]: ['Spatial', ''],
    disasterType: 'Flood',
    quadrant: 'response,recovery',
    horizon: 'production',
    useCase: 'Early warning'
  },
  {
    [regionKey]: ['Africa'],
    [subregionKey]: ['Eastern Africa'],
    [countryKey]: ['Kenya'],
    [implementerKey]: ['UNEP'],
    [sdgKey]: ['No Information'],
    [yearKey]: '2020',
    [dataKey]: ['No Information'],
    disasterType: 'Drought',
    quadrant: 'preparedness',
    horizon: 'prototype',
    useCase: 'Assessment'
  },
  {
    [regionKey]: ['Oceania'],
    [subregionKey]: ['Melanesia'],
    [countryKey]: ['Vanuatu'],
    [implementerKey]: ['UNDP'],
    [sdgKey]: ['SDG 13'],
    [yearKey]: 'not-a-year',
    [dataKey]: ['Spatial'],
    disasterType: 'Flood',
    quadrant: 'response',
    horizon: 'production',
    useCase: 'Early warning'
  }
] as any[];

describe('FilterConstants', () => {
  it('exports the expected blip field keys', () => {
    expect(regionKey).toBe('Region');
    expect(subregionKey).toBe('Subregion');
    expect(countryKey).toBe('Country of Implementation');
    expect(implementerKey).toBe('Un Host Organisation');
    expect(sdgKey).toBe('SDG');
    expect(yearKey).toBe('Date of Implementation');
    expect(dataKey).toBe('Data');
  });
});

describe('FilterUtils', () => {
  it('extracts unique sorted regions', () => {
    const regions = FilterUtils.getRegions(sampleBlips, regionKey);
    expect(regions.map((r) => r.name)).toEqual(['Africa', 'Oceania']);
  });

  it('extracts unique sorted subregions with raw blips', () => {
    const subregions = FilterUtils.getSubregions(sampleBlips, subregionKey);
    expect(subregions.map((r) => r.name)).toEqual([
      'Eastern Africa',
      'Melanesia'
    ]);
    expect(subregions[0].raw).toBeDefined();
  });

  it('extracts unique sorted countries', () => {
    const countries = FilterUtils.getCountries(sampleBlips, countryKey);
    expect(countries.map((c) => c.name)).toEqual(['Fiji', 'Kenya', 'Vanuatu']);
  });

  it('extracts unique disaster types', () => {
    const types = FilterUtils.getDisasterTypes(
      sampleBlips,
      'disasterType' as any
    );
    expect(types.map((t) => t.name)).toEqual(['Drought', 'Flood']);
  });

  it('title-cases the first disaster cycle token', () => {
    const cycles = FilterUtils.getDisasterCycles(
      sampleBlips,
      'quadrant' as any
    );
    expect(cycles.map((c) => c.name)).toEqual(['Preparedness', 'Response']);
  });

  it('title-cases maturity stages', () => {
    const stages = FilterUtils.getMaturityStages(
      sampleBlips,
      'horizon' as any
    );
    expect(stages.map((s) => s.name)).toEqual(['Production', 'Prototype']);
  });

  it('extracts unique use cases', () => {
    const useCases = FilterUtils.getUseCases(sampleBlips, 'useCase' as any);
    expect(useCases.map((u) => u.name)).toEqual([
      'Assessment',
      'Early warning'
    ]);
  });

  it('extracts unique implementers', () => {
    const implementers = FilterUtils.getImplementers(
      sampleBlips,
      implementerKey
    );
    expect(implementers.map((i) => i.name)).toEqual(['UNDP', 'UNEP']);
  });

  it('extracts SDGs with natural sort and No Information last', () => {
    const sdgs = FilterUtils.getSDGs(sampleBlips, sdgKey);
    expect(sdgs.map((s) => s.name)).toEqual([
      'SDG 1',
      'SDG 13',
      'No Information'
    ]);
  });

  it('builds a continuous year range from the earliest blip year to now', () => {
    const years = FilterUtils.getYears(sampleBlips, yearKey);
    expect(years[0].name).toBe('2018');
    expect(Number(years[years.length - 1].name)).toBe(new Date().getFullYear());
    expect(years.map((y) => y.name)).toContain('2019');
    expect(years.map((y) => y.name)).toContain('2020');
  });

  it('extracts data options with No Information last', () => {
    const data = FilterUtils.getData(sampleBlips, dataKey);
    expect(data.map((d) => d.name)).toEqual(['Spatial', 'No Information']);
  });

  it('ignores empty disaster types and use cases', () => {
    const blips = [
      {
        disasterType: '',
        useCase: '',
        quadrant: '',
        horizon: ''
      }
    ] as any[];

    expect(
      FilterUtils.getDisasterTypes(blips, 'disasterType' as any)
    ).toEqual([]);
    expect(FilterUtils.getUseCases(blips, 'useCase' as any)).toEqual([]);
  });
});
