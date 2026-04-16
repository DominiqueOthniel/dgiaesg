import { useQuery } from "@tanstack/react-query";
import api from "../services/api";
import type { MonthlyReview } from "../types";

export const useMagazines = () => {
  return useQuery({
    queryKey: ["magazines"],
    queryFn: async () => {
      const response = await api.get("/reviews");
      return response.data.data as MonthlyReview[];
    },
  });
};
