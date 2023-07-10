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
  name: string;
  description: string;
  source: string;
  img_url: string;
  date: string;
  theme: string;
  sdg: string;
  data: string;
  use_case: string;
  status: string;
  disaster_cycle: string;
  partner: string;
  un_host: string;
  country: string;
  disaster_type: string;
  disaster_type_id?: string;
  technology: string;
  region: string;
  sub_region: string;
  // [key: string]: string | undefined;
}
