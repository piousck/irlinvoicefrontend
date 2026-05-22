import axios from 'axios';

const getAuthState = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mod = (window as any).__authStore;
  return mod ? mod.getState() : null;
};

export const apiClient = axios.create({
  baseURL: '/api',
});

apiClient.interceptors.request.use((config) => {
  const state = getAuthState();
  if (state?.token) {
    config.headers = config.headers ?? {};
    config.headers['Authorization'] = `Bearer ${state.token}`;
  }
  if (state?.organisationId) {
    config.headers = config.headers ?? {};
    config.headers['X-Organisation-ID'] = state.organisationId;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const state = getAuthState();
      if (state?.logout) state.logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);
