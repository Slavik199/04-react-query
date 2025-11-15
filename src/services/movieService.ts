import axios from 'axios';
import type { SearchResponse } from '../types/movie';

const API_URL = 'https://api.themoviedb.org/3/search/movie';

export const fetchMovies = async (query: string, page: number = 1): Promise<SearchResponse> => {
  const response = await axios.get<SearchResponse>(API_URL, {
    params: {
      query,
      page,
      include_adult: false,
      language: 'en-US',
    },
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
      accept: 'application/json',
    },
  });

  return response.data;
};