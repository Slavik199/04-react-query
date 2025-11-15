import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import ReactPaginate from 'react-paginate';
import toast, { Toaster } from 'react-hot-toast';
import styles from './App.module.css';

import SearchBar from '../SearchBar/SearchBar';
import MovieGrid from '../MovieGrid/MovieGrid';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import MovieModal from '../MovieModal/MovieModal';

import { fetchMovies } from '../../services/movieService';
import type { Movie } from '../../types/movie';

export default function App() {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['movies', query, page],
    queryFn: () => fetchMovies(query, page),
    enabled: !!query,
    staleTime: 1000 * 60 * 5,
  });

  const movies = data?.results ?? [];
  const totalPages = data?.total_pages ?? 0;

  const handleSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) {
      toast.error('Please enter your search query.');
      return;
    }
    setQuery(searchQuery);
    setPage(1);
  };

  const handlePageChange = ({ selected }: { selected: number }) => {
    setPage(selected + 1);
  };

  const openModal = (movie: Movie) => setSelectedMovie(movie);
  const closeModal = () => setSelectedMovie(null);

  return (
    <div className={styles.app}>
      <SearchBar onSubmit={handleSearch} />

      <main>
        {isLoading && <Loader />}
        {isError && <ErrorMessage />}
        {!isLoading && !isError && movies.length > 0 && (
          <>
            <MovieGrid movies={movies} onSelect={openModal} />
            {totalPages > 1 && (
              <ReactPaginate
                pageCount={totalPages}
                pageRangeDisplayed={5}
                marginPagesDisplayed={1}
                onPageChange={handlePageChange}
                forcePage={page - 1}
                containerClassName={styles.pagination}
                activeClassName={styles.active}
                nextLabel="→"
                previousLabel="←"
              />
            )}
          </>
        )}
      </main>

      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={closeModal} />
      )}

      <Toaster position="top-center" />
    </div>
  );
}