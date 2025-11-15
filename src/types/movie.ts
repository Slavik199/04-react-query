export interface Movie {
  id: number;
  title: string;
  poster_path: string;
  backdrop_path: string;
  overview: string;
  release_date: string;
  vote_average: number;
}

export interface SearchResponse {
  results: Movie[];
  total_pages: number;
  total_results: number;
}