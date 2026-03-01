import { useQuery } from "@tanstack/react-query";
import api from "../services/api";
import type { ILabel, ApiResponse } from "../types";

export const useLabels = (includeDeleted?: boolean) => {
    return useQuery({
        queryKey: ["labels", includeDeleted],
        queryFn: async () => {
            const params = new URLSearchParams();
            if (includeDeleted) params.append("includeDeleted", "true");
            const response = await api.get<ApiResponse<ILabel[]>>("/labels", { params });
            return response.data.data;
        },
        staleTime: 1000 * 60 * 5, // 5 minutes
        gcTime: 1000 * 60 * 30, // 30 minutes
    });
};

export const useLabel = (id: string | undefined) => {
    return useQuery({
        queryKey: ["labels", id],
        queryFn: async () => {
            if (!id) return null;
            const response = await api.get<ApiResponse<ILabel>>(`/labels/${id}`);
            return response.data.data;
        },
        enabled: !!id,
        staleTime: 1000 * 60 * 5, // 5 minutes
        gcTime: 1000 * 60 * 30, // 30 minutes
    });
};
