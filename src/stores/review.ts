// src/stores/auth.js
import { defineStore } from 'pinia';
import api from '@/services/api';

import type { ApiResponse, CreateReview, LikeResponse, Review, ReviewFilters, ReviewPaginada, UpdateReview } from '@/types/Review';

export const useReviewStore = defineStore('reviews', {
    actions: {
        async listReviews(
            {
                search,
                user_only
            }: {
                search?: ReviewFilters,
                user_only?: boolean
            } = {}
        ): Promise<ReviewPaginada> {

            const response = await api.get<ReviewPaginada>('/reviews', {
                params: {
                    ...search,
                    user_only
                }
            });

            return response.data;
        }, 
        async listReviewsByMovie(movieId: number): Promise<ReviewPaginada> {

            const response = await api.get<ReviewPaginada>(`/movies/${movieId}/reviews`);

            return response.data;
        }, 
        async detailReview(reviewId: number): Promise<Review> {
            const response = await api.get<Review>(`/revews/${reviewId}`);
            return response.data;
        },
        async createReview(reviewData: CreateReview): Promise<Review> {
            const response = await api.post<Review>('/reviews', reviewData);
            return response.data;
        },
        async updateReview(id: number, reviewData: UpdateReview): Promise<Review> {
            const response = await api.put<Review>(`/reviews/${id}`, reviewData);
            return response.data;
        },
        async deleteReview(id: number): Promise<ApiResponse> {
            const response = await api.delete<ApiResponse>(`/reviews/${id}`);
            return response.data;
        },
        async likeReview(reviewId: number): Promise<LikeResponse> {
            const response = await api.post<LikeResponse>(`/reviews/${reviewId}/like`);
            return response.data;
        },
    }
});

