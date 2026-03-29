import { useState, useMemo, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import type { Recipe, RecipeCategory } from '../types/common';

interface RecipesPageProps {
  recipes: Recipe[];
  learned: string[];
  onToggleLearned: (id: string) => void;
}

const CATEGORIES: { id: RecipeCategory; label: string; emoji: string }[] = [
  { id: 'all', label: 'All', emoji: '' },
  { id: 'tools', label: 'Tools', emoji: '' },
  { id: 'fruit', label: 'Fruit', emoji: '' },
  { id: 'bamboo', label: 'Bamboo', emoji: '' },
  { id: 'log', label: 'Log', emoji: '' },
  { id: 'shell', label: 'Shell', emoji: '' },
  { id: 'iron-gold', label: 'Iron & Gold', emoji: '' },
  { id: 'wreaths-crowns', label: 'Wreaths', emoji: '' },
  { id: 'walls-floors', label: 'Walls & Floors', emoji: '' },
  { id: 'fencing', label: 'Fencing', emoji: '' },
  { id: 'seasonal', label: 'Seasonal', emoji: '' },
  { id: 'other', label: 'Other', emoji: '' },
];

export function RecipesPage({ recipes, learned, onToggleLearned }: RecipesPageProps) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<RecipeCategory>('all');
  const [filterMode, setFilterMode] = useState<'all' | 'learned' | 'not-learned'>('all');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  const filtered = useMemo(() => {
    let result = recipes;

    if (query) {
      const q = query.toLowerCase();
      result = result.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.source.toLowerCase().includes(q) ||
          r.materials.some((m) => m.name.toLowerCase().includes(q))
      );
    }

    if (category !== 'all') {
      result = result.filter((r) => r.category === category);
    }

    if (filterMode === 'learned') {
      result = result.filter((r) => learned.includes(r.id));
    } else if (filterMode === 'not-learned') {
      result = result.filter((r) => !learned.includes(r.id));
    }

    // Sort learned first
    return [...result].sort((a, b) => {
      const aLearned = learned.includes(a.id) ? 0 : 1;
      const bLearned = learned.includes(b.id) ? 0 : 1;
      return aLearned - bLearned;
    });
  }, [recipes, query, category, filterMode, learned]);

  const BATCH_SIZE = 30;
  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);

  // Reset visible count when filters change
  const filterKey = `${query}-${category}-${filterMode}`;
  const [prevFilterKey, setPrevFilterKey] = useState(filterKey);
  if (filterKey !== prevFilterKey) {
    setPrevFilterKey(filterKey);
    setVisibleCount(BATCH_SIZE);
  }

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  const showMore = useCallback(() => {
    setVisibleCount((v) => Math.min(v + BATCH_SIZE, filtered.length));
  }, [filtered.length]);

  const learnedCount = learned.length;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-end gap-3">
        <div className="flex-1">
          <h2 className="text-2xl font-extrabold text-brown-dark font-heading">DIY Recipes</h2>
          <p className="text-sm text-brown-light mt-0.5">
            {filtered.length} of {recipes.length} shown
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm font-bold text-brown-dark">
          <span className="text-brown-light">Learned:</span>
          <span>{learnedCount}/{recipes.length}</span>
          <span className="text-brown-light">({recipes.length ? Math.round((learnedCount / recipes.length) * 100) : 0}%)</span>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brown-light/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search recipes, materials, sources..."
          className="w-full pl-10 pr-8 py-2.5 rounded-xl bg-white border border-sand-dark/30 text-brown-dark placeholder:text-brown-light/50 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-leaf/30 focus:border-leaf transition-all"
        />
        {query && (
          <button onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-brown-light hover:text-brown-dark cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Category chips */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setCategory(cat.id)}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer
              ${category === cat.id
                ? 'bg-brown text-white shadow-sm'
                : 'bg-white text-brown-light hover:bg-sand/50 border border-sand-dark/20'
              }`}
          >
            <span>{cat.emoji}</span>
            {cat.label}
          </button>
        ))}
      </div>

      {/* Filter chips */}
      <div className="flex gap-2">
        {(['all', 'learned', 'not-learned'] as const).map((mode) => (
          <button
            key={mode}
            onClick={() => setFilterMode(mode)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer
              ${filterMode === mode
                ? 'bg-leaf text-white shadow-sm'
                : 'bg-white text-brown-light hover:bg-sand/50 border border-sand-dark/20'
              }`}
          >
            {mode === 'all' ? 'All' : mode === 'learned' ? 'Learned' : 'Not Learned'}
          </button>
        ))}
      </div>

      {/* Recipe grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {visible.map((recipe) => {
          const isLearned = learned.includes(recipe.id);
          return (
            <div
              key={recipe.id}
              className={`bg-white rounded-[16px] shadow-card hover:shadow-card-hover transition-all overflow-hidden cursor-pointer
                ${isLearned ? 'ring-2 ring-leaf/30' : ''}`}
              onClick={() => setSelectedRecipe(recipe)}
            >
              <div className="p-4">
                <div className="flex items-start gap-3">
                  {recipe.imageUrl && (
                    <img
                      src={recipe.imageUrl}
                      alt={recipe.name}
                      className="w-14 h-14 object-contain shrink-0"
                      loading="lazy"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-bold text-brown-dark leading-tight">
                          {recipe.name}
                        </h3>
                        <p className="text-xs text-brown-light mt-0.5 truncate">
                          {recipe.source || 'Unknown source'}
                        </p>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); onToggleLearned(recipe.id); }}
                        className={`shrink-0 w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all cursor-pointer
                          ${isLearned ? 'border-leaf bg-leaf' : 'border-brown-light/30 hover:border-leaf/50'}`}
                        title={isLearned ? 'Mark as not learned' : 'Mark as learned'}
                      >
                        {isLearned && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
                      </button>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {recipe.materials.map((mat, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-sand/50 text-[11px] font-semibold text-brown"
                    >
                      {mat.name} x{mat.quantity}
                    </span>
                  ))}
                </div>
                {recipe.sellPrice > 0 && (
                  <p className="text-xs text-golden-dark font-semibold mt-2">
                    Sells for {recipe.sellPrice.toLocaleString()} Bells
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {hasMore && (
        <div className="text-center py-4">
          <button
            onClick={showMore}
            className="px-6 py-2.5 rounded-xl bg-brown text-white font-bold text-sm hover:bg-brown-dark transition-colors cursor-pointer"
          >
            Show More ({filtered.length - visibleCount} remaining)
          </button>
        </div>
      )}

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <p className="text-lg font-heading font-bold text-brown-light mb-3">~</p>
          <p className="text-brown-light font-semibold">No recipes match your filters</p>
        </div>
      )}

      {/* Recipe Detail Modal */}
      <AnimatePresence>
        {selectedRecipe && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brown-dark/40 backdrop-blur-sm"
            onClick={() => setSelectedRecipe(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-cream rounded-[24px] shadow-modal w-full max-w-md overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative bg-gradient-to-br from-golden/10 to-brown/10 p-6">
                <button
                  onClick={() => setSelectedRecipe(null)}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/70 flex items-center justify-center hover:bg-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4 text-brown" />
                </button>
                {selectedRecipe.imageUrl && (
                  <div className="flex justify-center mb-4">
                    <img src={selectedRecipe.imageUrl} alt={selectedRecipe.name} className="w-24 h-24 object-contain" />
                  </div>
                )}
                <h2 className="text-xl font-extrabold text-brown-dark font-heading text-center">
                  {selectedRecipe.name}
                </h2>
                <p className="text-sm text-brown-light mt-1 font-semibold text-center">
                  DIY Recipe
                </p>
              </div>
              <div className="p-5 space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-brown-dark mb-2">Materials Needed</h3>
                  <div className="space-y-1.5">
                    {selectedRecipe.materials.map((mat, i) => (
                      <div key={i} className="flex justify-between items-center bg-white/60 rounded-xl px-3 py-2 border border-sand-dark/10">
                        <span className="text-sm font-semibold text-brown">{mat.name}</span>
                        <span className="text-sm font-bold text-brown-dark">x{mat.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-brown-light font-semibold">How to Get</span>
                  <span className="font-bold text-brown-dark text-right max-w-[60%]">{selectedRecipe.source || 'Unknown'}</span>
                </div>

                {selectedRecipe.sellPrice > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-brown-light font-semibold">Sell Price</span>
                    <span className="font-bold text-brown-dark">{selectedRecipe.sellPrice.toLocaleString()} Bells</span>
                  </div>
                )}

                <div className="flex justify-between text-sm">
                  <span className="text-brown-light font-semibold">Category</span>
                  <span className="font-bold text-brown-dark capitalize">{selectedRecipe.category.replace('-', ' & ').replace('-', ' ')}</span>
                </div>

                <button
                  onClick={() => onToggleLearned(selectedRecipe.id)}
                  className={`w-full py-3 rounded-xl font-bold text-sm transition-all cursor-pointer
                    ${learned.includes(selectedRecipe.id)
                      ? 'bg-leaf/10 text-leaf border-2 border-leaf/30'
                      : 'bg-leaf text-white shadow-sm'
                    }`}
                >
                  {learned.includes(selectedRecipe.id) ? 'Learned!' : 'Mark as Learned'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
