/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
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
import './createProject.scss';
import { supabase } from 'helpers/databaseClient';
import { useNavigate } from 'react-router-dom';

export const CreateProject: React.FC = () => {
  const [technologies, setTechnologies] = useState([]);
  const [disasterTypes, setDisastersList] = useState([]);
  const [themes, setThemes] = useState([]);
  const [hasFetchedData, setHasFetchedData] = useState(false);
  const [data, setData] = useState([]);
  const [countries, setCountries] = useState([]);
  const [dataTypes, setDataTypes] = useState([]);
  const [useCases, setUseCases] = useState([]);
  const [partners, setPartners] = useState([]);
  const [unHosts, setUnHosts] = useState([]);
  const [projectFormValues, setProjectFormValues] = useState(
    initialProjectFormValues
  );
  const [locationData, setLocationData] = useState({});
  const [disastersData, setDisastersData] = useState({});

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProjectFormValues((prevState) => ({ ...prevState, [name]: value }));
  };

  const renderField = (field) => {
    const { options, type, label } = field;
    switch (type) {
      case 'text':
        return (
          <Input
            type='text'
            w={'50%'}
            name={label}
            value={projectFormValues[label]}
            onChange={handleChange}
            isRequired
          />
        );
      case 'selectText':
        return (
          <Select
            placeholder='Select option'
            w={'50%'}
            name={label}
            value={projectFormValues[label]}
            onChange={handleChange}
            required
          >
            {options.map((option, idx) => (
              <option
                value={option?.name || option}
                key={idx}
                className='option-text'
              >
                {option?.name || option.toUpperCase()}
              </option>
            ))}
          </Select>
        );
      case 'selectArray':
        return (
          <div style={{ width: '50%', maxWidth: '310px' }}>
            <SelectMultiple
              options={options}
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

  const addData = async () => {
    const payload = { ...projectFormValues };
    console.log({ payload });
    if (!validatePayload(payload)) return alert('Please fill in all fields');

    // Add Regions and Subregions
    const regions = new Set();
    const subRegions = new Set();

    projectFormValues['country']
      .replace(/[{}]/g, '')
      .split(',')
      .forEach((country) => {
        const location = locationData.data.find(
          (loc) => loc.country === country.trim()
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
      updateDataVersion();
      alert('Project added Succesfully');
      navigate('/projects');
    }
  };

  return (
    hasFetchedData && (
      <div className='newProject'>
        <h3>Add New Project</h3>
        <div className='createProject'>
          {data.map((field, idx) => (
            <FormControl display={'flex'} gap={3} mb={5} key={idx}>
              <FormLabel w={130} textAlign={'end'}>
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

        <Button w={'30%'} m={'auto'} onClick={addData}>
          Add Project
        </Button>
      </div>
    )
  );
};
