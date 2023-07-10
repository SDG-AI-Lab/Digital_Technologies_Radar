/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
export const populateData = ({
  disasterTypes,
  technologies,
  countries,
  themes,
  dataTypes,
  useCases,
  partners,
  unHosts
}) => {
  return [
    {
      label: 'name',
      type: 'text'
    },
    {
      label: 'description',
      type: 'text'
    },
    {
      label: 'source',
      type: 'text'
    },
    {
      label: 'img_url',
      type: 'text'
    },
    {
      label: 'date',
      type: 'text'
    },
    {
      label: 'theme',
      type: 'selectArray',
      options: themes
    },
    {
      label: 'sdg',
      type: 'selectArray',
      options: getSdgs()
    },
    {
      label: 'data',
      type: 'selectArray',
      options: dataTypes
    },
    {
      label: 'use_case',
      type: 'selectArray',
      options: useCases
    },
    {
      label: 'status',
      type: 'selectText',
      options: ['idea', 'validation', 'prototype', 'production']
    },
    {
      label: 'disaster_cycle',
      type: 'selectArray',
      options: [
        {
          value: 'prepardness',
          label: 'Prepardness'
        },
        {
          value: 'response',
          label: 'Response'
        },
        {
          value: 'recovery',
          label: 'Recovery'
        },
        {
          value: 'mitigation',
          label: 'Mitigation'
        }
      ]
    },
    {
      label: 'partner',
      type: 'selectArray',
      options: partners
    },
    {
      label: 'un_host',
      type: 'selectArray',
      options: unHosts
    },
    {
      label: 'country',
      type: 'selectArray',
      options: countries
    },
    {
      label: 'disaster_type',
      type: 'selectText',
      options: disasterTypes
    },
    {
      label: 'technology',
      type: 'selectArray',
      options: technologies
    }
  ];
};

const getSdgs = () => {
  const arr = [...Array(17)].map((_, i) => ({
    value: `SDG ${i + 1}`,
    label: `SDG ${i + 1}`
  }));
  arr.push({
    value: 'No Information',
    label: 'No Information'
  });
  return arr;
};

export const initialProjectFormValues = {
  name: 'test name23',
  description: 'test descr23',
  source: 'test source23',
  img_url: 'test img2',
  date: '2022',
  theme: '',
  sdg: '',
  data: '',
  use_case: '',
  status: '',
  disaster_cycle: '',
  partner: '',
  un_host: '',
  country: '',
  disaster_type: '',
  disaster_type_id: '',
  technology: '',
  region: '',
  sub_region: ''
};

export const validatePayload = (payload) => {
  const {
    name,
    description,
    source,
    img_url,
    date,
    theme,
    sdg,
    data,
    use_case,
    status,
    disaster_cycle,
    partner,
    un_host,
    country,
    disaster_type,
    technology
  } = payload;

  if (
    !name ||
    !description ||
    !img_url ||
    !date ||
    !theme ||
    !source ||
    sdg === '{}' ||
    data === '{}' ||
    !use_case ||
    !status ||
    !disaster_type ||
    disaster_cycle === '{}' ||
    country === '{}' ||
    partner === '{}' ||
    un_host === '{}' ||
    technology === '{}'
  ) {
    return false;
  }

  return true;
};
