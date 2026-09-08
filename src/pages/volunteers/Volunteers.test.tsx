import React from 'react';
import { render, screen } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { Volunteers } from './Volunteers';
import VolunteerOrganization from './VolunteerOrganization';
import { volunteerContentList } from './VolunteerContent';

jest.mock('radar/components', () => ({
  BackButton: ({ to }: any) => <button type='button'>Back to {to}</button>
}));

describe('Volunteers', () => {
  it('renders volunteer sections and people', () => {
    render(
      <ChakraProvider>
        <Volunteers />
      </ChakraProvider>
    );

    expect(
      screen.getByText('FTR4DRR Volunteer Developer Team')
    ).toBeInTheDocument();
    expect(screen.getByText('Software Development')).toBeInTheDocument();
    expect(screen.getByText('Data Collection')).toBeInTheDocument();
    expect(screen.getByText('Software Deployment')).toBeInTheDocument();
    expect(screen.getByText('Back to ABOUT')).toBeInTheDocument();
    expect(screen.getByText(volunteerContentList[0].name)).toBeInTheDocument();
  });

  it('renders VolunteerOrganization with links', () => {
    const volunteer = volunteerContentList[0];
    render(
      <ChakraProvider>
        <VolunteerOrganization volunteerContent={volunteer} />
      </ChakraProvider>
    );

    expect(screen.getByText(volunteer.name)).toBeInTheDocument();
    expect(screen.getByText(volunteer.background)).toBeInTheDocument();
    expect(screen.getByText(volunteer.quote)).toBeInTheDocument();
    expect(screen.getByText('Github').closest('a')).toHaveAttribute(
      'href',
      volunteer.githubLink
    );
  });
});
