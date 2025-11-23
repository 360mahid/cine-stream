import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';

export default function MovieModal({ movie, onClose }) {
  if (!movie) return null;
  return (
    <Dialog open={!!movie} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl bg-[#050509] border-white/10 text-white p-0 overflow-hidden">
        <div className="relative h-64 bg-cover bg-center" style={{ backgroundImage: `url(${movie.poster_large})` }}>
          <div className="absolute inset-0 bg-linear-to-t from-[#050509] via-transparent to-[#050509]/80" />
          <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/50 text-white hover:bg-black/70">✕</button>
        </div>
        <div className="p-6 space-y-6">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">{movie.title}</h2>
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-[#f4c272] text-[#050509]">{movie.year}</Badge>
              <Badge variant="outline" className="border-[#f4c272] text-[#f4c272]">⭐ {movie.rating}</Badge>
              {(movie.genres || []).map(g => <Badge key={g} variant="secondary" className="bg-white/10 text-white">{g}</Badge>)}
            </div>
          </div>
          <p className="text-slate-300">{movie.description}</p>
          <div className="aspect-video bg-black rounded-lg overflow-hidden">
            <iframe src={movie.trailer_url} title={`${movie.title} Trailer`} className="w-full h-full" allowFullScreen />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}