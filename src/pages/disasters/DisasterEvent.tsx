import React, { useState, useEffect } from 'react';
import { PageDetails } from 'components/pageDetails/PageDetails';
import { useParams } from 'react-router-dom';
import { apiRequest } from 'helpers/apiClient';

const SECTIONS = [
  'overview',
  'countries',
  'summary',
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
    try {
      const { data } = await apiRequest<{ data: any }>(
        `public/details/disaster-event/${encodeURIComponent(eventId || '')}`
      );
      setItem(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching disaster event:', error);
      setLoading(false);
    }
  };

  return <PageDetails sections={SECTIONS} item={item} loading={loading} />;
};
