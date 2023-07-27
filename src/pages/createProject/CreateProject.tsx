/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/no-misused-promises */
import React, { useState, useEffect } from 'react';
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea
} from '@chakra-ui/react';
import { SelectMultiple } from './SelectMultiple';
import {
  populateData,
  initialProjectFormValues,
  validatePayload
} from './helpers';
import {
  getTechnologies,
  getDisasterTypes,
  getDataFromDb,
  updateDataVersion
} from 'helpers/dataUtils';
import { ProjectFields, ProjectFieldValues, Option } from './types';
import './createProject.scss';
import { supabase } from 'helpers/databaseClient';
import { useNavigate } from 'react-router-dom';

export const CreateProject: React.FC = () => {
  const [technologies, setTechnologies] = useState<Option[]>([]);

  const [disasterTypes, setDisastersList] = useState<Option[]>([]);

  const [themes, setThemes] = useState<Option[]>([]);

  const [hasFetchedData, setHasFetchedData] = useState(false);

  const [data, setData] = useState<ProjectFields[]>([]);

  const [countries, setCountries] = useState<Option[]>([]);

  const [dataTypes, setDataTypes] = useState<Option[]>([]);

  const [useCases, setUseCases] = useState<Option[]>([]);

  const [partners, setPartners] = useState<Option[]>([]);

  const [unHosts, setUnHosts] = useState<Option[]>([]);

  const [projectFormValues, setProjectFormValues] =
    useState<ProjectFieldValues>(initialProjectFormValues);

  const [locationData, setLocationData] = useState<{
    data: Array<{ country: string; region: string; subregion: string }>;
    version: string;
  }>({ data: [], version: '' });

  const navigate = useNavigate();

  useEffect(() => {
    // const password = prompt('Please enter password');
    // if (
    //   password?.toLocaleLowerCase() !==
    //   (process.env.REACT_APP_DATA_PASSWORD || 'sdgailabs')
    // ) {
    //   alert('Invalid Password');
    //   return navigate('/projects');
    // }
    void fetchData();
  }, []);

  useEffect(() => {
    if (hasFetchedData) {
      const fields = populateData({
        disasterTypes,
        technologies,
        countries,
        themes,
        dataTypes,
        useCases,
        partners,
        unHosts
      });
      setData(fields);
    }
  }, [hasFetchedData]);

  const fetchData = async (): Promise<any> => {
    // Disasters
    await getDisasterTypes(setDisastersList);

    // Technologies
    await getTechnologies(setTechnologies);

    // Countries
    const locationData = await getDataFromDb(setCountries, {
      cacheKey: 'drr-countries',
      tableName: 'locations',
      columnName: 'all',
      sortBy: 'country'
    });

    setLocationData(locationData);

    // Themes
    await getDataFromDb(setThemes, {
      cacheKey: 'drr-themes',
      tableName: 'themes',
      columnName: 'theme'
    });

    // Data types
    await getDataFromDb(setDataTypes, {
      cacheKey: 'drr-data-types',
      tableName: 'data_types',
      columnName: 'name'
    });

    // Use cases
    await getDataFromDb(setUseCases, {
      cacheKey: 'drr-use-cases',
      tableName: 'use_cases',
      columnName: 'use_case'
    });

    // Partners
    await getDataFromDb(setPartners, {
      cacheKey: 'drr-partners',
      tableName: 'partners',
      columnName: 'name'
    });

    // UN Hosts
    await getDataFromDb(setUnHosts, {
      cacheKey: 'drr-un-hosts',
      tableName: 'un_hosts',
      columnName: 'name'
    });

    setHasFetchedData(true);
  };

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ): void => {
    const { name, value } = e.target;
    setProjectFormValues((prevState) => ({ ...prevState, [name]: value }));
  };

  const renderField = (
    field: ProjectFields
  ): React.ComponentProps<typeof Input> => {
    const { options, type, label } = field;
    switch (type) {
      case 'text':
        return (
          <Input
            type='text'
            w={'50%'}
            name={label}
            value={projectFormValues[label as keyof ProjectFieldValues]}
            onChange={handleChange}
          />
        );
      case 'textArea':
        return (
          <Textarea
            w={'50%'}
            onChange={handleChange}
            name={label}
            value={projectFormValues[label as keyof ProjectFieldValues]}
            size='sm'
          />
        );

      case 'selectText':
        return (
          <Select
            placeholder='Select option'
            w={'50%'}
            name={label}
            value={projectFormValues[label as keyof ProjectFieldValues]}
            onChange={handleChange as any}
          >
            {(options || []).map((option, idx) => (
              <option
                value={
                  (option as Option)?.name || (option as unknown as string)
                }
                key={idx}
                className='option-text'
              >
                {(option as Option)?.name ||
                  (option as unknown as string).toUpperCase()}
              </option>
            ))}
          </Select>
        );
      case 'selectArray':
        return (
          <div style={{ width: '50%', maxWidth: '350px' }}>
            <SelectMultiple
              options={options as Option[]}
              loading={!hasFetchedData}
              label={label}
              onChange={setProjectFormValues}
            />
          </div>
        );
      default:
        return <Input type='text' w={'50%'} />;
    }
  };

  const addProject = async (): Promise<void> => {
    const payload = { ...projectFormValues };
    if (!validatePayload(payload)) return alert('Please fill in all fields');

    // Add Regions and Subregions
    const regions = new Set();
    const subRegions = new Set();

    projectFormValues['country']
      .replace(/[{}]/g, '')
      .split(',')
      .forEach((country) => {
        const location = locationData.data.find(
          (loc: { country: string }) => loc.country === country.trim()
        );

        if (location) {
          regions.add(location.region);
          subRegions.add(location.subregion);
        }
      });

    const regionString = Array.from(regions).join(', ');
    const subRegionString = Array.from(subRegions).join(', ');

    payload['region'] = `{${regionString}}`;
    payload['subregion'] = `{${subRegionString}}`;

    // Add to tr_projects table
    const { error } = await supabase.from('tr_projects').insert(payload);

    if (error) {
      console.error({ error });
    }

    // Add to project_data table
    let dataError;
    projectFormValues['disaster_cycles']
      .replace(/[{}]/g, '')
      .split(',')
      .forEach(async (disaster_cycle) => {
        const dupPayload = { ...payload };

        // @ts-expect-error
        dupPayload['disaster_cycle'] = disaster_cycle.trim();

        const { disaster_cycles, ...dataPayload } = dupPayload;

        const { error } = await supabase
          .from('project_data')
          .insert(dataPayload);

        dataError = error;

        if (error) {
          console.error({ error });
        }
      });

    if (!error && !dataError) {
      void updateDataVersion();
      localStorage.removeItem('drr-projects-list');
      alert('Project added Succesfully');
      navigate('/projects');
    } else {
      alert('Something went wrong!. Please try again');
    }
  };

  return hasFetchedData ? (
    <div className='newProject'>
      <h3>Add New Project</h3>
      <div className='createProject'>
        {data.map((field, idx) => (
          <FormControl display={'flex'} gap={3} mb={5} key={idx}>
            <FormLabel w={150} textAlign={'end'}>
              {field.label
                .replace(
                  /(^|_)(\w)/g,
                  (_match, group1, group2) =>
                    (group1 ? ' ' : '') + group2.toUpperCase()
                )
                .toUpperCase() + ':'}
            </FormLabel>
            {renderField(field)}
          </FormControl>
        ))}
      </div>

      <Button w={'30%'} m={'auto'} p={'10px 20px'} onClick={addProject}>
        Add Project
      </Button>
    </div>
  ) : (
    <h3 className='newProject'>Loading...</h3>
  );
};
