import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from 'helpers/databaseClient';
import { CSVLink } from 'react-csv';

export const DownloadCsv: React.FC = () => {
  const [csvData, setCsvData] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const password = prompt('Please enter password');
    if (
      password?.toLocaleLowerCase() !==
      (process.env.REACT_APP_DATA_PASSWORD || 'sdgailabs')
    ) {
      alert('Invalid Password');
      return navigate('/projects');
    }
    void getData();
  }, []);

  const getData = async (): Promise<void> => {
    const { data, error } = await supabase.from('project_data').select();
    if (!error) {
      // @ts-expect-error
      setCsvData(data);
      setLoading(false);
    }
  };
  return (
    <div style={{ margin: '20px 0 0 20px' }}>
      <h3>Download projects csv</h3>

      {!loading && <CSVLink data={csvData}>{'>>>Download<<<'}</CSVLink>}
    </div>
  );
};
