import axios from 'axios';

// Lazy import to avoid circular dependency
let _getState: (() => { token: string | null; organisationId: string | null; logout: () => void }) | null = null;

export function registerAuthStore(
  getState: () => { token: string | null; organisationId: string | null; logout: () => void }
) {
  _getState = getState;
}

export const apiClient = axios.create({
  baseURL: '/api',
});

apiClient.interceptors.request.use((config) => {
  if (_getState) {
    const state = _getState();
    if (state.token) {
      config.headers = config.headers ?? {};
      (config.headers as Record<string, string>)['Authorization'] = `Bearer ${state.token}`;
    }
    if (state.organisationId) {
      config.headers = config.headers ?? {};
      (config.headers as Record<string, string>)['X-Organisation-ID'] = state.organisationId;
    }
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (
      axios.isAxiosError(error) &&
      error.response?.status === 401 &&
      _getState
    ) {
      _getState().logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
