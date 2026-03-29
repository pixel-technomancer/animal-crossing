import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import type { Creature, Hemisphere } from '../types/common';
import { CreatureCard } from '../components/creatures/CreatureCard';
import { CreatureDetail } from '../components/creatures/CreatureDetail';
import { SearchBar } from '../components/common/SearchBar';
import { FilterChips } from '../components/common/FilterChips';
import { ProgressBar } from '../components/common/ProgressBar';
import { useCreatureSearch } from '../hooks/useSearch';

interface CreaturePageProps {
  creatures: Creature[];
  hemisphere: Hemisphere;
  caught: string[];
  donated: string[];
  onToggleCaught: (id: string) => void;
  onToggleDonated: (id: string) => void;
  title: string;
  color: string;
  fallbackEmoji?: string;
}

export function CreaturePage({
  creatures,
  hemisphere,
  caught,
  donated,
  onToggleCaught,
  onToggleDonated,
  title,
  color,
  fallbackEmoji = '🐟',
}: CreaturePageProps) {
  const [selectedCreature, setSelectedCreature] = useState<Creature | null>(null);
  const { query, setQuery, filter, setFilter, filtered } = useCreatureSearch(creatures, {
    hemisphere,
    caught,
    donated,
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-end gap-3">
        <div className="flex-1">
          <h2 className="text-2xl font-extrabold text-brown-dark font-heading">{title}</h2>
          <p className="text-sm text-brown-light mt-0.5">
            {filtered.length} of {creatures.length} shown
          </p>
        </div>
        <div className="w-full sm:w-64">
          <ProgressBar caught={caught.length} total={creatures.length} label="Obtained" color={color} />
        </div>
      </div>

      <div className="space-y-2">
        <SearchBar query={query} onQueryChange={setQuery} placeholder={`Search ${title.toLowerCase()}...`} />
        <FilterChips active={filter} onChange={setFilter} showAvailability />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        <AnimatePresence mode="popLayout">
          {filtered.map((creature) => (
            <CreatureCard
              key={creature.id}
              creature={creature}
              hemisphere={hemisphere}
              isCaught={caught.includes(creature['file-name'])}
              isDonated={donated.includes(creature['file-name'])}
              onToggleCaught={() => onToggleCaught(creature['file-name'])}
              onToggleDonated={() => onToggleDonated(creature['file-name'])}
              onClick={() => setSelectedCreature(creature)}
              fallbackEmoji={fallbackEmoji}
            />
          ))}
        </AnimatePresence>
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <p className="text-lg font-heading font-bold text-brown-light mb-3">~</p>
          <p className="text-brown-light font-semibold">No {title.toLowerCase()} match your filters</p>
          <p className="text-sm text-brown-light/70 mt-1">Try changing your search or filter</p>
        </div>
      )}

      <CreatureDetail
        creature={selectedCreature}
        hemisphere={hemisphere}
        onClose={() => setSelectedCreature(null)}
      />
    </div>
  );
}
