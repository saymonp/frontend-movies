// src/stores/auth.js
import { defineStore } from 'pinia';
import api from '@/services/api';
import type { MovieIndex, DinamicMovieInsertionResponse, DiretorResponse, MovieFilters, UpdateMovieRequest, MovieDetail, MovieIndexResponse, GeneroResponse, ApiResponse, FullMovieDetailsResponse, MovieFullDetailsResponse } from '@/types/Movies';


export const useMovieStore = defineStore('movies', {
    actions: {
        async listMovies(search?: MovieFilters): Promise<MovieIndexResponse | DinamicMovieInsertionResponse> {
            const response = await api.get<MovieIndexResponse | DinamicMovieInsertionResponse>("/movies",
                {
                    params: search,
                }
            );

            return response.data;
        },
        async detailMovie(movieIdSlug: string): Promise<MovieDetail> {
            const response = await api.get<MovieDetail>(`/movies/${movieIdSlug}`);
            return response.data;
        },
        async fullDetailMovie(movieIdSlug: string): Promise<MovieFullDetailsResponse> {
            const response = await api.get<MovieFullDetailsResponse>(`/movies/${movieIdSlug}/full-details`);
            return response.data;
        },
        async importSingleMovie(tmdbId: number): Promise<ApiResponse<{ tmdb_id: string }>> {
            const response = await api.post<ApiResponse<{ tmdb_id: string }>>(`/admin/movies/single/${tmdbId}`);
            return response.data;
        },
        async importBatchMovies(limit: number): Promise<ApiResponse> {
            const response = await api.post<ApiResponse>(`/admin/movies/batch/${limit}`);
            return response.data;
        },
        async updateManualMovie(movieData: UpdateMovieRequest): Promise<MovieDetail> {
            const response = await api.post<MovieDetail>("/admin/movies/update", movieData);
            return response.data;
        },
        async deleteMovie(id: number): Promise<ApiResponse> {
            const response = await api.delete<ApiResponse>(`/admin/movies/delete/${id}`);
            return response.data;
        },
        async listGenres(): Promise<GeneroResponse[]> {
            const response = await api.get<GeneroResponse[]>("/movies/generos");
            return response.data;
        },
        async listDirectors(): Promise<DiretorResponse[]> {
            const response = await api.get<DiretorResponse[]>("/movies/diretores");
            return response.data;
        },
        async listIdioms(): Promise<string[]> {
            const response = await api.get<string[]>("/movies/idiomas");
            return response.data;
        },
    }
});

