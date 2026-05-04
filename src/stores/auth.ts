// src/stores/auth.js
import { defineStore } from 'pinia';
import api from '@/services/api';

interface User {
  id: number;
  name: string;
  email: string;
  is_admin: boolean;
  roles: string[];        
  permissions: string[];  
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    token: localStorage.getItem('token') || null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
  },
  actions: {
    async login(credentials: any) {
      const response = await api.post('/login', credentials);
      this.setToken(response.data.access_token);
      this.user = response.data.user;
    },
    async register(credentials: any) {
      const response = await api.post('/register', credentials);
      this.setToken(response.data.access_token);
      this.user = response.data.user;
    },
    setToken(token: string) {
      this.token = token;
      localStorage.setItem('token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    },
    logout() {
      this.token = null;
      this.user = null;
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
    }
  },
});