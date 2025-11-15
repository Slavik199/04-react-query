import './App.module.css';
import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';

import SearchBar from '../SearchBar/SearchBar';
import MovieGrid from '../MovieGrid/MovieGrid';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import MovieModal from '../MovieModal/MovieModal';


import { fetchMovies } from '../../services/movieService';


import type { Movie } from '../../types/movie';

export default function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const handleSearch = async (query: string) => {
    if (!query.trim()) return;

    setLoading(true);
    setError(false);
    setMovies([]);

    try {
      const results = await fetchMovies(query);
      setMovies(results);

      if (results.length === 0) {
        toast.error('No movies found for your request.');
      }
    } catch (err) {
      console.error(err);
      setError(true);
      toast.error('There was an error, please try again...');
    } finally {
      setLoading(false);
    }
  };

  const openModal = (movie: Movie) => setSelectedMovie(movie);
  const closeModal = () => setSelectedMovie(null);

  return (
    <div className="app">
      {/* Хедер з пошуком */}
      <SearchBar onSubmit={handleSearch} />

      {/* Основний контент */}
      <main>
        {loading && <Loader />}
        {error && <ErrorMessage />}
        {!loading && !error && movies.length > 0 && (
          <MovieGrid movies={movies} onSelect={openModal} />
        )}
      </main>

      {/* Модалка */}
      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={closeModal} />
      )}

      {/* Тости */}
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
    </div>
  );
}