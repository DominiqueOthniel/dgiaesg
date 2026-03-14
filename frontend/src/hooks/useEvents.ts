import { useQuery } from "@tanstack/react-query";
import api from "../services/api";
import type { IEvent, ApiResponse } from "../types";

export const useEvents = (filters: { type?: string; published?: boolean; featured?: boolean; limit?: number } = {}) => {
    return useQuery({
        queryKey: ["events", filters],
        queryFn: async () => {
            const params: any = { ...filters };
            const response = await api.get<ApiResponse<IEvent[]>>("/events", { params });
            return response.data.data;
        },
        staleTime: 1000 * 60 * 5,
    });
};

export const useEvent = (id: string | undefined) => {
    return useQuery({
        queryKey: ["events", id],
        queryFn: async () => {
            if (!id) return null;
            const response = await api.get<ApiResponse<IEvent>>(`/events/${id}`);
            return response.data.data;
        },
        enabled: !!id,
        staleTime: 1000 * 60 * 5,
    });
};
