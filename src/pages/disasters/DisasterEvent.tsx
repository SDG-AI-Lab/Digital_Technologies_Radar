import React, { useState, useEffect } from 'react';
import { PageDetails } from 'components/pageDetails/PageDetails';
import { useParams } from 'react-router-dom';
import { supabase } from 'helpers/databaseClient';

const SECTIONS = [
  'overview',
  'impact',
  'how to help',
  'resources',
  'solutions',
  'contacts'
];

export const DisasterEvent: React.FC = () => {
  const [item, setItem] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const { eventId } = useParams();

  useEffect(() => {
    void getDisasterEvent();
  }, []);

  const getDisasterEvent = async (): Promise<any> => {
    const { data, error } = await supabase
      .from('disaster_events')
      .select()
      .eq('uuid', eventId)
      .single();
    if (!error) {
      setItem(data);
      setLoading(false);
    }
  };

  return <PageDetails sections={SECTIONS} item={item} loading={loading} />;
};
