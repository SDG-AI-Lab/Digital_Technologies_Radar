import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { AppRadarProvider } from './RadarProvider';
import { apiRequest } from 'helpers/apiClient';

jest.mock('helpers/apiClient', () => ({
  apiRequest: jest.fn()
}));

jest.mock('@undp_sdg_ai_lab/undp-radar', () => ({
  RadarProvider: ({ children }: any) => (
    <div data-testid='radar-provider'>{children}</div>
  ),
  DataProvider: ({ children }: any) => (
    <div data-testid='data-provider'>{children}</div>
  ),
  SetData: (props: any) => (
    <div
      data-testid='set-data'
      data-has-quadrant-comp={Boolean(props.QuadrantNameComponent)}
      data-has-horizon-comp={Boolean(props.HorizonsNameComponent)}
    />
  ),
  RadarDataGenerator: () => <div data-testid='radar-data-generator' />,
  AddCSV: ({ csvFile, isCsvString }: any) => (
    <div
      data-testid='add-csv'
      data-csv={csvFile}
      data-is-string={String(isCsvString)}
    />
  ),
  Utilities: {
    cleanupStringArray: (arr: string[]) =>
      arr.map((s) => s.trim()).filter(Boolean)
  }
}));

jest.mock('./components/svg-hover/QuadrantNameComp', () => ({
  QuadrantNameComp: () => null
}));

jest.mock('./components/svg-hover/HorizonsNameComp', () => ({
  HorizonsNameComp: () => null
}));

jest.mock('@undp_sdg_ai_lab/undp-radar/dist/index.css', () => ({}));

const mockedApiRequest = apiRequest as jest.MockedFunction<typeof apiRequest>;

describe('AppRadarProvider', () => {
  beforeEach(() => {
    mockedApiRequest.mockReset();
  });

  it('loads radar CSV and renders provider children', async () => {
    mockedApiRequest.mockResolvedValue({
      data: 'title,region\nA,Oceania'
    } as any);

    render(
      <AppRadarProvider>
        <div data-testid='child'>child</div>
      </AppRadarProvider>
    );

    expect(screen.getByTestId('radar-provider')).toBeInTheDocument();
    expect(screen.getByTestId('data-provider')).toBeInTheDocument();
    expect(screen.getByTestId('set-data')).toHaveAttribute(
      'data-has-quadrant-comp',
      'true'
    );
    expect(screen.getByTestId('child')).toBeInTheDocument();

    await waitFor(() => {
      expect(mockedApiRequest).toHaveBeenCalledWith('public/radar-csv');
      expect(screen.getByTestId('add-csv')).toHaveAttribute(
        'data-csv',
        'title,region\nA,Oceania'
      );
      expect(screen.getByTestId('add-csv')).toHaveAttribute(
        'data-is-string',
        'true'
      );
    });
  });

  it('handles radar CSV fetch errors without crashing', async () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    mockedApiRequest.mockRejectedValue(new Error('network'));

    render(
      <AppRadarProvider>
        <div>ok</div>
      </AppRadarProvider>
    );

    await waitFor(() => {
      expect(errorSpy).toHaveBeenCalled();
    });
    expect(screen.getByText('ok')).toBeInTheDocument();
    errorSpy.mockRestore();
  });
});
