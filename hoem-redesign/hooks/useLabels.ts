import { useQuery } from "@tanstack/react-query";
import api from "../services/api";
import type { ILabel, ApiResponse } from "../types";

export const useLabels = () => {
  return useQuery({
    queryKey: ["labels"],
    queryFn: async () => {
      const response = await api.get<ApiResponse<ILabel[]>>("/labels");
      return response.data.data;
    },
    staleTime: 1000 * 60 * 5,
  });
};
