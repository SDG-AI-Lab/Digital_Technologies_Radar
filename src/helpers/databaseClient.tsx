import { apiRequest } from 'helpers/apiClient';

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
