import type { Category } from './product';

export interface ProductTranslationRow {
  language: string;
  zoom: string | null;
  cell: string[];
  description: { title: string; text: string[] }[];
}

export interface ProductRow {
  item_id: string;
  id: number;
  namespace_id: string;
  category: Category;
  name: string;
  year: number;
  price: number;
  full_price: number;
  capacity: string;
  color: string;
  ram: string | null;
  screen: string | null;
  resolution: string | null;
  processor: string | null;
  camera: string | null;
  image: string;
  images: string[];
  capacity_available: string[];
  colors_available: string[];
}

export interface ProductWithTranslationsRow extends ProductRow {
  product_translations: ProductTranslationRow[];
}
