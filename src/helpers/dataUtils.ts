import { DATA_VERSION, supabase } from 'helpers/databaseClient';
import { Option } from 'pages/projectAction/types';

export const getTechnologies = async (setter: Function): Promise<any> => {
  const storedTechList = JSON.parse(
    localStorage.getItem('drr-technologies') as string
  );
  if (storedTechList && storedTechList.version === DATA_VERSION) {
    const result = formatOptions(storedTechList.data, 'name');
    setter(result);
  } else {
    const { data, error } = await supabase
      .from('technologies')
      .select(`name, description, img_url, slug, source`)
      .order('name');

    if (!error) {
      const result = formatOptions(data, 'name');
      setter(result);
      localStorage.setItem(
        'drr-technologies',
        JSON.stringify({
          version: DATA_VERSION,
          data
        })
      );
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
    const { data, error } = await supabase
      .from('disaster_types')
      .select(`id, name, description, img_url, slug, source`)
      .order('name');

    if (!error) {
      setter(data);
      localStorage.setItem(
        'drr-disaster-types',
        JSON.stringify({
          version: DATA_VERSION,
          data
        })
      );

      return { data };
    }
  }
};

export const getProject = async (
  setter: Function,
  fromRadar: boolean,
  projectId: string
): Promise<any> => {
  const { data, error } = await supabase
    .from(`${fromRadar ? 'project_data' : 'tr_projects'}`)
    .select(`${fromRadar ? '*' : '*, project_data(*)'}`)
    .eq('uuid', projectId)
    .single();

  if (!error) {
    setter(data as any);
  }
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
  const { cacheKey, tableName, columnName, sortBy } = config;

  const storedDataTypes = JSON.parse(localStorage.getItem(cacheKey) as string);
  if (storedDataTypes && storedDataTypes.version === DATA_VERSION) {
    const result = formatOptions(storedDataTypes.data, sortBy || columnName);
    setter(result);
    return { data: storedDataTypes.data };
  } else {
    let dataResponse, errorResponse;
    if (columnName === 'all') {
      const { data, error } = await supabase
        .from(tableName)
        .select()
        .order(sortBy as string);
      dataResponse = data;
      errorResponse = error;
    } else {
      const { data, error } = await supabase
        .from(tableName)
        .select(columnName)
        .order(sortBy as string);
      dataResponse = data;
      errorResponse = error;
    }

    if (!errorResponse) {
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

export const updateDataVersion = async (): Promise<void> => {
  await supabase
    .from('dataset_version')
    .update({ data_version: Date.now() })
    .eq('id', 1);
};
