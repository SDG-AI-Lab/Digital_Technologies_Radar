import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://sxmzetpbqzjchodypatn.supabase.co';
const supabaseKey = process.env.REACT_APP_SUPABASE_KEY;
// const supabaseKey =
//   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN4bXpldHBicXpqY2hvZHlwYXRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODMwMjMzOTEsImV4cCI6MTk5ODU5OTM5MX0.9iJ44OhfPGJ7zinXM3M7rattWAb5r12oP-XpHlvILeQ';
export const supabase = createClient(supabaseUrl, supabaseKey as string);
