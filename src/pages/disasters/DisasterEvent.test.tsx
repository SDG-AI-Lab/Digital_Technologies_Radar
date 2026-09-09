import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { DisasterEvent } from './DisasterEvent';
import { apiRequest } from 'helpers/apiClient';

jest.mock('helpers/apiClient', () => ({
  apiRequest: jest.fn()
}));

jest.mock('components/pageDetails/PageDetails', () => ({
  PageDetails: ({ item, loading, sections }: any) => (
    <div data-testid='page-details'>
      <span data-testid='loading'>{String(loading)}</span>
      <span data-testid='title'>{item?.title || ''}</span>
      <span data-testid='sections'>{(sections || []).join(',')}</span>
    </div>
  )
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ eventId: 'evt-42' })
}));

const mockedApiRequest = apiRequest as jest.MockedFunction<typeof apiRequest>;

describe('DisasterEvent', () => {
  beforeEach(() => {
    mockedApiRequest.mockReset();
  });

  it('loads the disaster event and passes it to PageDetails', async () => {
    mockedApiRequest.mockResolvedValue({
      data: { title: 'Cyclone Alert', uuid: 'evt-42' }
    } as any);

    render(
      <ChakraProvider>
        <DisasterEvent />
      </ChakraProvider>
    );

    expect(screen.getByTestId('loading')).toHaveTextContent('true');

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('false');
    });

    expect(mockedApiRequest).toHaveBeenCalledWith(
      'public/details/disaster-event/evt-42'
    );
    expect(screen.getByTestId('title')).toHaveTextContent('Cyclone Alert');
    expect(screen.getByTestId('sections')).toHaveTextContent('overview');
  });

  it('stops loading when the API request fails', async () => {
    mockedApiRequest.mockRejectedValue(new Error('network'));
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ChakraProvider>
        <DisasterEvent />
      </ChakraProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('false');
    });

    expect(screen.getByTestId('title')).toHaveTextContent('');
    errorSpy.mockRestore();
  });
});
