import { useQuery } from "@tanstack/react-query";
import api from "@/services/api";
import type { ApiResponse } from "@/types";

export interface ICriteria {
  _id: string;
  name: { [key: string]: string } | string;
  description: { [key: string]: string } | string;
  weight: number;
  labelId: string;
}

export const useCriteria = (labelId: string | undefined) => {
  return useQuery({
    queryKey: ["criteria", labelId],
    queryFn: async () => {
      const response = await api.get<ApiResponse<ICriteria[]>>(`/labels/${labelId}/criteria`);
      return response.data.data;
    },
    enabled: !!labelId,
  });
};
