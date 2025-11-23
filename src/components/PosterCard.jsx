import { useState, useEffect, useRef } from 'react';

export default function PosterCard({ movie, onSelect }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const imgRef = useRef();

  useEffect(() => {
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      const img = new Image();
      img.src = movie.poster_small;
      img.onload = () => setIsLoaded(true);
      io.disconnect();
    }, { threshold: 0.1 });
    if (imgRef.current) io.observe(imgRef.current);
    return () => io.disconnect();
  }, [movie.poster_small]);

  return (
    <div
      role="button"
      tabIndex={0}
      className="relative group cursor-pointer rounded-2xl overflow-hidden shadow-[0_10px_30px_-12px_rgba(0,0,0,0.5)] transition-all duration-300 hover:scale-105 hover:-translate-y-2 focus-visible:ring-2 focus-visible:ring-[#f4c272]"
      onClick={() => onSelect(movie)}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onSelect(movie)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div ref={imgRef} className="aspect-2/3 bg-[#1a1a2e]">
        {isLoaded ? (
          <img
            src={movie.poster_small}
            alt={movie.title}
            className="w-full h-full object-cover"
            srcSet={`${movie.poster_small} 320w, ${movie.poster_large} 768w, ${movie.poster_large} 1024w`}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          />
        ) : (<div className="w-full h-full bg-[#1a1a2e] animate-pulse" />)}
      </div>
      <div className={`absolute bottom-0 left-0 right-0 p-4 text-white transition-all duration-300 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
        <h3 className="font-bold text-lg mb-1 line-clamp-2">{movie.title}</h3>
        <div className="flex items-center gap-2 text-sm text-slate-300">
          <span>{movie.year}</span><span>•</span><span className="text-[#f4c272]">⭐ {movie.rating}</span>
        </div>
        <div className="flex flex-wrap gap-1 mt-2">
          {(movie.genres || []).slice(0, 2).map((g) => <span key={g} className="text-xs bg-white/20 px-2 py-1 rounded-full">{g}</span>)}
        </div>
      </div>
    </div>
  );
}