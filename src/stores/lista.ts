// src/stores/auth.js
import { defineStore } from 'pinia';
import api from '@/services/api';
import type { Lista, ListaFilters, ListaPaginada, CreateLista, ApiResponse, LikeResponse } from '@/types/Listas';


export const useListaStore = defineStore('listas', {
    actions: {
        async listListas(search?: ListaFilters, user_only?: boolean): Promise<ListaPaginada> {
            const response = await api.get<ListaPaginada>(`/listas`, {
                // O Axios espera que os parâmetros de consulta fiquem aqui dentro
                params: {
                    ...search,
                    perfil: user_only
                }
            });

            return response.data;
        },
        async detailLista(listaIdSlug: string): Promise<Lista> {
            const response = await api.get<Lista>(`/listas/${listaIdSlug}`);
            return response.data;
        },
        async createLista(listaData: CreateLista): Promise<Lista> {
            const response = await api.post<Lista>('/listas', listaData);
            return response.data;
        },
        async updateLista(listaData: CreateLista): Promise<Lista> {
            const response = await api.put<Lista>('/listas', listaData);
            return response.data;
        },
        async deleteLista(id: number): Promise<ApiResponse> {
            const response = await api.delete<ApiResponse>(`/listas/${id}`);
            return response.data;
        },
        async reorderMoviesLista(listaId: number, movieIds: number[]): Promise<ApiResponse> {
            const response = await api.post<ApiResponse>(`/listas/${listaId}`);
            return response.data;
        },
        async likeLista(listaId: number, movieIds: number[]): Promise<LikeResponse> {
            const response = await api.post<LikeResponse>(`/listas/${listaId}/like`);
            return response.data;
        },
    }
});

