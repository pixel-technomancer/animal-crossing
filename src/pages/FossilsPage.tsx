import { useMemo } from 'react';
import { Check, Star } from 'lucide-react';
import type { Fossil } from '../types/common';
import { SearchBar } from '../components/common/SearchBar';
import { FilterChips } from '../components/common/FilterChips';
import { ProgressBar } from '../components/common/ProgressBar';
import { useItemSearch } from '../hooks/useSearch';
import { Badge } from '../components/common/Badge';

interface FossilsPageProps {
  fossils: Fossil[];
  caught: string[];
  donated: string[];
  onToggleCaught: (id: string) => void;
  onToggleDonated: (id: string) => void;
}

export function FossilsPage({ fossils, caught, donated, onToggleCaught, onToggleDonated }: FossilsPageProps) {
  const { query, setQuery, filter, setFilter, filtered } = useItemSearch(fossils, { caught, donated });

  // Group by set
  const grouped = useMemo(() => {
    const groups: Record<string, Fossil[]> = {};
    filtered.forEach((f) => {
      const key = f['part-of'] || f['file-name'];
      if (!groups[key]) groups[key] = [];
      groups[key].push(f);
    });
    return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b));
  }, [filtered]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-end gap-3">
        <div className="flex-1">
          <h2 className="text-2xl font-extrabold text-brown-dark font-heading">Fossils</h2>
          <p className="text-sm text-brown-light mt-0.5">
            {filtered.length} of {fossils.length} shown
          </p>
        </div>
        <div className="w-full sm:w-64">
          <ProgressBar caught={caught.length} total={fossils.length} label="Assessed" color="brown" />
        </div>
      </div>

      <div className="space-y-2">
        <SearchBar query={query} onQueryChange={setQuery} placeholder="Search fossils..." />
        <FilterChips active={filter} onChange={setFilter} />
      </div>

      <div className="space-y-4">
        {grouped.map(([group, items]) => (
          <div
            key={group}
            className="bg-white rounded-[16px] shadow-card p-4"
          >
              {items.length > 1 && (
                <h3 className="text-sm font-bold text-brown-dark mb-3 flex items-center gap-2">
                  {group}
                  <span className="text-[10px] font-bold text-brown-light bg-sand px-2 py-0.5 rounded-full">
                    {items.filter((f) => donated.includes(f['file-name'])).length}/{items.length}
                  </span>
                </h3>
              )}
              <div className={`grid gap-2 ${items.length > 1 ? 'grid-cols-1 sm:grid-cols-2' : ''}`}>
                {items.map((fossil) => {
                  const id = fossil['file-name'];
                  const fc = caught.includes(id);
                  const fd = donated.includes(id);
                  return (
                    <div
                      key={id}
                      className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                        fd ? 'bg-teal/5 border-teal/20' : 'bg-cream/50 border-sand-dark/15'
                      }`}
                    >
                      <img
                        src={fossil.image_uri}
                        alt={fossil.name['name-USen']}
                        className="w-12 h-12 object-contain"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-brown-dark truncate">
                          {fossil.name['name-USen']}
                        </p>
                        <p className="text-xs text-golden-dark font-semibold">
                          {fossil.price.toLocaleString()} Bells
                        </p>
                      </div>
                      <div className="flex gap-1.5">
                        {fd && <Badge variant="donated">Donated</Badge>}
                        <button
                          onClick={() => onToggleCaught(id)}
                          className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all cursor-pointer
                            ${fc ? 'border-golden-dark bg-golden' : 'border-brown-light/30 hover:border-golden'}`}
                          title={fc ? 'Unmark obtained' : 'Mark obtained'}
                        >
                          {fc && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
                        </button>
                        <button
                          onClick={() => onToggleDonated(id)}
                          className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all cursor-pointer
                            ${fd ? 'border-teal bg-teal' : 'border-brown-light/30 hover:border-teal'}`}
                          title={fd ? 'Unmark donated' : 'Mark donated'}
                        >
                          {fd && <Star className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <p className="text-lg font-heading font-bold text-brown-light mb-3">~</p>
          <p className="text-brown-light font-semibold">No fossils match your filters</p>
        </div>
      )}
    </div>
  );
}
