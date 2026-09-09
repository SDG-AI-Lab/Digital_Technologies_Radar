import { clearSession, getAccessToken } from 'components/shared/helpers/auth';

const API_BASE_URL =
  process.env.REACT_APP_RADAR_API_URL ||
  'https://undp-drr-radar-api.netlify.app/api';

const DEFAULT_TIMEOUT_MS = 30_000;

export class ApiError extends Error {
  constructor(message: string, public readonly status: number) {
    super(message);
  }
}

const createTimeoutSignal = (
  timeoutMs: number,
  externalSignal?: AbortSignal | null
): { signal: AbortSignal; cleanup: () => void } => {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), timeoutMs);

  const onExternalAbort = (): void => controller.abort();
  if (externalSignal) {
    if (externalSignal.aborted) {
      controller.abort();
    } else {
      externalSignal.addEventListener('abort', onExternalAbort);
    }
  }

  return {
    signal: controller.signal,
    cleanup: () => {
      window.clearTimeout(timeoutId);
      externalSignal?.removeEventListener('abort', onExternalAbort);
    }
  };
};

export const apiRequest = async <T>(
  path: string,
  options: RequestInit = {}
): Promise<T> => {
  const token = getAccessToken();
  const { signal: externalSignal, ...restOptions } = options;
  const { signal, cleanup } = createTimeoutSignal(
    DEFAULT_TIMEOUT_MS,
    externalSignal
  );

  try {
    const response = await fetch(`${API_BASE_URL}/${path.replace(/^\//, '')}`, {
      ...restOptions,
      signal,
      headers: {
        Accept: 'application/json',
        ...(restOptions.body ? { 'Content-Type': 'application/json' } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...restOptions.headers
      }
    });
    const body = await response.json().catch(() => ({}));
    if (!response.ok) {
      // Expired / invalid tokens should drop the local session so the UI
      // prompts the user to sign in again.
      if (response.status === 401) {
        clearSession();
      }
      throw new ApiError(
        body.error || 'The request could not be completed',
        response.status
      );
    }
    return body as T;
  } catch (error) {
    if (
      error instanceof DOMException &&
      error.name === 'AbortError' &&
      !externalSignal?.aborted
    ) {
      throw new ApiError('The request timed out', 408);
    }
    throw error;
  } finally {
    cleanup();
  }
};
