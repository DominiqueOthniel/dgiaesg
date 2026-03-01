import { useQuery } from "@tanstack/react-query";
import api from "../services/api";
import type { ICriteria, ApiResponse } from "../types";

export const useCriteria = (labelId: string | undefined) => {
    return useQuery({
        queryKey: ["criteria", labelId],
        queryFn: async () => {
            if (!labelId) return [];
            const response = await api.get<ApiResponse<ICriteria[]>>(`/criteria`, {
                params: { labelId },
            });
            return response.data.data;
        },
        enabled: !!labelId,
    });
};
