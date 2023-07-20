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
      label: 'title',
      type: 'text'
    },
    {
      label: 'description',
      type: 'textArea'
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
      label: 'date_of_implementation',
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
      label: 'disaster_cycles',
      type: 'selectArray',
      options: [
        {
          value: 'prepardness',
          label: 'prepardness'
        },
        {
          value: 'response',
          label: 'response'
        },
        {
          value: 'recovery',
          label: 'recovery'
        },
        {
          value: 'mitigation',
          label: 'mitigation'
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
  title: '',
  description: '',
  source: '',
  img_url: '',
  date_of_implementation: '',
  theme: '',
  sdg: '',
  data: '',
  use_case: '',
  status: '',
  disaster_cycles: '',
  partner: '',
  un_host: '',
  country: '',
  disaster_type: '',
  technology: '',
  region: '',
  subregion: ''
};

export const validatePayload = (payload: ProjectFieldValues): boolean => {
  const {
    title,
    description,
    source,
    img_url,
    date_of_implementation,
    theme,
    sdg,
    data,
    use_case,
    status,
    disaster_cycles,
    partner,
    un_host,
    country,
    disaster_type,
    technology
  } = payload;

  if (
    !title ||
    !description ||
    !img_url ||
    !date_of_implementation ||
    !theme ||
    !source ||
    sdg === '{}' ||
    data === '{}' ||
    !use_case ||
    !status ||
    !disaster_type ||
    disaster_cycles === '{}' ||
    country === '{}' ||
    partner === '{}' ||
    un_host === '{}' ||
    technology === '{}'
  ) {
    return false;
  }

  return true;
};
