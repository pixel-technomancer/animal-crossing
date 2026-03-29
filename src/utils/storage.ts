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

export interface SyncData {
  collection: CollectionState;
  recipes: string[];
  turnips: unknown;
}

export function exportAllData(): string {
  const data: SyncData = {
    collection: loadCollection(),
    recipes: loadLearnedRecipes(),
    turnips: loadTurnipData(),
  };
  return btoa(JSON.stringify(data));
}

export function importAllData(code: string): SyncData | null {
  try {
    const json = atob(code.trim());
    const data = JSON.parse(json) as SyncData;
    if (!data.collection?.caught || !data.collection?.donated) return null;
    // Apply everything
    saveCollection({ ...data.collection, version: CURRENT_VERSION });
    saveLearnedRecipes(data.recipes || []);
    saveTurnipData(data.turnips);
    return data;
  } catch {
    return null;
  }
}

export function loadTurnipData(): unknown {
  try {
    const raw = localStorage.getItem(TURNIPS_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveTurnipData(data: unknown): void {
  if (data) {
    localStorage.setItem(TURNIPS_KEY, JSON.stringify(data));
  }
}

const RECIPES_KEY = 'acnh-guide-recipes';
const TURNIPS_KEY = 'acnh-turnip-data';

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
