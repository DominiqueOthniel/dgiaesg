import { useQuery } from "@tanstack/react-query";
import api from "../services/api";
import type { ICompany, PaginatedResponse } from "../types";

export const useCompanies = (filters: { limit?: number; status?: string } = {}) => {
  return useQuery({
    queryKey: ["companies", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.limit) params.append("limit", filters.limit.toString());
      if (filters.status) params.append("status", filters.status);
      const response = await api.get<PaginatedResponse<ICompany>>("/companies", { params });
      return response.data;
    },
    staleTime: 1000 * 60 * 5,
  });
};
