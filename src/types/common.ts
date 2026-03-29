export interface MultiName {
  'name-USen': string;
  'name-EUen': string;
  'name-EUde': string;
  'name-EUes': string;
  'name-USes': string;
  'name-EUfr': string;
  'name-USfr': string;
  'name-EUit': string;
  'name-EUnl': string;
  'name-CNzh': string;
  'name-TWzh': string;
  'name-JPja': string;
  'name-KRko': string;
  'name-EUru': string;
}

export interface Availability {
  'month-northern': string;
  'month-southern': string;
  'time': string;
  isAllDay: boolean;
  isAllYear: boolean;
  location?: string;
  rarity?: string;
  'month-array-northern': number[];
  'month-array-southern': number[];
  'time-array': number[];
}

export interface Creature {
  id: number;
  'file-name': string;
  name: MultiName;
  availability: Availability;
  shadow?: string;
  speed?: string;
  price: number;
  'price-cj'?: number;
  'price-flick'?: number;
  'catch-phrase': string;
  'museum-phrase': string;
  image_uri: string;
  icon_uri: string;
}

export interface Fossil {
  'file-name': string;
  name: MultiName;
  price: number;
  'museum-phrase': string;
  image_uri: string;
  'part-of': string;
}

export interface Art {
  id: number;
  'file-name': string;
  name: MultiName;
  hasFake: boolean;
  'buy-price': number | null;
  'sell-price': number | null;
  image_uri: string;
  'museum-desc': string;
}

export interface Recipe {
  id: string;
  name: string;
  category: string;
  materials: { name: string; quantity: number }[];
  source: string;
  sellPrice: number;
  imageUrl: string;
}

export type RecipeCategory = 'all' | 'tools' | 'walls-floors' | 'wreaths-crowns' | 'seasonal' | 'bamboo' | 'iron-gold' | 'log' | 'shell' | 'fruit' | 'fencing' | 'other';

export type Category = 'fish' | 'bugs' | 'sea' | 'fossils' | 'art';
export type Hemisphere = 'northern' | 'southern';

export interface CollectionState {
  version: number;
  hemisphere: Hemisphere;
  caught: Record<Category, string[]>;
  donated: Record<Category, string[]>;
}

export const CATEGORY_INFO: Record<Category, { label: string; emoji: string; color: string }> = {
  fish: { label: 'Fish', emoji: '', color: 'sky' },
  bugs: { label: 'Bugs', emoji: '', color: 'leaf' },
  sea: { label: 'Sea Creatures', emoji: '', color: 'teal' },
  fossils: { label: 'Fossils', emoji: '', color: 'brown' },
  art: { label: 'Art', emoji: '', color: 'coral' },
};

export const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
] as const;
