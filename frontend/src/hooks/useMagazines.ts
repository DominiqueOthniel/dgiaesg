import { useQuery } from "@tanstack/react-query";
import api from "../services/api";
import type { LocalizedString } from "../types";

export interface MonthlyReview {
    _id: string;
    title: LocalizedString;
    coverImageUrl: string;
    pdfUrl: string;
    publishDate: string;
    featured: boolean;
}

export const useMagazines = () => {
    return useQuery({
        queryKey: ["magazines"],
        queryFn: async () => {
            const response = await api.get("/reviews"); // Assuming /reviews maps to MonthlyReview
            return response.data.data as MonthlyReview[];
        },
    });
};
