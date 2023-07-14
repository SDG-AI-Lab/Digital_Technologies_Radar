export interface ProjectFields {
  label: string;
  type: string;
  options?: Option[] | string[];
}

export interface Option {
  label: string;
  value: string;
  name?: string;
}

export interface ProjectFieldValues {
  title: string;
  description: string;
  source: string;
  img_url: string;
  date_of_implementation: string;
  theme: string;
  sdg: string;
  data: string;
  use_case: string;
  status: string;
  disaster_cycles: string;
  partner: string;
  un_host: string;
  country: string;
  disaster_type: string;
  technology: string;
  region: string;
  subregion: string;
}
