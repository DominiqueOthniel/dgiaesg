import api from './api';

export interface SearchResults {
    labels: any[];
    companies: any[];
    news: any[];
    multimedia: any[];
}

export interface SearchParams {
    query: string;
    sector?: string;
    dateFrom?: string;
    dateTo?: string;
}

export const searchEntities = async (params: SearchParams): Promise<SearchResults> => {
    const { query, sector, dateFrom, dateTo } = params;
    let url = `/search?q=${encodeURIComponent(query)}`;

    if (sector && sector !== 'all') url += `&sector=${sector}`;
    if (dateFrom) url += `&dateFrom=${dateFrom}`;
    if (dateTo) url += `&dateTo=${dateTo}`;

    const { data } = await api.get(url);
    return data.data;
};
