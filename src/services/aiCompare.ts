import { getProductDetails, searchProducts } from './products';

import type { Category, Language, Product, ProductDetails } from '@/types';

const MAX_PRODUCTS = 3;
const SEARCH_LIMIT = 200;

export interface AiCompareProduct {
  itemId: string;
  category: Category;
  name: string;
  image: string;
  price: number;
  fullPrice: number;
  screen: string;
  resolution: string;
  processor: string;
  ram: string;
  capacity: string;
  camera: string;
}

export interface AiComparison {
  products: AiCompareProduct[];
  missing: string[];
  mismatched: string[];
}

const getModelSlug = ({ itemId, capacity }: Product) => {
  const index = itemId.indexOf(`-${capacity.toLowerCase()}-`);

  return index > 0 ? itemId.slice(0, index) : itemId;
};

const pickBestMatch = (matches: Product[]) =>
  matches.reduce<Product | null>((best, product) => {
    if (!best) {
      return product;
    }

    const bestWords = getModelSlug(best).split('-').length;
    const words = getModelSlug(product).split('-').length;

    return words < bestWords ? product : best;
  }, null);

const toCompareProduct = (
  product: Product,
  details?: ProductDetails,
): AiCompareProduct => ({
  itemId: product.itemId,
  category: product.category,
  name: product.name,
  image: product.image,
  price: product.price,
  fullPrice: product.fullPrice,
  screen: product.screen,
  resolution: details?.resolution ?? '',
  processor: details?.processor ?? '',
  ram: product.ram,
  capacity: product.capacity,
  camera: details?.camera ?? '',
});

export const findProductsForCompare = async (
  queries: string[],
  language: Language,
): Promise<AiComparison> => {
  const unique = [
    ...new Set(queries.map((query) => query.trim()).filter(Boolean)),
  ].slice(0, MAX_PRODUCTS);

  const found = await Promise.all(
    unique.map(async (query) => {
      const { items } = await searchProducts(query, {
        page: 1,
        perPage: SEARCH_LIMIT,
        sort: 'price',
      });

      return { query, product: pickBestMatch(items) };
    }),
  );

  const products: Product[] = [];
  const missing: string[] = [];
  const mismatched: string[] = [];

  found.forEach(({ query, product }) => {
    if (!product) {
      missing.push(query);

      return;
    }

    if (products.some((item) => item.itemId === product.itemId)) {
      return;
    }

    if (products.length > 0 && products[0].category !== product.category) {
      mismatched.push(query);

      return;
    }

    products.push(product);
  });

  const details = await Promise.all(
    products.map((product) => getProductDetails(product.itemId, language)),
  );

  return {
    products: products.map((product, index) =>
      toCompareProduct(product, details[index]?.details),
    ),
    missing,
    mismatched,
  };
};
