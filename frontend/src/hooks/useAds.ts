import { useQuery } from "@tanstack/react-query";
import api from "../services/api";

export interface Ad {
    _id: string;
    title: string;
    imageUrl: string;
    targetUrl: string;
    position: "sidebar" | "top" | "inline";
}

export const useRandomAd = (position: string) => {
    return useQuery({
        queryKey: ["ads", "random", position],
        queryFn: async () => {
            const response = await api.get(`/ads/random?position=${position}`);
            return response.data.data as Ad;
        },
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
};
