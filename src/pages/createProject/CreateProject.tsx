/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
import React, { useState, useEffect } from 'react';
import { FormControl, FormLabel, Input, Select } from '@chakra-ui/react';
import { SelectMultiple } from './SelectMultiple';
import { DATA_VERSION, supabase } from 'helpers/databaseClient';
import './createProject.scss';
const FIELDS = [
  {
    label: 'name',
    type: 'text',
    optional: 'false'
  },
  {
    label: 'description',
    type: 'text',
    optional: false
  },
  {
    label: 'source',
    type: 'text',
    optional: false
  },
  {
    label: 'img_url',
    type: 'text',
    optional: false
  },
  {
    label: 'date',
    type: 'text',
    optional: false
  },
  {
    label: 'theme',
    type: 'text',
    optional: false
  },
  {
    label: 'sdg',
    type: 'array',
    options: [],
    optional: false
  },
  {
    label: 'data',
    type: 'text',
    options: [],
    optional: false
  },
  {
    label: 'use_case',
    type: 'text',
    optional: false
  },
  {
    label: 'status',
    type: 'selectText',
    options: ['Idea', 'Validation', 'Prototype', 'Production'],
    optional: false
  },
  {
    label: 'disaster_cycle',
    type: 'selectArray',
    options: [],
    optional: false
  },
  {
    label: 'partner',
    type: 'array',
    optional: false
  },
  {
    label: 'un_host',
    type: 'array',
    optional: false
  },
  {
    label: 'country',
    type: 'selectArray',
    options: [],
    optional: false
  },
  {
    label: 'disaster_type',
    type: 'selectText',
    options: [],
    optional: false
  },
  {
    label: 'technology',
    type: 'selectArray',
    options: [],
    optional: false
  }
];

export const CreateProject: React.FC = () => {
  const [techList, setTechList] = useState([]);

  useEffect(() => {
    void getDisasterTypes();
    void getTechList();
  }, []);

  useEffect(() => {
    if (techList.length) {
      FIELDS[15].options = techList;
    }
  }, [techList]);

  const getDisasterTypes = async (): Promise<any> => {
    const storedDisasterTypes = JSON.parse(
      localStorage.getItem('disasterTypes') as string
    );
    if (storedDisasterTypes && storedDisasterTypes.version === DATA_VERSION) {
      const { data } = storedDisasterTypes;
      FIELDS[14].options = data;
    } else {
      const { data, error } = await supabase
        .from('disaster_types')
        .select(`name, description, img_url, slug`)
        .order('name');

      if (!error) {
        FIELDS[14].options = data;
        localStorage.setItem(
          'disasterTypes',
          JSON.stringify({
            version: DATA_VERSION,
            data
          })
        );
      }
    }
  };

  const getTechList = async (): Promise<any> => {
    const storedTechList = JSON.parse(
      localStorage.getItem('techList') as string
    );
    if (storedTechList && storedTechList.version === DATA_VERSION) {
      const result = storedTechList.data.reduce((acc, curr) => {
        const option = {
          label: curr.name,
          value: curr.name
        };
        acc.push(option);
        return acc;
      }, []);
      FIELDS[15].options = result;
      setTechList(result);
    } else {
      const { data, error } = await supabase
        .from('technologies')
        .select(`name, description, img_url, slug`)
        .order('name');

      if (!error) {
        // FIELDS[15].options = data;
        localStorage.setItem(
          'techList',
          JSON.stringify({
            version: DATA_VERSION,
            data
          })
        );
      }
    }
  };

  const renderField = (field) => {
    const { options, type } = field;
    switch (type) {
      case 'text':
        return <Input type='text' w={'50%'} />;
      case 'selectText':
        return (
          <Select placeholder='Select option' w={'50%'}>
            {options.map((option, idx) => (
              <option value={option?.name || option} key={idx}>
                {option?.name || option}
              </option>
            ))}
          </Select>
        );
      case 'selectArray':
        const opts = [
          { value: 1, label: 'one' },
          { value: 2, label: 'two' },
          { value: 3, label: 'three' },
          { value: 4, label: 'four' },
          { value: 5, label: 'five' },
          { value: 6, label: 'six' },
          { value: 25, label: 'ffive' },
          { value: 26, label: 'ssix' }
        ];
        console.log('nowww22', { field }, { options });
        return (
          <div style={{ width: '50%', maxWidth: '50%' }}>
            <SelectMultiple options={options} />
          </div>
        );
      default:
        return <Input type='text' w={'50%'} />;
    }
  };

  return (
    <div className='newProject'>
      <h3>Add New Project</h3>
      <div className='createProject'>
        {FIELDS.map((field, idx) => (
          <FormControl display={'flex'} gap={3} mb={5} key={idx}>
            <FormLabel w={120}>
              {field.label
                .replace(
                  /(^|_)(\w)/g,
                  (match, group1, group2) =>
                    (group1 ? ' ' : '') + group2.toUpperCase()
                )
                .toUpperCase() + ':'}
            </FormLabel>
            {renderField(field)}
          </FormControl>
        ))}
      </div>

      <Input type='submit' w={'30%'} m={'auto'} />
    </div>
  );
};
