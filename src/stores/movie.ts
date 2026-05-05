// src/stores/auth.js
import { defineStore } from 'pinia';
import api from '@/services/api';
import type { MovieIndex, MovieFilters, UpdateMovieRequest, MovieDetail, MovieIndexResponse, ApiResponse } from '@/types/Movies';


export const useMovieStore = defineStore('movies', {
    actions: {
        async listMovies(search?: MovieFilters): Promise<MovieIndexResponse> {
            const response = await api.get<MovieIndexResponse>("/movies", {
                params: search
            });
            return response.data;
        },
        async detailMovie(movieId: number): Promise<MovieDetail> {
            const response = await api.get<MovieDetail>(`/movies/${movieId}`);
            return response.data;
        },
        async createMovie(tmdbId: number): Promise<ApiResponse<{ tmdb_id: string }>> {
            const response = await api.post<ApiResponse<{ tmdb_id: string }>>("/admin/movies/single", {
                id: tmdbId
            });
            return response.data;
        },
        async importMovies(limit: number): Promise<ApiResponse> {
            const response = await api.post<ApiResponse>("/admin/movies/batch", {
                limit: limit
            });
            return response.data;
        },
        async updateMovie(movieData: UpdateMovieRequest): Promise<MovieDetail> {
            const response = await api.post<MovieDetail>("/admin/movies/update", movieData);
            return response.data;
        },
        async deleteMovie(tmdbId: number): Promise<ApiResponse> {
            const response = await api.delete<ApiResponse>("/admin/movies/delete", {
                params: { id: tmdbId }
            });
            return response.data;
        }
    }
});

