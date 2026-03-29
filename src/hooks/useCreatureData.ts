import { useMemo } from 'react';
import type { Creature, Fossil, Art, Recipe } from '../types/common';

import fishData from '../data/fish.json';
import bugsData from '../data/bugs.json';
import seaData from '../data/sea.json';
import fossilsData from '../data/fossils.json';
import artData from '../data/art.json';
import recipesData from '../data/recipes.json';

function objectToArray<T>(obj: Record<string, T>): T[] {
  return Object.values(obj);
}

const GITHUB_BASE = 'https://raw.githubusercontent.com/alexislours/ACNHAPI/master';

function fixCreatureUrls(creatures: Creature[], category: 'fish' | 'bugs' | 'sea'): Creature[] {
  return creatures.map((c) => ({
    ...c,
    icon_uri: `${GITHUB_BASE}/icons/${category}/${c['file-name']}.png`,
    image_uri: `${GITHUB_BASE}/images/${category}/${c['file-name']}.png`,
  }));
}

function fixArtUrls(art: Art[]): Art[] {
  return art.map((a) => ({
    ...a,
    image_uri: `${GITHUB_BASE}/images/art/${a['file-name']}.png`,
  }));
}

export function useCreatureData() {
  const data = useMemo(() => ({
    fish: fixCreatureUrls(objectToArray(fishData as Record<string, Creature>), 'fish'),
    bugs: fixCreatureUrls(objectToArray(bugsData as Record<string, Creature>), 'bugs'),
    sea: fixCreatureUrls(objectToArray(seaData as Record<string, Creature>), 'sea'),
    fossils: objectToArray(fossilsData as Record<string, Fossil>),
    art: fixArtUrls(objectToArray(artData as Record<string, Art>)),
    recipes: recipesData as Recipe[],
    loading: false,
  }), []);

  return data;
}
