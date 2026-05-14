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
    user: JSON.parse(localStorage.getItem('user') || 'null') as User | null,
    token: localStorage.getItem('token') || null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
  },
  actions: {
    setUser(user: User) {
      this.user = user;
      localStorage.setItem('user', JSON.stringify(user)); // Salva no disco
    },
    async fetchUser() {
      if (!this.token) return;
      try {
        const response = await api.get('/me'); // Rota no Laravel que retorna Auth::user()
        this.user = response.data;
      } catch (error) {
        this.logout(); // Se o token for inválido/expirado, limpa tudo
      }
    },
    async login(credentials: any) {
      const response = await api.post('/login', credentials);
      this.setToken(response.data.access_token);
      this.setUser(response.data.user); // Usa o novo método
    },
    async register(credentials: any) {
      const response = await api.post('/register', credentials);
      this.setToken(response.data.access_token);
      this.setUser(response.data.user); // Usa o novo método
    },
    setToken(token: string) {
      this.token = token;
      localStorage.setItem('token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    },
    logout() {
      this.token = null;
      this.user = null;
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
    }
  },
});