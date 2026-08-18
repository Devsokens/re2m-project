const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';
const TOKEN_KEY = 're2m_auth_token';

export const authToken = {
  get: (): string | null => localStorage.getItem(TOKEN_KEY),
  set: (token: string) => localStorage.setItem(TOKEN_KEY, token),
  clear: () => localStorage.removeItem(TOKEN_KEY)
};

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  isFormData?: boolean;
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const token = authToken.get();
  const headers: Record<string, string> = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  if (!options.isFormData && options.body !== undefined) headers['Content-Type'] = 'application/json';

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: options.method || 'GET',
    headers,
    body: options.isFormData ? (options.body as FormData) : options.body !== undefined ? JSON.stringify(options.body) : undefined
  });

  if (response.status === 204) return undefined as T;

  const isJson = response.headers.get('content-type')?.includes('application/json');
  const payload = isJson ? await response.json().catch(() => null) : null;

  if (!response.ok) {
    throw new ApiError(response.status, payload?.error || `Erreur ${response.status}`);
  }

  return payload as T;
}

// In-memory GET cache: once a resource has loaded during this browser session
// it's returned instantly on subsequent reads (no reload flash when
// navigating back to an already-visited view), and it's invalidated
// automatically whenever a write touches the same resource root.
const getCache = new Map<string, unknown>();
const getCacheInFlight = new Map<string, Promise<unknown>>();

const cacheRoot = (path: string) => '/' + path.split('?')[0].split('/').filter(Boolean).slice(0, 2).join('/');

const invalidateCache = (path: string) => {
  const root = cacheRoot(path);
  for (const key of Array.from(getCache.keys())) {
    if (key.startsWith(root)) getCache.delete(key);
  }
};

const cachedGet = <T>(path: string): Promise<T> => {
  if (getCache.has(path)) return Promise.resolve(getCache.get(path) as T);
  if (getCacheInFlight.has(path)) return getCacheInFlight.get(path) as Promise<T>;
  const promise = request<T>(path)
    .then((data) => {
      getCache.set(path, data);
      getCacheInFlight.delete(path);
      return data;
    })
    .catch((err) => {
      getCacheInFlight.delete(path);
      throw err;
    });
  getCacheInFlight.set(path, promise);
  return promise;
};

const mutate = <T>(path: string, options: RequestOptions): Promise<T> =>
  request<T>(path, options).then((data) => {
    invalidateCache(path);
    return data;
  });

export const apiClient = {
  get: <T>(path: string) => cachedGet<T>(path),
  // Bypasses the cache — for reads that must always reflect the latest state
  // (e.g. right after an optimistic update).
  getFresh: <T>(path: string) => request<T>(path).then((data) => {
    getCache.set(path, data);
    return data;
  }),
  post: <T>(path: string, body?: unknown) => mutate<T>(path, { method: 'POST', body }),
  put: <T>(path: string, body?: unknown) => mutate<T>(path, { method: 'PUT', body }),
  patch: <T>(path: string, body?: unknown) => mutate<T>(path, { method: 'PATCH', body }),
  delete: <T>(path: string) => mutate<T>(path, { method: 'DELETE' }),
  upload: <T>(path: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return mutate<T>(path, { method: 'POST', body: formData, isFormData: true });
  },
  postForm: <T>(path: string, formData: FormData) => mutate<T>(path, { method: 'POST', body: formData, isFormData: true }),
  clearCache: () => {
    getCache.clear();
    getCacheInFlight.clear();
  }
};
