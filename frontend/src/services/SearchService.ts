import api from './api';

export interface SearchResults {
    labels: any[];
    companies: any[];
    news: any[];
}

export const searchEntities = async (query: string): Promise<SearchResults> => {
    const { data } = await api.get(`/search?q=${encodeURIComponent(query)}`);
    return data.data;
};
