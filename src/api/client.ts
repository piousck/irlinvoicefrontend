import axios from 'axios';
import { useAuthStore } from '../store/authStore';

export const apiClient = axios.create({
  baseURL: '/api',
});

apiClient.interceptors.request.use((config) => {
  const state = useAuthStore.getState();
  if (state.token) {
    config.headers = config.headers ?? {};
    config.headers['Authorization'] = `Bearer ${state.token}`;
  }
  if (state.organisationId) {
    config.headers = config.headers ?? {};
    config.headers['X-Organisation-ID'] = state.organisationId;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);
