import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

export default function Filters({ movies, filters, onChange }) {
  const allGenres = ['All', ...new Set(movies.flatMap((m) => m.genres || []))];
  const allYears = ['All', ...new Set(movies.map((m) => m.year).filter(Boolean))].slice(0, 8);
  const allLanguages = ['All', ...new Set(movies.map((m) => m.language).filter(Boolean))];
  const allCategories = ['All', ...new Set(movies.map((m) => m.category).filter(Boolean))];

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-slate-400">Genre</h3>
        <Tabs value={filters.genre} onValueChange={(v) => onChange({ ...filters, genre: v })}>
          <TabsList className="flex flex-wrap gap-2 bg-transparent p-0">
            {allGenres.map((g) => (
              <TabsTrigger
                key={g}
                value={g}
                className="px-4 py-2 rounded-full border border-white/20 data-[state=active]:bg-[#f4c272] data-[state=active]:text-[#050509] data-[state=active]:border-[#f4c272] text-white hover:bg-white/10"
              >
                {g}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      <div className="flex flex-wrap items-center gap-6">
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-slate-400">Year</h3>
          <div className="flex gap-2">
            {allYears.map((y) => (
              <button key={y}
                onClick={() => onChange({ ...filters, year: y })}
                className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                  filters.year === y ? 'bg-[#f4c272] text-[#050509] border-[#f4c272]' : 'border-white/20 text-white hover:bg-white/10'
                }`}
              >{y}</button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-medium text-slate-400">Language</h3>
          <div className="flex gap-2">
            {allLanguages.map((l) => (
              <button key={l}
                onClick={() => onChange({ ...filters, language: l })}
                className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                  filters.language === l ? 'bg-[#f4c272] text-[#050509] border-[#f4c272]' : 'border-white/20 text-white hover:bg-white/10'
                }`}
              >{l}</button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-medium text-slate-400">Category</h3>
          <div className="flex gap-2">
            {allCategories.map((c) => (
              <Badge key={c}
                onClick={() => onChange({ ...filters, category: c })}
                variant={filters.category === c ? 'default' : 'outline'}
                className={`${filters.category === c ? 'bg-[#f4c272] text-[#050509] border-[#f4c272]' : 'border-white/20 text-white hover:bg-white/10'} cursor-pointer px-3 py-1`}
              >
                {c}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}