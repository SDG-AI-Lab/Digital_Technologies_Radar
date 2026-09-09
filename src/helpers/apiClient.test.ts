import { ApiError, apiRequest } from './apiClient';

describe('apiClient', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    global.fetch = jest.fn();
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('sends Accept and relative paths against the API base URL', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ data: [1] })
    });

    await apiRequest('public/technologies');

    expect(global.fetch).toHaveBeenCalledWith(
      'https://undp-drr-radar-api.netlify.app/api/public/technologies',
      expect.objectContaining({
        signal: expect.any(AbortSignal),
        headers: expect.objectContaining({
          Accept: 'application/json'
        })
      })
    );
  });

  it('strips a leading slash from the path', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({})
    });

    await apiRequest('/health');

    expect(global.fetch).toHaveBeenCalledWith(
      'https://undp-drr-radar-api.netlify.app/api/health',
      expect.objectContaining({ signal: expect.any(AbortSignal) })
    );
  });

  it('attaches Authorization when a token is stored', async () => {
    localStorage.setItem('drr-access-token', 'secret-token');
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({})
    });

    await apiRequest('admin/projects/pending');

    expect(global.fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        signal: expect.any(AbortSignal),
        headers: expect.objectContaining({
          Authorization: 'Bearer secret-token'
        })
      })
    );
  });

  it('sets Content-Type when a body is present', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({})
    });

    await apiRequest('admin/projects', {
      method: 'POST',
      body: JSON.stringify({ title: 'x' })
    });

    expect(global.fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        signal: expect.any(AbortSignal),
        headers: expect.objectContaining({
          'Content-Type': 'application/json'
        })
      })
    );
  });

  it('forwards the request body unchanged to fetch', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({})
    });

    const body = JSON.stringify({
      title: 'x',
      unexpected_client_field: 'kept-as-is'
    });

    await apiRequest('admin/projects', {
      method: 'POST',
      body
    });

    expect(global.fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ body, signal: expect.any(AbortSignal) })
    );
  });

  it('returns the parsed JSON body on success', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ data: { id: 1 } })
    });

    await expect(apiRequest('public/technologies')).resolves.toEqual({
      data: { id: 1 }
    });
  });

  it('throws ApiError with server message when the response is not ok', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 403,
      json: async () => ({ error: 'Administrator access is required' })
    });

    await expect(apiRequest('admin/projects/pending')).rejects.toMatchObject({
      message: 'Administrator access is required',
      status: 403
    });
    await expect(apiRequest('admin/projects/pending')).rejects.toBeInstanceOf(
      ApiError
    );
  });

  it('clears the local session when the API returns 401', async () => {
    localStorage.setItem('drr-access-token', 'stale-token');
    localStorage.setItem('drr-current-user-id', 'admin');
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 401,
      json: async () => ({ error: 'Invalid or expired token' })
    });

    await expect(apiRequest('admin/projects/pending')).rejects.toMatchObject({
      message: 'Invalid or expired token',
      status: 401
    });
    expect(localStorage.getItem('drr-access-token')).toBeNull();
    expect(localStorage.getItem('drr-current-user-id')).toBeNull();
    expect(sessionStorage.getItem('drr-access-token')).toBeNull();
    expect(sessionStorage.getItem('drr-current-user-id')).toBeNull();
  });

  it('throws a generic ApiError when the error body has no message', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => {
        throw new Error('invalid json');
      }
    });

    await expect(apiRequest('health')).rejects.toMatchObject({
      message: 'The request could not be completed',
      status: 500
    });
  });

  it('throws a timeout ApiError when fetch aborts from the client timeout', async () => {
    (global.fetch as jest.Mock).mockImplementation(
      (_url: string, init?: RequestInit) =>
        new Promise((_resolve, reject) => {
          init?.signal?.addEventListener('abort', () => {
            reject(new DOMException('Aborted', 'AbortError'));
          });
        })
    );

    jest.useFakeTimers();
    const pending = apiRequest('public/technologies');
    jest.advanceTimersByTime(30_000);

    await expect(pending).rejects.toMatchObject({
      message: 'The request timed out',
      status: 408
    });
    jest.useRealTimers();
  });
});
