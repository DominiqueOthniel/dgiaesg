import { useQuery } from "@tanstack/react-query";
import api from "@/services/api";
import type { ILabel, ApiResponse } from "@/types";

export const useLabel = (id: string | undefined) => {
  return useQuery({
    queryKey: ["label", id],
    queryFn: async () => {
      const response = await api.get<ApiResponse<ILabel>>(`/labels/${id}`);
      return response.data.data;
    },
    enabled: !!id,
  });
};
