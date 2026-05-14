import axios from 'axios';
import { useAuthStore } from '@/stores/auth';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

axios.interceptors.request.use((config) => {
  const authStore = useAuthStore();
  if (authStore.token) {
    config.headers.Authorization = `Bearer ${authStore.token}`;
  }
  return config;
});

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const authStore = useAuthStore();
      authStore.logout(); // Limpa tudo se o token expirar
    }
    return Promise.reject(error);
  }
);