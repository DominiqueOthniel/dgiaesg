import { useQuery } from "@tanstack/react-query";
import api from "../services/api";
import type { INews, ApiResponse, PaginatedResponse } from "../types";

export const useNews = (filters: { page?: number; limit?: number; search?: string; includeDeleted?: boolean; published?: boolean } = {}) => {
    const { page = 1, limit = 10, search, includeDeleted, published = true } = filters;
    return useQuery({
        queryKey: ["news", filters],
        queryFn: async () => {
            const params: any = { page, limit };
            if (published !== undefined) params.published = published;
            if (search) params.search = search;
            if (includeDeleted) params.includeDeleted = true;

            const response = await api.get<PaginatedResponse<INews>>("/news", {
                params,
            });
            return response.data;
        },
        staleTime: 1000 * 60 * 5, // 5 minutes
        gcTime: 1000 * 60 * 30, // 30 minutes
    });
};

export const useNewsArticle = (slug: string | undefined) => {
    return useQuery({
        queryKey: ["news", "slug", slug],
        queryFn: async () => {
            if (!slug) return null;
            const response = await api.get<ApiResponse<INews>>(`/news/slug/${slug}`);
            return response.data.data;
        },
        enabled: !!slug,
        staleTime: 1000 * 60 * 5, // 5 minutes
        gcTime: 1000 * 60 * 30, // 30 minutes
    });
};
