import React, { useEffect, useState } from 'react';
import {
  Button,
  Checkbox,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea
} from '@chakra-ui/react';
import './EventAction.scss';
import { supabase } from 'helpers/databaseClient';
import { toSnakeCase } from 'components/shared/helpers/HelperUtils';
import { useLocation, useNavigate } from 'react-router-dom';
import { getDataFromDb, updateDataVersion } from 'helpers/dataUtils';
import { isAdmin } from 'components/shared/helpers/auth';
import { SelectMultiple } from 'pages/projectAction/SelectMultiple';

type FormProps = Record<string, string | number | Array<any>>;

type Props = Record<string, string>;

const initialFormValues = {
  title: '',
  overview: '',
  img_url: '',
  impact: '',
  source: '',
  summary: '',
  contacts: '',
  solutions: '',
  resources: '',
  help_needed: 0,
  how_to_help: '',
  countries: []
};

export const EventAction: React.FC<Props> = ({ mode }) => {
  const isCreateForm = mode.toLocaleLowerCase().includes('add');
  const navigate = useNavigate();
  const uuid = useLocation().pathname.split('/')[2];
  const path = useLocation().pathname;
  const queryString = useLocation().search;
  const [formValues, setFormValues] = useState<FormProps>(initialFormValues);
  const [locations, setLocations] = useState<any>([]);
  const [countries, setCountries] = useState<any>([]);

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
      | React.ChangeEvent<HTMLSelectElement>
  ): void => {
    const { name, value } = e.target;
    setFormValues((prevState) => ({ ...prevState, [name]: value }));
  };

  useEffect(() => {
    if (!isCreateForm) {
      if (!isAdmin) return navigate('/');
      const key = queryString.includes('recent=true')
        ? 'drr-recent-disasters'
        : 'drr-disaster-events';
      const itemList = JSON.parse(localStorage.getItem(key) as string);
      const currentItem = itemList.data.find((x: any) => x.uuid === uuid);
      if (!currentItem) navigate('/');
      setFormValues(currentItem);
    }

    void getLocations();
  }, []);

  const getLocations = async (): Promise<void> => {
    const locations = await getDataFromDb(() => {}, {
      cacheKey: 'drr-countries',
      tableName: 'locations',
      columnName: 'all',
      sortBy: 'country'
    });
    setLocations(locations.data);
  };

  const getSelectedValues = (data: Array<any>): any[] => {
    if (path.includes('new')) return [];

    const selectedValues = data.reduce(
      (acc: Array<{ label: string; value: string }>, curr: string) => {
        const obj = {
          label: curr,
          value: curr
        };
        acc.push(obj);
        return acc;
      },
      []
    );

    return selectedValues;
  };

  const getOptions = () => {
    return locations.reduce(
      (a: { [x: string]: any }, c: { country: any; id: any }) => {
        a.push({ label: c.country, value: c.id });
        return a;
      },
      []
    ) as any;
  };

  const action = async (): Promise<void> => {
    const payload = { ...formValues, countries: countries.countries };

    ['resources', 'solutions', 'contacts'].forEach((item) => {
      payload[item] = `{${payload[item]}}`;
    });

    const alwaysRequiredFields: string[] = [
      'title',
      'overview',
      'img_url',
      'impact',
      'source',
      'summary'
    ];

    const missingRequiredField = alwaysRequiredFields.find(
      (field) => !payload[field]
    );
    if (missingRequiredField) {
      return alert(`Please fill the required field: ${missingRequiredField}`);
    }

    if (Number(payload['help_needed']) === 1 && !payload['how_to_help']) {
      return alert(
        'Please provide details on how to help when "Help Needed?" is checked.'
      );
    }

    payload['slug'] = toSnakeCase(formValues.title as string);
    let supabaseError = false;

    if (mode.toLocaleLowerCase() === 'add') {
      const { data, error } = await supabase
        .from('disaster_events')
        .insert(payload as any)
        .select('uuid')
        .single();
      supabaseError = !!error;
    } else {
      const { error } = await supabase
        .from('disaster_events')
        .update(payload)
        .eq('uuid', uuid)
        .select('uuid');
      supabaseError = !!error;
    }

    if (!supabaseError) {
      alert('Operation Successfull!');
      void updateDataVersion();
      localStorage.removeItem('drr-recent-disasters');
      navigate('/');
    } else {
      alert('There was an error, please try again');
    }
  };

  return (
    <div className='newProject'>
      <h3>{`${mode} Event`}</h3>
      <div className='eventActionForm'>
        <FormControl display={'flex'} gap={3} mb={5}>
          <FormLabel textAlign={'end'}>Title</FormLabel>
          <Input
            type='text'
            w={'100%'}
            name='title'
            value={formValues['title']}
            onChange={handleChange}
            data-testid='field-title'
          />
        </FormControl>
        <FormControl display={'flex'} gap={3} mb={5}>
          <FormLabel textAlign={'end'}>Overview</FormLabel>
          <Textarea
            w={'100%'}
            name='overview'
            value={formValues['overview']}
            size='sm'
            onChange={handleChange}
            data-testid='field-overview'
          />
        </FormControl>
        <FormControl display={'flex'} gap={3} mb={5}>
          <FormLabel textAlign={'end'}>Summary</FormLabel>
          <Input
            type='text'
            w={'100%'}
            name='summary'
            value={formValues['summary']}
            onChange={handleChange}
            data-testid='field-summary'
          />
        </FormControl>
        <FormControl display={'flex'} gap={3} mb={5}>
          <FormLabel textAlign={'end'}>Image URL</FormLabel>
          <Input
            type='text'
            w={'100%'}
            name='img_url'
            value={formValues['img_url']}
            onChange={handleChange}
            data-testid='field-img_url'
          />
        </FormControl>
        <FormControl display={'flex'} gap={3} mb={5}>
          <FormLabel textAlign={'end'}>Source</FormLabel>
          <Input
            type='text'
            w={'100%'}
            name='source'
            value={formValues['source']}
            onChange={handleChange}
            data-testid='field-source'
          />
        </FormControl>
        <FormControl display={'flex'} gap={3} mb={5}>
          <FormLabel textAlign={'end'}>Impact</FormLabel>
          <Textarea
            w={'100%'}
            name='impact'
            value={formValues['impact']}
            size='sm'
            onChange={handleChange}
            data-testid='field-impact'
          />
        </FormControl>
        <FormControl display={'flex'} gap={3} mb={5}>
          <FormLabel textAlign={'end'}>Resources</FormLabel>
          <Textarea
            w={'100%'}
            name='resources'
            value={formValues['resources']}
            size='sm'
            onChange={handleChange}
            data-testid='field-resources'
          />
        </FormControl>
        <FormControl display={'flex'} gap={3} mb={5}>
          <FormLabel textAlign={'end'}>Solutions</FormLabel>
          <Textarea
            w={'100%'}
            name='solutions'
            value={formValues['solutions']}
            size='sm'
            onChange={handleChange}
            data-testid='field-solutions'
          />
        </FormControl>
        <FormControl display={'flex'} gap={3} mb={5}>
          <FormLabel textAlign={'end'}>Contact</FormLabel>
          <Input
            type='text'
            w={'100%'}
            name='contacts'
            value={formValues['contacts']}
            onChange={handleChange}
            data-testid='field-contacts'
          />
        </FormControl>
        <FormControl display={'flex'} gap={3} mb={5}>
          <FormLabel textAlign={'end'}>Countries</FormLabel>
          <SelectMultiple
            options={getOptions() as any}
            loading={false}
            label={'countries'}
            onChange={setCountries}
            selectedValues={getSelectedValues(formValues['countries'])}
          />
        </FormControl>
        <FormControl display={'flex'} gap={3} mb={5}>
          <FormLabel textAlign={'end'}>Help Needed?</FormLabel>
          <Checkbox
            name='help_needed'
            isChecked={Number(formValues['help_needed']) === 1}
            onChange={(e) =>
              setFormValues((prevState) => ({
                ...prevState,
                help_needed: e.target.checked ? 1 : 0
              }))
            }
          />
        </FormControl>

        {Number(formValues['help_needed']) === 1 && (
          <FormControl display={'flex'} gap={3} mb={5}>
            <FormLabel textAlign={'end'}>How to Help</FormLabel>
            <Textarea
              w={'100%'}
              name='how_to_help'
              value={(formValues['how_to_help'] as string) ?? ''}
              size='sm'
              onChange={handleChange}
              data-testid='field-how_to_help'
            />
          </FormControl>
        )}

        <div className='submitBtn'>
          <Button
            data-testid='submit'
            w={'20%'}
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
