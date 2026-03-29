import type { CollectionState, Category, Hemisphere } from '../types/common';

const STORAGE_KEY = 'acnh-guide-collection';
const CURRENT_VERSION = 1;

function getDefaultState(): CollectionState {
  return {
    version: CURRENT_VERSION,
    hemisphere: 'northern',
    caught: { fish: [], bugs: [], sea: [], fossils: [], art: [] },
    donated: { fish: [], bugs: [], sea: [], fossils: [], art: [] },
  };
}

export function loadCollection(): CollectionState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultState();
    const parsed = JSON.parse(raw) as CollectionState;
    if (parsed.version !== CURRENT_VERSION) return getDefaultState();
    return parsed;
  } catch {
    return getDefaultState();
  }
}

export function saveCollection(state: CollectionState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function toggleCaught(state: CollectionState, category: Category, id: string): CollectionState {
  const caught = state.caught[category].includes(id)
    ? state.caught[category].filter((x) => x !== id)
    : [...state.caught[category], id];
  // If uncatching, also remove from donated
  const donated = !caught.includes(id)
    ? state.donated[category].filter((x) => x !== id)
    : state.donated[category];
  return {
    ...state,
    caught: { ...state.caught, [category]: caught },
    donated: { ...state.donated, [category]: donated },
  };
}

export function toggleDonated(state: CollectionState, category: Category, id: string): CollectionState {
  const isDonated = state.donated[category].includes(id);
  const donated = isDonated
    ? state.donated[category].filter((x) => x !== id)
    : [...state.donated[category], id];
  // If donating, also mark as caught
  const caught = !isDonated && !state.caught[category].includes(id)
    ? [...state.caught[category], id]
    : state.caught[category];
  return {
    ...state,
    caught: { ...state.caught, [category]: caught },
    donated: { ...state.donated, [category]: donated },
  };
}

export function setHemisphere(state: CollectionState, hemisphere: Hemisphere): CollectionState {
  return { ...state, hemisphere };
}

export function exportCollection(state: CollectionState): string {
  return JSON.stringify(state, null, 2);
}

export function importCollection(json: string): CollectionState | null {
  try {
    const parsed = JSON.parse(json) as CollectionState;
    if (parsed.version && parsed.caught && parsed.donated) return parsed;
    return null;
  } catch {
    return null;
  }
}

const RECIPES_KEY = 'acnh-guide-recipes';

export function loadLearnedRecipes(): string[] {
  try {
    const raw = localStorage.getItem(RECIPES_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as string[];
  } catch {
    return [];
  }
}

export function saveLearnedRecipes(learned: string[]): void {
  localStorage.setItem(RECIPES_KEY, JSON.stringify(learned));
}

export function toggleLearnedRecipe(learned: string[], id: string): string[] {
  return learned.includes(id)
    ? learned.filter((x) => x !== id)
    : [...learned, id];
}
