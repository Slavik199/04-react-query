import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import type { Movie } from '../../types/movie';
import styles from './MovieModal.module.css';

interface MovieModalProps {
  movie: Movie;
  onClose: () => void;
}

export default function MovieModal({ movie, onClose }: MovieModalProps) {
  const {
    title,
    overview,
    release_date,
    vote_average,
    backdrop_path,
  } = movie;

  const imageUrl = `https://image.tmdb.org/t/p/original${backdrop_path}`;

  
  useEffect(() => {
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);


  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  const modalContent = (
    <div
      className={styles.backdrop}
      role="dialog"
      aria-modal="true"
      onClick={handleBackdropClick}
    >
      <div className={styles.modal}>
        <button
          className={styles.closeButton}
          aria-label="Close modal"
          onClick={onClose}
        >
          &times;
        </button>

        <img src={imageUrl} alt={title} className={styles.image} />

        <div className={styles.content}>
          <h2>{title}</h2>
          <p>{overview || 'No overview available.'}</p>
          <p>
            <strong>Release Date:</strong>{' '}
            {release_date || 'Unknown'}
          </p>
          <p>
            <strong>Rating:</strong> {vote_average.toFixed(1)}/10
          </p>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}