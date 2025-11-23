import { useState, useMemo, useCallback } from 'react';
import Hero from '@/components/Hero.jsx';
import PosterGrid from '@/components/PosterGrid.jsx';
import Filters from '@/components/Filters.jsx';
import MovieModal from '@/components/MovieModal.jsx';
import { useMovies } from '@/hooks/useMovies.js';

export default function Home() {
  const { movies, isLoading } = useMovies();
  const [filters, setFilters] = useState({ genre: 'All', year: 'All', language: 'All', category: 'All' });
  const [activeMovie, setActiveMovie] = useState(null);

  const filtered = useMemo(() => {
    return movies.filter((m) => {
      const matchesGenre = filters.genre === 'All' || m.genres?.includes(filters.genre);
      const matchesYear = filters.year === 'All' || String(m.year) === String(filters.year);
      const matchesLang = filters.language === 'All' || m.language === filters.language;
      const matchesCat = filters.category === 'All' || (m.category || '') === filters.category;
      return matchesGenre && matchesYear && matchesLang && matchesCat;
    });
  }, [movies, filters]);

  const handleSelect = useCallback((movie) => setActiveMovie(movie), []);
  const handleClose = useCallback(() => setActiveMovie(null), []);

  return (
    <main className="mx-auto flex max-w-[1200px] flex-col gap-10 px-6 pb-16">
      <Hero movie={movies[0]} />
      <section className="space-y-6">
        <Filters movies={movies} filters={filters} onChange={setFilters} />
        <PosterGrid movies={filtered} isLoading={isLoading} onSelect={handleSelect} />
      </section>
      <MovieModal movie={activeMovie} onClose={handleClose} />
    </main>
  );
}