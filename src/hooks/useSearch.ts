import { useState, useMemo } from 'react';
import type { Creature, Fossil, Art, Hemisphere } from '../types/common';
import { isAvailableNow, isLeavingThisMonth, isNewThisMonth } from '../utils/availability';

export type FilterMode = 'all' | 'available' | 'leaving' | 'new' | 'caught' | 'not-caught' | 'donated' | 'not-donated';

interface UseSearchOptions {
  hemisphere: Hemisphere;
  caught: string[];
  donated: string[];
}

function getName(item: Creature | Fossil | Art): string {
  return item.name['name-USen'];
}

function getId(item: Creature | Fossil | Art): string {
  return item['file-name'];
}

export function useCreatureSearch(creatures: Creature[], options: UseSearchOptions) {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<FilterMode>('all');

  const filtered = useMemo(() => {
    let result = creatures;

    if (query) {
      const q = query.toLowerCase();
      result = result.filter((c) => getName(c).toLowerCase().includes(q));
    }

    switch (filter) {
      case 'available':
        result = result.filter((c) => isAvailableNow(c, options.hemisphere));
        break;
      case 'leaving':
        result = result.filter((c) => isLeavingThisMonth(c, options.hemisphere));
        break;
      case 'new':
        result = result.filter((c) => isNewThisMonth(c, options.hemisphere));
        break;
      case 'caught':
        result = result.filter((c) => options.caught.includes(getId(c)));
        break;
      case 'not-caught':
        result = result.filter((c) => !options.caught.includes(getId(c)));
        break;
      case 'donated':
        result = result.filter((c) => options.donated.includes(getId(c)));
        break;
      case 'not-donated':
        result = result.filter((c) => !options.donated.includes(getId(c)));
        break;
    }

    // Sort caught items first
    result = [...result].sort((a, b) => {
      const aCaught = options.caught.includes(getId(a)) ? 0 : 1;
      const bCaught = options.caught.includes(getId(b)) ? 0 : 1;
      return aCaught - bCaught;
    });

    return result;
  }, [creatures, query, filter, options.hemisphere, options.caught, options.donated]);

  return { query, setQuery, filter, setFilter, filtered };
}

export function useItemSearch<T extends Fossil | Art>(items: T[], options: Omit<UseSearchOptions, 'hemisphere'>) {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<FilterMode>('all');

  const filtered = useMemo(() => {
    let result = items;

    if (query) {
      const q = query.toLowerCase();
      result = result.filter((item) => getName(item).toLowerCase().includes(q));
    }

    switch (filter) {
      case 'caught':
        result = result.filter((item) => options.caught.includes(getId(item)));
        break;
      case 'not-caught':
        result = result.filter((item) => !options.caught.includes(getId(item)));
        break;
      case 'donated':
        result = result.filter((item) => options.donated.includes(getId(item)));
        break;
      case 'not-donated':
        result = result.filter((item) => !options.donated.includes(getId(item)));
        break;
    }

    // Sort caught items first
    result = [...result].sort((a, b) => {
      const aCaught = options.caught.includes(getId(a)) ? 0 : 1;
      const bCaught = options.caught.includes(getId(b)) ? 0 : 1;
      return aCaught - bCaught;
    });

    return result;
  }, [items, query, filter, options.caught, options.donated]);

  return { query, setQuery, filter, setFilter, filtered };
}
