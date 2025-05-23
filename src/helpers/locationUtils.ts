import { supabase } from 'helpers/databaseClient';

// Interface for the region-subregion mapping
export interface LocationData {
  country: string;
  region: string;
  subregion: string;
}

// Cache for location data
let cachedLocationData: LocationData[] | null = null;
let cachedRegionToSubregionMap: Record<string, string[]> | null = null;
let lastFetchTime = 0;
const CACHE_EXPIRY_TIME = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

/**
 * Fetch location data from the database and cache it
 */
export const fetchLocationData = async (): Promise<{
  locationData: LocationData[];
  regionToSubregionMap: Record<string, string[]>;
}> => {
  // Check if cached data is still valid
  const now = Date.now();
  if (
    cachedLocationData &&
    cachedRegionToSubregionMap &&
    now - lastFetchTime < CACHE_EXPIRY_TIME
  ) {
    return {
      locationData: cachedLocationData,
      regionToSubregionMap: cachedRegionToSubregionMap
    };
  }

  try {
    const { data, error } = await supabase
      .from('locations')
      .select('country, region, subregion');

    if (error) {
      console.error('Error fetching location data:', error);
      // Return empty arrays if there was an error
      return { locationData: [], regionToSubregionMap: {} };
    }

    // Update cache
    cachedLocationData = data || [];
    lastFetchTime = now;

    // Create a mapping of regions to subregions
    const mapping: Record<string, string[]> = {};
    cachedLocationData.forEach((location: LocationData) => {
      if (!mapping[location.region]) {
        mapping[location.region] = [];
      }
      if (!mapping[location.region].includes(location.subregion)) {
        mapping[location.region].push(location.subregion);
      }
    });

    cachedRegionToSubregionMap = mapping;

    return {
      locationData: cachedLocationData,
      regionToSubregionMap: cachedRegionToSubregionMap
    };
  } catch (err) {
    console.error('Error fetching location data:', err);
    return { locationData: [], regionToSubregionMap: {} };
  }
};

/**
 * Check if a subregion belongs to any of the selected regions
 */
export const isSubregionInRegions = (
  subregionName: string,
  selectedRegions: string[],
  rawData?: any
): boolean => {
  // If no regions are selected, show all subregions
  if (selectedRegions.length === 0) {
    return true;
  }

  // If "Global" is selected, show all subregions
  if (selectedRegions.includes('Global')) {
    return true;
  }

  // Check if the subregion belongs to any of the selected regions according to our mapping
  return selectedRegions.some((region) => {
    // If we have the mapping data, use it
    if (
      cachedRegionToSubregionMap &&
      Object.keys(cachedRegionToSubregionMap).length > 0
    ) {
      return cachedRegionToSubregionMap[region]?.includes(subregionName);
    }

    // Fall back to the previous logic if mapping isn't available yet
    if (rawData) {
      if (Array.isArray(rawData.Region)) {
        return rawData.Region.length === 1 && rawData.Region[0] === region;
      }
      return rawData.Region === region;
    }

    return false;
  });
};

/**
 * Check if a country belongs to any of the selected regions
 */
export const isCountryInRegions = (
  countryName: string,
  selectedRegions: string[],
  rawData?: any
): boolean => {
  // If no regions are selected, show all countries
  if (selectedRegions.length === 0) {
    return true;
  }

  // If "Global" is selected, show all countries
  if (selectedRegions.includes('Global')) {
    return true;
  }

  // Check if the country belongs to any of the selected regions according to our mapping
  return selectedRegions.some((region) => {
    // If we have the mapping data, use it
    if (cachedLocationData && cachedLocationData.length > 0) {
      return cachedLocationData.some(
        (loc) => loc.country === countryName && loc.region === region
      );
    }

    // Fall back to the previous logic if mapping isn't available yet
    if (rawData) {
      if (Array.isArray(rawData.Region)) {
        return rawData.Region.length === 1 && rawData.Region[0] === region;
      }
      return rawData.Region === region;
    }

    return false;
  });
};

/**
 * Check if a country belongs to any of the selected subregions
 */
export const isCountryInSubregions = (
  countryName: string,
  selectedSubregions: string[],
  rawData?: any
): boolean => {
  // If no subregions are selected, show all countries
  if (selectedSubregions.length === 0) {
    return true;
  }

  // Check if the country belongs to any of the selected subregions according to our mapping
  return selectedSubregions.some((subregion) => {
    // If we have the mapping data, use it
    if (cachedLocationData && cachedLocationData.length > 0) {
      return cachedLocationData.some(
        (loc) => loc.country === countryName && loc.subregion === subregion
      );
    }

    // Fall back to the previous logic if mapping isn't available yet
    if (rawData) {
      if (Array.isArray(rawData.Subregion)) {
        return (
          rawData.Subregion.length === 1 && rawData.Subregion[0] === subregion
        );
      }
      return rawData.Subregion === subregion;
    }

    return false;
  });
};
