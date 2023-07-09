import { DATA_VERSION, supabase } from 'helpers/databaseClient';

export const getTechnologies = async (setter): Promise<any> => {
  const storedTechList = JSON.parse(
    localStorage.getItem('drr-technologies') as string
  );
  if (storedTechList && storedTechList.version === DATA_VERSION) {
    const result = formatOptions(storedTechList.data, 'name');
    setter(result);
  } else {
    const { data, error } = await supabase
      .from('technologies')
      .select(`name, description, img_url, slug`)
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

export const getDisasterTypes = async (setter): Promise<any> => {
  const storedDisasterTypes = JSON.parse(
    localStorage.getItem('drr-disaster-types') as string
  );
  if (storedDisasterTypes && storedDisasterTypes.version === DATA_VERSION) {
    const { data } = storedDisasterTypes;
    setter(data);
  } else {
    const { data, error } = await supabase
      .from('disaster_types')
      .select(`name, description, img_url, slug`)
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
    }
  }
};

export const getDataFromDb = async (setter, config): Promise<any> => {
  const { cacheKey, tableName, columnName } = config;

  const storedDataTypes = JSON.parse(localStorage.getItem(cacheKey) as string);
  if (storedDataTypes && storedDataTypes.version === DATA_VERSION) {
    const result = formatOptions(storedDataTypes.data, columnName);
    setter(result);
  } else {
    const { data, error } = await supabase
      .from(tableName)
      .select(columnName)
      .order(columnName);

    if (!error) {
      const result = formatOptions(data, columnName);
      setter(result);
      localStorage.setItem(
        cacheKey,
        JSON.stringify({
          version: DATA_VERSION,
          data
        })
      );
    }
  }
};

export const formatOptions = (options, key) =>
  options.reduce((acc, curr) => {
    const option = {
      label: curr[key],
      value: curr[key]
    };
    acc.push(option);
    return acc;
  }, []);
