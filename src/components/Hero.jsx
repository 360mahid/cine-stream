import { Badge } from '@/components/ui/badge';
const fallback = {
  title: 'Cinematic Spotlight',
  year: 2024,
  rating: 8.5,
  genres: ['Featured'],
  poster_large: 'https://picsum.photos/seed/hero/1920/1080'
};

export default function Hero({ movie = fallback }) {
  const m = movie || fallback;
  return (
    <section className="relative h-[70vh] min-h-[500px] overflow-hidden rounded-3xl">
      <div
        className="absolute inset-0 bg-cover bg-center scale-110 blur-xl"
        style={{ backgroundImage: `url(${m.poster_large})` }}
      />
      <div className="absolute inset-0 bg-linear-to-r from-[#050509]/95 via-[#050509]/80 to-transparent" />
      <div className="relative z-10 flex h-full items-center px-12">
        <div className="max-w-2xl">
          <div className="flex items-center gap-3 mb-4">
            <Badge className="bg-[#f4c272] text-[#050509]">{m.year}</Badge>
            <Badge variant="outline" className="border-[#f4c272] text-[#f4c272]">⭐ {m.rating}</Badge>
            {(m.genres || []).map((g) => (
              <Badge key={g} variant="secondary" className="bg-white/10 text-white">{g}</Badge>
            ))}
          </div>
          <h1 className="text-6xl font-bold text-white mb-4 leading-tight">{m.title}</h1>
          <p className="text-xl text-slate-300 mb-8">{m.tagline || 'Experience cinema like never before'}</p>
          <div className="flex gap-4">
            <a href="#" className="inline-flex bg-[#f4c272] text-[#050509] px-8 py-3 text-lg font-medium rounded-lg hover:bg-[#f4c272]/90">▶ Play Now</a>
            <a href="#" className="inline-flex border border-white/20 text-white px-8 py-3 text-lg font-medium rounded-lg hover:bg-white/10">+ Add to List</a>
          </div>
        </div>
      </div>
    </section>
  );
}