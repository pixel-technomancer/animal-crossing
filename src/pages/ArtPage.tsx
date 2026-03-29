import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Star, X, AlertTriangle } from 'lucide-react';
import type { Art } from '../types/common';
import { SearchBar } from '../components/common/SearchBar';
import { FilterChips } from '../components/common/FilterChips';
import { ProgressBar } from '../components/common/ProgressBar';
import { useItemSearch } from '../hooks/useSearch';
import { Badge } from '../components/common/Badge';

interface ArtPageProps {
  art: Art[];
  caught: string[];
  donated: string[];
  onToggleCaught: (id: string) => void;
  onToggleDonated: (id: string) => void;
}

export function ArtPage({ art, caught, donated, onToggleCaught, onToggleDonated }: ArtPageProps) {
  const { query, setQuery, filter, setFilter, filtered } = useItemSearch(art, { caught, donated });
  const [selectedArt, setSelectedArt] = useState<Art | null>(null);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-end gap-3">
        <div className="flex-1">
          <h2 className="text-2xl font-extrabold text-brown-dark font-heading">Art</h2>
          <p className="text-sm text-brown-light mt-0.5">
            {filtered.length} of {art.length} shown
          </p>
        </div>
        <div className="w-full sm:w-64">
          <ProgressBar caught={donated.length} total={art.length} label="Donated" color="coral" />
        </div>
      </div>

      <div className="space-y-2">
        <SearchBar query={query} onQueryChange={setQuery} placeholder="Search art..." />
        <FilterChips active={filter} onChange={setFilter} />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        <AnimatePresence mode="popLayout">
          {filtered.map((piece) => {
            const id = piece['file-name'];
            const pc = caught.includes(id);
            const pd = donated.includes(id);
            return (
              <motion.div
                key={id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`bg-white rounded-[16px] shadow-card hover:shadow-card-hover transition-all overflow-hidden
                  ${pd ? 'ring-2 ring-teal/30' : ''}`}
              >
                <div className="p-3 cursor-pointer" onClick={() => setSelectedArt(piece)}>
                  <div className="flex gap-1 mb-2 min-h-[20px]">
                    {piece.hasFake && <Badge variant="fake">Has Fake</Badge>}
                    {pd && <Badge variant="donated">Donated</Badge>}
                  </div>
                  <div className="flex justify-center py-2">
                    <img
                      src={piece.image_uri}
                      alt={piece.name['name-USen']}
                      className="w-20 h-20 object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                        (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                    <span className="hidden text-sm font-heading text-brown-light">No image</span>
                  </div>
                  <h3 className="text-sm font-bold text-brown-dark text-center leading-tight">
                    {piece.name['name-USen']}
                  </h3>
                  {piece['buy-price'] && (
                    <p className="text-xs text-golden-dark font-semibold text-center mt-0.5">
                      {piece['buy-price'].toLocaleString()}  Bells
                    </p>
                  )}
                </div>
                <div className="flex border-t border-sand/50">
                  <button
                    onClick={() => onToggleCaught(id)}
                    className={`flex-1 flex items-center justify-center gap-1 py-2 text-xs font-bold transition-all cursor-pointer
                      ${pc ? 'bg-golden/10 text-golden-dark' : 'text-brown-light hover:bg-sand/30'}`}
                  >
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all
                      ${pc ? 'border-golden-dark bg-golden' : 'border-brown-light/30'}`}>
                      {pc && <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />}
                    </div>
                    Bought
                  </button>
                  <div className="w-px bg-sand/50" />
                  <button
                    onClick={() => onToggleDonated(id)}
                    className={`flex-1 flex items-center justify-center gap-1 py-2 text-xs font-bold transition-all cursor-pointer
                      ${pd ? 'bg-teal/10 text-teal' : 'text-brown-light hover:bg-sand/30'}`}
                  >
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all
                      ${pd ? 'border-teal bg-teal' : 'border-brown-light/30'}`}>
                      {pd && <Star className="w-2.5 h-2.5 text-white" strokeWidth={3} />}
                    </div>
                    Museum
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <p className="text-lg font-heading font-bold text-brown-light mb-3">~</p>
          <p className="text-brown-light font-semibold">No art matches your filters</p>
        </div>
      )}

      {/* Art Detail Modal */}
      <AnimatePresence>
        {selectedArt && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brown-dark/40 backdrop-blur-sm"
            onClick={() => setSelectedArt(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-cream rounded-[24px] shadow-modal w-full max-w-md overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative bg-gradient-to-br from-coral/10 to-golden/10 p-6">
                <button
                  onClick={() => setSelectedArt(null)}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/70 flex items-center justify-center hover:bg-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4 text-brown" />
                </button>
                <div className="flex justify-center mb-4">
                  <img src={selectedArt.image_uri} alt={selectedArt.name['name-USen']} className="w-32 h-32 object-contain" />
                </div>
                <h2 className="text-xl font-extrabold text-brown-dark font-heading text-center">
                  {selectedArt.name['name-USen']}
                </h2>
                {selectedArt.hasFake && (
                  <div className="flex items-center justify-center gap-1 mt-2 text-coral-dark text-sm font-bold">
                    <AlertTriangle className="w-4 h-4" />
                    Redd may sell a fake version
                  </div>
                )}
              </div>
              <div className="p-5 space-y-3">
                {selectedArt['buy-price'] && (
                  <div className="flex justify-between text-sm">
                    <span className="text-brown-light font-semibold">Buy Price</span>
                    <span className="font-bold text-brown-dark">{selectedArt['buy-price'].toLocaleString()} Bells</span>
                  </div>
                )}
                {selectedArt['sell-price'] && (
                  <div className="flex justify-between text-sm">
                    <span className="text-brown-light font-semibold">Sell Price</span>
                    <span className="font-bold text-brown-dark">{selectedArt['sell-price'].toLocaleString()} Bells</span>
                  </div>
                )}
                <div className="bg-white/60 rounded-xl p-4 border border-sand-dark/20 mt-3">
                  <h3 className="text-sm font-bold text-teal mb-2">Museum Description</h3>
                  <p className="text-xs text-brown leading-relaxed">{selectedArt['museum-desc']}</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
