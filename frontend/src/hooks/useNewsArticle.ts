import { useQuery } from "@tanstack/react-query";
import api from "@/services/api";
import type { INews, ApiResponse } from "@/types";

export const useNewsArticle = (slug: string | undefined) => {
  return useQuery({
    queryKey: ["news-article", slug],
    queryFn: async () => {
      const response = await api.get<ApiResponse<INews>>(`/news/slug/${slug}`);
      return response.data.data;
    },
    enabled: !!slug,
  });
};
