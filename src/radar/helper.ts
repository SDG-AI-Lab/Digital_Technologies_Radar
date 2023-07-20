import { supabase } from 'helpers/databaseClient';
import csvData from '../assets/csv/tr_data_14_07_23_00.csv';

const csvFile = csvData;

const ddd = async (): Promise<any[] | undefined> => {
  let dddata;
  const { data, error } = await supabase.from('tr_projects').select();
  if (!error) {
    dddata = data;
  }

  return dddata;
};

export { csvFile, ddd };
