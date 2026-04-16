import { useQuery } from "@tanstack/react-query";
import api from "@/services/api";

export interface ICriteria {
  _id: string;
  name: { fr: string; en: string };
  description: { fr: string; en: string };
  weight: number;
  labelId: string;
}

export const useCriteria = (labelId: string | undefined) => {
  return useQuery({
    queryKey: ["criteria", labelId],
    queryFn: async () => {
      const response = await api.get(`/criteria?labelId=${labelId}`);
      return response.data.data as ICriteria[];
    },
    enabled: !!labelId,
  });
};
