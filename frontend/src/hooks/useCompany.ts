import { useQuery } from "@tanstack/react-query";
import api from "@/services/api";
import type { ICompany, ApiResponse } from "@/types";

export const useCompany = (id: string | undefined) => {
  return useQuery({
    queryKey: ["company", id],
    queryFn: async () => {
      const response = await api.get<ApiResponse<ICompany>>(`/companies/${id}`);
      return response.data.data;
    },
    enabled: !!id,
  });
};
