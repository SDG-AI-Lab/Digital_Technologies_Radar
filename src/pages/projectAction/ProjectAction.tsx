/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/no-misused-promises */
import React, { useState, useEffect, useContext } from 'react';
import {
  populateData,
  initialProjectFormValues,
  validatePayload
} from './helpers';
import {
  getTechnologies,
  getDisasterTypes,
  getDataFromDb,
  updateDataVersion,
  getProject
} from 'helpers/dataUtils';
import { ProjectFields, ProjectFieldValues, Option } from './types';

import { supabase } from 'helpers/databaseClient';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { RadarContext } from 'navigation/context';
import { ProjectForm } from 'helpers/ProjectForm';

import './projectAction.scss';
import { Loader } from 'helpers/Loader';

interface Props {
  mode: String;
}

export const ProjectAction: React.FC<Props> = ({ mode = 'add' }) => {
  const isCreateForm = mode.toLocaleLowerCase().includes('add');
  const fromRadar = useLocation().search.includes('from-radar=true');
  const projectId = useParams().project_id;

  const { currentProject, setCurrentProject } = useContext(RadarContext);
  const [technologies, setTechnologies] = useState<Option[]>([]);

  const [disasterTypes, setDisastersList] = useState<Option[]>([]);

  const [themes, setThemes] = useState<Option[]>([]);

  const [hasFetchedData, setHasFetchedData] = useState(false);
  const [hasFetchedCurrentProject, setHasFetchedCurrentProject] =
    useState(false);

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
    if (!isCreateForm) {
      if (currentProject && Object.keys(currentProject).length) {
        setProjectFormValues(currentProject);
        setHasFetchedCurrentProject(true);
      } else {
        void getProjectData();
      }
    } else {
      setHasFetchedCurrentProject(true);
    }
    void fetchData();
    return () => {
      setCurrentProject({});
    };
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

  useEffect(() => {
    if (currentProject && Object.keys(currentProject).length) {
      setProjectFormValues(currentProject);
    }
  }, [currentProject]);

  const getProjectData = async (): Promise<void> => {
    await getProject(setCurrentProject, fromRadar, projectId as string);
    setHasFetchedCurrentProject(true);
  };

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

  const generatePayload = (): any => {
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

    return payload;
  };

  const addProject = async (): Promise<void> => {
    const payload = generatePayload();
    setHasFetchedData(false);
    // Add to tr_projects table
    const { error } = await supabase.from('tr_projects').insert(payload);

    if (error) {
      console.error({ error });
    }

    // Add to project_data table
    let dataError;
    if (!error) {
      projectFormValues['disaster_cycles']
        .replace(/[{}]/g, '')
        .split(',')
        .forEach(async (disaster_cycle) => {
          const dupPayload = { ...payload };
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
    }

    if (!error && !dataError) {
      void updateDataVersion();
      localStorage.removeItem('drr-projects-list');
      alert('Project added Succesfully');
      navigate('/projects');
    } else {
      alert('Something went wrong!. Please try again');
    }
    setHasFetchedData(true);
  };

  const editProject = async (): Promise<void> => {
    const {
      id,
      updated_at,
      uuid,
      created_at,
      tr_projects_id,
      project_data,
      ...dupPayload
    } = generatePayload();

    let supabaseError = false;
    setHasFetchedData(false);
    if (fromRadar) {
      const { disaster_cycles, disaster_cycle, ...payload } = dupPayload;
      const { error: radarError } = await supabase
        .from('project_data')
        .update(payload)
        .eq('tr_projects_id', tr_projects_id);

      if (!radarError) {
        const { disaster_cycle, disaster_cycles, ...payload } = dupPayload;
        const { error: projectsError } = await supabase
          .from('tr_projects')
          .update(payload)
          .eq('id', tr_projects_id);

        supabaseError = !!projectsError;
      } else {
        supabaseError = true;
      }
    } else {
      const relatedProjects = currentProject.project_data;
      const { error: projectsError } = await supabase
        .from('tr_projects')
        .update(dupPayload)
        .eq('uuid', uuid);

      supabaseError = !!projectsError;
      relatedProjects.forEach(async (project: any) => {
        const { disaster_cycles, ...payload } = dupPayload;
        const { error: radarError } = await supabase
          .from('project_data')
          .update(payload)
          .eq('uuid', project.uuid);
        supabaseError = !!radarError;
      });
    }

    if (supabaseError) {
      alert('something went wrong, Please try again');
    } else {
      void updateDataVersion();
      localStorage.removeItem('drr-projects-list');
      alert('Project Updated Succesfully');
      navigate('/projects');
    }
    setHasFetchedData(true);
  };

  return hasFetchedData && hasFetchedCurrentProject ? (
    <ProjectForm
      data={data}
      title={`${isCreateForm ? 'Add New' : 'Edit'} Project`}
      action={isCreateForm ? addProject : editProject}
      hasFetchedData={hasFetchedData}
      projectFormValues={projectFormValues}
      handleChange={handleChange}
      setProjectFormValues={setProjectFormValues}
    />
  ) : (
    <h3 className='newProject'>
      <Loader rows={2} />
    </h3>
  );
};
