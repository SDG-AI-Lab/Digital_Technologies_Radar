import React, { useContext, useEffect, useState } from 'react';
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea
} from '@chakra-ui/react';
import './InfoAction.scss';
import { supabase } from 'helpers/databaseClient';
import { toSnakeCase } from 'components/shared/helpers/HelperUtils';
import { useLocation, useNavigate } from 'react-router-dom';
import { updateDataVersion } from 'helpers/dataUtils';
import { RadarContext } from 'navigation/context';
import { isAdmin } from 'components/shared/helpers/auth';

type FormProps = Record<string, string>;

type Props = Record<string, string>;

const initialFormValues = {
  name: '',
  img_url: '',
  description: '',
  source: ''
};

export const InfoAction: React.FC<Props> = ({ mode, category, table }) => {
  const isCreateForm = mode.toLocaleLowerCase().includes('add');
  const navigate = useNavigate();
  const slug = useLocation().pathname.split('/')[2];
  const [formValues, setFormValues] = useState<FormProps>(initialFormValues);
  const [currentItem, setCurrentItem] = useState<any>({});

  const { projectsToEdit, setProjectsToEdit } = useContext(RadarContext);
  const isDisastersPage = category === 'DISASTER';
  const key = isDisastersPage ? 'drr-disaster-types' : 'drr-technologies';

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ): void => {
    const { name, value } = e.target;
    setFormValues((prevState) => ({ ...prevState, [name]: value }));
  };

  useEffect(() => {
    if (!isCreateForm) {
      if (!isAdmin)
        return navigate(`/${isDisastersPage ? 'disasters' : 'technologies'}`);
      const itemList = JSON.parse(localStorage.getItem(key) as string);

      const item = itemList.data.find((x: any) => x.slug === slug);
      setFormValues(item);
      setCurrentItem(item);
    }

    return () => setProjectsToEdit([]);
  }, []);

  const action = async (): Promise<void> => {
    const payload = { ...formValues };
    if (Object.values(payload).includes(''))
      return alert('Please fill all fields');
    payload['slug'] = toSnakeCase(formValues.name);
    let supabaseError = false;
    if (mode === 'ADD') {
      const { error } = await supabase.from(table).insert(payload as any);
      supabaseError = !!error;
    } else {
      const { error } = await supabase
        .from(table)
        .update(payload)
        .eq('slug', slug);
      supabaseError = !!error;
      if (!error && payload.name !== currentItem.name) {
        if (isDisastersPage) {
          void updateRelatedDisasterProjects(payload.name);
        } else {
          void updateRelatedTechProjects(payload.name);
        }
      }
    }

    if (!supabaseError) {
      const newSlug = toSnakeCase(payload.name);
      alert('Operation Successfull!');
      void updateDataVersion();
      localStorage.removeItem(key);
      navigate(
        `${
          isDisastersPage ? `/disasters/${newSlug}` : `/technologies/${newSlug}`
        }`
      );
    } else {
      alert('There was an error, please try again');
    }
  };

  const updateRelatedTechProjects = (newTitle: string): void => {
    projectsToEdit.forEach(async (project: any) => {
      const prevTechArray = project.technology;
      const newTechArray = prevTechArray.reduce((acc: any, curr: string) => {
        if (toSnakeCase(curr) === slug) {
          acc.push(newTitle);
        } else {
          acc.push(curr);
        }

        return acc;
      }, []);

      const { error } = await supabase
        .from('tr_projects')
        .update({ technology: `{${newTechArray.join(', ') as string}}` })
        .eq('uuid', project.uuid);

      if (!error) localStorage.removeItem('drr-tech-projects');
    });
  };

  const updateRelatedDisasterProjects = (newTitle: string): void => {
    projectsToEdit.forEach(async (project: any) => {
      const { error } = await supabase
        .from('tr_projects')
        .update({ disaster_type: newTitle })
        .eq('uuid', project.uuid);

      if (!error) localStorage.removeItem('drr-disaster-projects');
    });
  };

  return (
    <div className='newProject'>
      <h3>{`${mode} ${category}`}</h3>
      <div className='infoActionForm'>
        <FormControl display={'flex'} gap={3} mb={5}>
          <FormLabel w={150} textAlign={'end'}>
            Title
          </FormLabel>
          <Input
            type='text'
            w={'50%'}
            name='name'
            value={formValues['name']}
            onChange={handleChange}
            data-testid='field-title'
          />
        </FormControl>
        <FormControl display={'flex'} gap={3} mb={5}>
          <FormLabel w={150} textAlign={'end'}>
            Description
          </FormLabel>
          <Textarea
            w={'50%'}
            name='description'
            value={formValues['description']}
            size='sm'
            onChange={handleChange}
            data-testid='field-description'
          />
        </FormControl>
        <FormControl display={'flex'} gap={3} mb={5}>
          <FormLabel w={150} textAlign={'end'}>
            Image URL
          </FormLabel>
          <Input
            type='text'
            w={'50%'}
            name='img_url'
            value={formValues['img_url']}
            onChange={handleChange}
            data-testid='field-img_url'
          />
        </FormControl>
        <FormControl display={'flex'} gap={3} mb={5}>
          <FormLabel w={150} textAlign={'end'}>
            Source
          </FormLabel>
          <Input
            type='text'
            w={'50%'}
            name='source'
            value={formValues['source']}
            onChange={handleChange}
            data-testid='field-source'
          />
        </FormControl>
        <div style={{ margin: '0 40%' }}>
          <Button
            data-testid='submit'
            w={'100%'}
            p={'10px 20px'}
            m={'0 auto'}
            onClick={() => {
              void action();
            }}
          >
            SUBMIT
          </Button>
        </div>
      </div>
    </div>
  );
};
