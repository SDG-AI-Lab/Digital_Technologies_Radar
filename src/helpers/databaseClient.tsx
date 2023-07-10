import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  (process.env.REACT_APP_SUPABASE_URL as string) ||
  'https://sxmzetpbqzjchodypatn.supabase.co';
const supabaseKey =
  (process.env.REACT_APP_SUPABASE_KEY as string) ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN4bXpldHBicXpqY2hvZHlwYXRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODMwMjMzOTEsImV4cCI6MTk5ODU5OTM5MX0.9iJ44OhfPGJ7zinXM3M7rattWAb5r12oP-XpHlvILeQ';

export const supabase = createClient(supabaseUrl, supabaseKey);

export const getDataVersion = async () => {
  const { data, error } = await supabase
    .from('dataset_version')
    .select(`data_version`)
    .single();
  if (!error) {
    const version = localStorage.getItem('drr-data-version') as string;
    if (version !== data?.data_version) {
      localStorage.setItem('drr-data-version', data?.data_version);
    }
  }
};

export const DATA_VERSION =
  localStorage.getItem('drr-data-version') || '10/07/2023';
