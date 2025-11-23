import PosterCard from './PosterCard.jsx';

export default function PosterGrid({ movies, isLoading, onSelect }) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="aspect-2/3 bg-[#1a1a2e] rounded-2xl animate-pulse" />
        ))}
      </div>
    );
  }
  if (!movies?.length) {
    return <div className="text-center py-12 text-slate-400">No movies found.</div>;
  }
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
      {movies.map((m) => <PosterCard key={m.id} movie={m} onSelect={onSelect} />)}
    </div>
  );
}