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
    const parsed = JSON.parse(raw);
    if (parsed.version !== CURRENT_VERSION || !isValidCollection(parsed)) return getDefaultState();
    return parsed as CollectionState;
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
  // Use TextEncoder to handle Unicode safely
  const bytes = new TextEncoder().encode(JSON.stringify(data));
  let binary = '';
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary);
}

const CATEGORIES: Category[] = ['fish', 'bugs', 'sea', 'fossils', 'art'];

function isValidCollection(col: CollectionState): boolean {
  if (typeof col.hemisphere !== 'string') return false;
  for (const cat of CATEGORIES) {
    if (!Array.isArray(col.caught?.[cat])) return false;
    if (!Array.isArray(col.donated?.[cat])) return false;
    if (!col.caught[cat].every((id: unknown) => typeof id === 'string')) return false;
    if (!col.donated[cat].every((id: unknown) => typeof id === 'string')) return false;
  }
  return true;
}

export function importAllData(code: string): SyncData | null {
  try {
    const binary = atob(code.trim());
    // Use TextDecoder to handle Unicode safely
    const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
    const json = new TextDecoder().decode(bytes);
    const data = JSON.parse(json) as SyncData;
    if (!data.collection || !isValidCollection(data.collection)) return null;
    if (data.recipes && !Array.isArray(data.recipes)) return null;
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
