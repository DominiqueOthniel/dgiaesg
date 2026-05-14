import { useQuery } from "@tanstack/react-query";
import api from "../services/api";
import type { ICompany, ApiResponse, PaginatedResponse } from "../types";

export interface CompanyFilters {
    labelId?: string;
    sector?: string;
    region?: string;
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
    includeDeleted?: boolean;
    /** Tri MongoDB, ex. `-score`, `-createdAt` */
    sort?: string;
}

export const useCompanies = (filters: CompanyFilters = {}) => {
    return useQuery({
        queryKey: ["companies", filters],
        queryFn: async () => {
            const params = new URLSearchParams();
            if (filters.labelId) params.append("labelId", filters.labelId);
            if (filters.sector) params.append("sector", filters.sector);
            if (filters.region) params.append("region", filters.region);
            if (filters.status) params.append("status", filters.status);
            if (filters.search) params.append("search", filters.search);
            if (filters.page) params.append("page", filters.page.toString());
            if (filters.limit) params.append("limit", filters.limit.toString());
            if (filters.includeDeleted) params.append("includeDeleted", "true");
            if (filters.sort) params.append("sort", filters.sort);

            const response = await api.get<PaginatedResponse<ICompany>>(`/companies`, { params });
            return response.data;
        },
        staleTime: 1000 * 60 * 5, // 5 minutes
        gcTime: 1000 * 60 * 30, // 30 minutes
    });
};

export const useCompany = (id: string | undefined) => {
    return useQuery({
        queryKey: ["companies", id],
        queryFn: async () => {
            if (!id) return null;
            const response = await api.get<ApiResponse<ICompany>>(`/companies/${id}`);
            return response.data.data;
        },
        enabled: !!id,
        staleTime: 1000 * 60 * 5, // 5 minutes
        gcTime: 1000 * 60 * 30, // 30 minutes
    });
};
