import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  (process.env.REACT_APP_SUPABASE_URL as string) ||
  'https://sxmzetpbqzjchodypatn.supabase.co';
const supabaseKey =
  (process.env.REACT_APP_SUPABASE_KEY as string) ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN4bXpldHBicXpqY2hvZHlwYXRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODMwMjMzOTEsImV4cCI6MTk5ODU5OTM5MX0.9iJ44OhfPGJ7zinXM3M7rattWAb5r12oP-XpHlvILeQ';

export const supabase = createClient(supabaseUrl, supabaseKey);

export const DATA_VERSION = process.env.REACT_APP_DATA_VERSION || '09/06/23';
