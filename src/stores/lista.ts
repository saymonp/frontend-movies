// src/stores/auth.js
import { defineStore } from 'pinia';
import api from '@/services/api';
import type { Lista, ListaFilters, ListaPaginada, ListaResponse, CreateLista, ApiResponse, LikeResponse, MovieWithDirectors, UpdateLista } from '@/types/Listas';


export const useListaStore = defineStore('listas', {
    actions: {
        async listListas({ search, user_only }: { search?: ListaFilters, user_only?: boolean } = {}): Promise<ListaPaginada> {
            const response = await api.get<ListaPaginada>(`/listas`,
                {
                    params: search,
                }
            );
            return response.data;
        },
        async moviesAddToList(search: string): Promise<MovieWithDirectors[]> {
            const response = await api.get<MovieWithDirectors[]>(`/movies/listas`, {
                params: {
                    search: search
                }
            });
            return response.data;
        },
        async detailLista(listaId: number): Promise<Lista> {
            const response = await api.get<Lista>(`/listas/${listaId}`);
            return response.data;
        },
        async createLista(listaData: CreateLista): Promise<Lista> {
            const response = await api.post<Lista>('/listas', listaData);
            return response.data;
        },
        async updateLista(id:number, listaData: UpdateLista): Promise<ListaResponse> {
            const response = await api.put<ListaResponse>(`/listas/${id}`, listaData);
            return response.data;
        },
        async deleteLista(id: number): Promise<ApiResponse> {
            const response = await api.delete<ApiResponse>(`/listas/${id}`);
            return response.data;
        },
        async reorderMoviesLista(listaId: number, movieIds: number[]): Promise<ApiResponse> {
            // Enviamos os IDs dentro de um objeto
            const response = await api.put<ApiResponse>(`/listas/${listaId}/reorder`, {
                movie_ids: movieIds
            });
            return response.data;
        },
        async likeLista(listaId: number, movieIds: number[]): Promise<LikeResponse> {
            const response = await api.post<LikeResponse>(`/listas/${listaId}/like`);
            return response.data;
        },
    }
});

