import { useState, useCallback, useEffect } from 'react';
import type { CollectionState, Category, Hemisphere } from '../types/common';
import {
  loadCollection,
  saveCollection,
  toggleCaught as toggleCaughtUtil,
  toggleDonated as toggleDonatedUtil,
  setHemisphere as setHemisphereUtil,
} from '../utils/storage';

export function useCollection() {
  const [state, setState] = useState<CollectionState>(loadCollection);

  useEffect(() => {
    saveCollection(state);
  }, [state]);

  const toggleCaught = useCallback((category: Category, id: string) => {
    setState((prev) => toggleCaughtUtil(prev, category, id));
  }, []);

  const toggleDonated = useCallback((category: Category, id: string) => {
    setState((prev) => toggleDonatedUtil(prev, category, id));
  }, []);

  const setHemisphere = useCallback((hemisphere: Hemisphere) => {
    setState((prev) => setHemisphereUtil(prev, hemisphere));
  }, []);

  const isCaught = useCallback(
    (category: Category, id: string) => state.caught[category].includes(id),
    [state.caught]
  );

  const isDonated = useCallback(
    (category: Category, id: string) => state.donated[category].includes(id),
    [state.donated]
  );

  const getCounts = useCallback(
    (category: Category, total: number) => ({
      caught: state.caught[category].length,
      donated: state.donated[category].length,
      total,
    }),
    [state.caught, state.donated]
  );

  return {
    state,
    setState,
    toggleCaught,
    toggleDonated,
    setHemisphere,
    isCaught,
    isDonated,
    getCounts,
    hemisphere: state.hemisphere,
  };
}
