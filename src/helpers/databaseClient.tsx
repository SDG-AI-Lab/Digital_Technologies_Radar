import { createClient } from '@supabase/supabase-js';
import { apiRequest } from 'helpers/apiClient';

const supabaseUrl =
  (process.env.REACT_APP_SUPABASE_URL as string) ||
  'https://sxmzetpbqzjchodypatn.supabase.co';
const supabaseKey =
  (process.env.REACT_APP_SUPABASE_KEY as string) ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN4bXpldHBicXpqY2hvZHlwYXRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODMwMjMzOTEsImV4cCI6MTk5ODU5OTM5MX0.9iJ44OhfPGJ7zinXM3M7rattWAb5r12oP-XpHlvILeQ';

export const supabase = createClient(supabaseUrl, supabaseKey);

export const getDataVersion = async (): Promise<void> => {
  try {
    const { data } = await apiRequest<{ data: { data_version: string } }>(
      'public/dataset-version'
    );
    const version = localStorage.getItem('drr-data-version') as string;
    if (version !== data?.data_version) {
      // Remove all entries in localStorage that begin with 'drr-'
      // apart from the active sign-in session so that we can start fresh.
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const key = localStorage.key(i);
        if (
          key?.startsWith('drr-') &&
          key !== 'drr-current-user-id' &&
          key !== 'drr-access-token'
        ) {
          localStorage.removeItem(key);
        }
      }
      localStorage.setItem('drr-data-version', data?.data_version);
    }
  } catch (error) {
    console.error('Error fetching the data version:', error);
  }
};

export const DATA_VERSION =
  localStorage.getItem('drr-data-version') || '1689333252569';
