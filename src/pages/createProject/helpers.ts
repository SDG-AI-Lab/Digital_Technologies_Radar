/* eslint-disable @typescript-eslint/naming-convention */
import { ProjectFields, Option, ProjectFieldValues } from './types';
interface DataProps {
  disasterTypes: Option[];
  technologies: Option[];
  countries: Option[];
  themes: Option[];
  dataTypes: Option[];
  useCases: Option[];
  partners: Option[];
  unHosts: Option[];
}

export const populateData = (props: DataProps): ProjectFields[] => {
  const {
    disasterTypes,
    technologies,
    countries,
    themes,
    dataTypes,
    useCases,
    partners,
    unHosts
  } = props;
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

const getSdgs = (): Array<{ value: string; label: string }> => {
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
  name: '',
  description: '',
  source: '',
  img_url: '',
  date: '',
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

export const validatePayload = (payload: ProjectFieldValues): boolean => {
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
