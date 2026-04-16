import { useQuery } from "@tanstack/react-query";
import api from "../services/api";
import type { IEvent, ApiResponse } from "../types";

export const useEvents = (filters: { limit?: number; featured?: boolean } = {}) => {
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
