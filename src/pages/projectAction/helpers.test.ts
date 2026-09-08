import {
  initialProjectFormValues,
  populateData,
  validatePayload
} from './helpers';
import { ProjectFieldValues } from './types';

const baseOptions = [{ label: 'Opt', value: 'Opt' }];

const validPayload = (): ProjectFieldValues => ({
  ...initialProjectFormValues,
  title: 'Early warning',
  description: 'Desc',
  source: 'https://example.com',
  img_url: 'https://example.com/i.png',
  date_of_implementation: '2024',
  theme: 'Climate',
  sdg: '{SDG 13}',
  data: '{Spatial}',
  use_case: 'Awareness',
  status: 'production',
  disaster_cycles: '{response}',
  partner: '{UNDP}',
  un_host: '{UNDP}',
  country: '{Fiji}',
  disaster_type: 'Flood',
  technology: '{GIS}'
});

describe('projectAction helpers', () => {
  describe('populateData', () => {
    it('builds the expected field list with provided options', () => {
      const fields = populateData({
        disasterTypes: [{ label: 'Flood', value: 'Flood' }],
        technologies: [{ label: 'GIS', value: 'GIS' }],
        countries: [{ label: 'Fiji', value: 'Fiji' }],
        themes: baseOptions,
        dataTypes: baseOptions,
        useCases: baseOptions,
        partners: baseOptions,
        unHosts: baseOptions
      });

      expect(fields.map((f) => f.label)).toEqual([
        'title',
        'description',
        'source',
        'img_url',
        'date_of_implementation',
        'theme',
        'sdg',
        'data',
        'use_case',
        'status',
        'disaster_cycles',
        'partner',
        'un_host',
        'country',
        'disaster_type',
        'technology'
      ]);
      expect(fields.find((f) => f.label === 'technology')?.options).toEqual([
        { label: 'GIS', value: 'GIS' }
      ]);
      expect(fields.find((f) => f.label === 'sdg')?.options).toHaveLength(18);
      expect(fields.find((f) => f.label === 'status')?.options).toEqual([
        'idea',
        'validation',
        'prototype',
        'production'
      ]);
    });
  });

  describe('validatePayload', () => {
    it('accepts a fully populated payload', () => {
      expect(validatePayload(validPayload())).toBe(true);
    });

    it('rejects missing required text fields', () => {
      expect(validatePayload({ ...validPayload(), title: '' })).toBe(false);
      expect(validatePayload({ ...validPayload(), description: '' })).toBe(
        false
      );
      expect(validatePayload({ ...validPayload(), source: '' })).toBe(false);
    });

    it('rejects empty multi-select placeholders', () => {
      expect(validatePayload({ ...validPayload(), sdg: '{}' })).toBe(false);
      expect(validatePayload({ ...validPayload(), country: '{}' })).toBe(false);
      expect(validatePayload({ ...validPayload(), technology: '{}' })).toBe(
        false
      );
    });
  });
});
