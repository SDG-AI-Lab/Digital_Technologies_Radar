import { DATA_VERSION } from 'helpers/databaseClient';
import { apiRequest } from 'helpers/apiClient';
import { Option } from 'pages/projectAction/types';

const REFERENCE_RESOURCES: Record<string, string> = {
  locations: 'locations',
  themes: 'themes',
  data_types: 'data-types',
  use_cases: 'use-cases',
  partners: 'partners',
  un_hosts: 'un-hosts'
};

export const getTechnologies = async (setter: Function): Promise<any> => {
  const storedTechList = JSON.parse(
    localStorage.getItem('drr-technologies') as string
  );
  if (storedTechList && storedTechList.version === DATA_VERSION) {
    const result = formatOptions(storedTechList.data, 'name');
    setter(result);
  } else {
    try {
      const { data } = await apiRequest<{ data: any[] }>('public/technologies');
      const result = formatOptions(data, 'name');
      setter(result);
      localStorage.setItem(
        'drr-technologies',
        JSON.stringify({
          version: DATA_VERSION,
          data
        })
      );
    } catch (error) {
      console.error('Error fetching technologies:', error);
    }
  }
};

export const getDisasterTypes = async (setter: Function): Promise<any> => {
  const storedDisasterTypes = JSON.parse(
    localStorage.getItem('drr-disaster-types') as string
  );
  if (storedDisasterTypes && storedDisasterTypes.version === DATA_VERSION) {
    const { data } = storedDisasterTypes;
    setter(data);
    return { data };
  } else {
    try {
      const { data } = await apiRequest<{ data: any[] }>(
        'public/disaster-types'
      );
      setter(data);
      localStorage.setItem(
        'drr-disaster-types',
        JSON.stringify({
          version: DATA_VERSION,
          data
        })
      );

      return { data };
    } catch (error) {
      console.error('Error fetching disaster types:', error);
    }
  }
};

export const getProject = async (
  setter: Function,
  fromRadar: boolean,
  projectId: string
): Promise<any> => {
  const resource = fromRadar ? 'radar-project' : 'project';
  const { data } = await apiRequest<{ data: any }>(
    `public/details/${resource}/${encodeURIComponent(projectId)}`
  );
  setter(data);
};

export const getDataFromDb = async (
  setter: Function,
  config: {
    cacheKey: string;
    tableName: string;
    columnName: string;
    sortBy?: string;
  }
): Promise<any> => {
  const { cacheKey, tableName, columnName, sortBy = 'id' } = config;

  const storedDataTypes = JSON.parse(localStorage.getItem(cacheKey) as string);
  if (storedDataTypes && storedDataTypes.version === DATA_VERSION) {
    const result = formatOptions(storedDataTypes.data, sortBy || columnName);
    setter(result);
    return { data: storedDataTypes.data };
  } else {
    const resource = REFERENCE_RESOURCES[tableName];
    if (!resource || columnName !== 'all') {
      throw new Error(`Unsupported public reference resource: ${tableName}`);
    }

    try {
      const { data: dataResponse } = await apiRequest<{ data: any[] }>(
        `public/${resource}`
      );
      const result = formatOptions(dataResponse, sortBy || columnName);
      setter(result);

      localStorage.setItem(
        cacheKey,
        JSON.stringify({
          version: DATA_VERSION,
          data: dataResponse
        })
      );

      return { data: dataResponse };
    } catch (error) {
      console.error(`Error fetching ${tableName}:`, error);
    }
  }
};

export const formatOptions = (options: any, key: string): Option[] =>
  options.reduce((acc: Option[], curr: any) => {
    const option = {
      label: curr[key],
      value: curr[key]
    };
    acc.push(option);
    return acc;
  }, []);

export const updateDataVersion = async (): Promise<void> => undefined;

export const approveProject = async (uuid: string): Promise<void> => {
  try {
    await apiRequest('admin/projects/approve', {
      method: 'POST',
      body: JSON.stringify({ uuid })
    });
    alert('Project approved successfully');
  } catch (error) {
    console.error('Error approving project:', error);
    alert('There was an error, please try again');
  }
  window.location.reload();
};
