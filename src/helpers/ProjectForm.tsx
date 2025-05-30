/* eslint-disable @typescript-eslint/restrict-plus-operands */
import React from 'react';
import { Button, FormControl, FormLabel } from '@chakra-ui/react';
import { ProjectFormFields } from './ProjectFormFields';

interface Props {
  data: any;
  title: string;
  action: any;
  hasFetchedData: any;
  projectFormValues: any;
  handleChange: any;
  setProjectFormValues: any;
}

export const ProjectForm: React.FC<Props> = ({ data, title, ...props }) => {
  return (
    <div className='newProject'>
      <h3>{title}</h3>
      <div className='createProject'>
        {data.map((field: any, idx: number) => (
          <FormControl display={'flex'} gap={3} mb={5} key={idx}>
            <FormLabel w={150} textAlign={'end'}>
              {field.label
                .replace(
                  /(^|_)(\w)/g,
                  (_match: any, group1: any, group2: any) =>
                    (group1 ? ' ' : '') + group2.toUpperCase()
                )
                .toUpperCase() + ':'}
            </FormLabel>

            <ProjectFormFields
              field={field}
              hasFetchedData={props.hasFetchedData}
              projectFormValues={props.projectFormValues}
              handleChange={props.handleChange}
              setProjectFormValues={props.setProjectFormValues}
            />
          </FormControl>
        ))}
      </div>

      <Button
        w={'30%'}
        m={'auto'}
        p={'10px 20px'}
        onClick={props.action}
        data-testid='project-form-submit'
      >
        {`${title.toLowerCase().includes('add') ? 'Add' : 'Update'} Project`}
      </Button>
    </div>
  );
};
