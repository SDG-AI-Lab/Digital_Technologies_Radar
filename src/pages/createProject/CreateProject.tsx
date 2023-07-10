/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/no-misused-promises */
import React, { useState, useEffect } from 'react';
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Select
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

  const [disastersData, setDisastersData] = useState<{
    data: Array<{ id: string; name: string }>;
    version: string;
  }>({ data: [], version: '' });

  const navigate = useNavigate();

  useEffect(() => {
    const password = prompt('Please enter password');
    if (
      password?.toLocaleLowerCase() !==
      (process.env.REACT_APP_DATA_PASSWORD || 'sdgailabs')
    ) {
      alert('Invalid Password');
      return navigate('/projects');
    }
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
    const disasterListData = await getDisasterTypes(setDisastersList);
    setDisastersData(disasterListData);

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
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
      case 'selectText':
        return (
          <Select
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
          <div style={{ width: '50%', maxWidth: '310px' }}>
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
    payload['sub_region'] = `{${subRegionString}}`;

    // Add disaster_type_id
    const disasterObj = disastersData.data.find(
      (disaster) => disaster.name === projectFormValues['disaster_type'].trim()
    );

    payload['disaster_type_id'] = disasterObj?.id;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { disaster_type, ...newPayload } = payload;

    const { error } = await supabase.from('projects').insert(newPayload);

    if (error) {
      console.error({ error });
    } else {
      void updateDataVersion();
      alert('Project added Succesfully');
      navigate('/projects');
    }
  };

  return hasFetchedData ? (
    <div className='newProject'>
      <h3>Add New Project</h3>
      <div className='createProject'>
        {data.map((field, idx) => (
          <FormControl display={'flex'} gap={3} mb={5} key={idx}>
            <FormLabel w={130} textAlign={'end'}>
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

      <Button w={'30%'} m={'auto'} onClick={addProject}>
        Add Project
      </Button>
    </div>
  ) : null;
};
