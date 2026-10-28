import { ROUTES } from './routes';

import type { Category } from '@/types';

export interface CategoryInfo {
  id: Category;
  path: string;
  image: string;
  srcSet: string;
  sizes: string;
  width: number;
  height: number;
}

const IMAGE_SIZES = '(min-width: 1200px) 380px, (min-width: 640px) 33vw, 90vw';

export const CATEGORIES: CategoryInfo[] = [
  {
    id: 'phones',
    path: ROUTES.PHONES,
    image: 'img/category/category-phones.webp',
    srcSet:
      'img/category/category-phones-400.webp 400w, img/category/category-phones.webp 752w',
    sizes: IMAGE_SIZES,
    width: 752,
    height: 912,
  },
  {
    id: 'tablets',
    path: ROUTES.TABLETS,
    image: 'img/category/category-tablets.webp',
    srcSet:
      'img/category/category-tablets-400.webp 400w, img/category/category-tablets.webp 661w',
    sizes: IMAGE_SIZES,
    width: 661,
    height: 602,
  },
  {
    id: 'accessories',
    path: ROUTES.ACCESSORIES,
    image: 'img/category/category-accessories.webp',
    srcSet:
      'img/category/category-accessories-400.webp 400w, img/category/category-accessories.webp 800w',
    sizes: IMAGE_SIZES,
    width: 800,
    height: 800,
  },
];
