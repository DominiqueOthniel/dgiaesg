import { useQuery } from "@tanstack/react-query";
import api from "../services/api";
import type { INews, PaginatedResponse } from "../types";

export const useNews = (filters: { page?: number; limit?: number; published?: boolean } = {}) => {
  const { page = 1, limit = 10, published = true } = filters;
  return useQuery({
    queryKey: ["news", filters],
    queryFn: async () => {
      const params: any = { page, limit, published };
      const response = await api.get<PaginatedResponse<INews>>("/news", { params });
      return response.data;
    },
    staleTime: 1000 * 60 * 5,
  });
};
