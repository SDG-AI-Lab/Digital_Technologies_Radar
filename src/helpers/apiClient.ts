const API_BASE_URL =
  process.env.REACT_APP_RADAR_API_URL ||
  'https://undp-drr-radar-api.netlify.app/api';

export class ApiError extends Error {
  constructor(message: string, public readonly status: number) {
    super(message);
  }
}

export const apiRequest = async <T>(
  path: string,
  options: RequestInit = {}
): Promise<T> => {
  const token = localStorage.getItem('drr-access-token');
  const response = await fetch(`${API_BASE_URL}/${path.replace(/^\//, '')}`, {
    ...options,
    headers: {
      Accept: 'application/json',
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers
    }
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new ApiError(
      body.error || 'The request could not be completed',
      response.status
    );
  }
  return body as T;
};
