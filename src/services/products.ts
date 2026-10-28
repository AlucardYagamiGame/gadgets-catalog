import { client } from './fetchClient';
import { isSupabaseConfigured, supabase } from './supabase';

import type {
  Category,
  Language,
  Product,
  ProductDetails,
  SortBy,
  ProductRow,
  ProductWithTranslationsRow,
} from '@/types';

const SLIDER_SIZE = 10;

export interface ProductWithDetails {
  category: Category;
  product: Product;
  details: ProductDetails;
}

interface SearchProductsOptions {
  page: number;
  perPage: number;
  sort: SortBy;
}

export const PRODUCT_COLUMNS =
  'id,item_id,category,name,full_price,price,screen,capacity,color,ram,year,image';

export const toProduct = (row: ProductRow): Product => ({
  id: row.id,
  category: row.category,
  itemId: row.item_id,
  name: row.name,
  fullPrice: row.full_price,
  price: row.price,
  screen: row.screen ?? '',
  capacity: row.capacity,
  color: row.color,
  ram: row.ram ?? '',
  year: row.year,
  image: row.image,
});

const toProductWithDetails = (
  row: ProductWithTranslationsRow,
): ProductWithDetails => {
  const translation = row.product_translations[0];

  return {
    category: row.category,
    product: toProduct(row),
    details: {
      id: row.item_id,
      namespaceId: row.namespace_id,
      name: row.name,
      capacityAvailable: row.capacity_available,
      capacity: row.capacity,
      priceRegular: row.full_price,
      priceDiscount: row.price,
      colorsAvailable: row.colors_available,
      color: row.color,
      images: row.images,
      description: translation?.description ?? [],
      screen: row.screen ?? '',
      resolution: row.resolution ?? '',
      processor: row.processor ?? '',
      ram: row.ram ?? '',
      camera: row.camera ?? undefined,
      zoom: translation?.zoom ?? undefined,
      cell: translation?.cell ?? [],
    },
  };
};

const withFallback = async <T>(
  primary: () => Promise<T>,
  fallback: () => Promise<T>,
): Promise<T> => {
  if (!isSupabaseConfigured) {
    return fallback();
  }

  try {
    return await primary();
  } catch {
    return fallback();
  }
};

const matchesSearchWords = (name: string, words: string[]) => {
  const normalizedName = name.toLowerCase();

  return words.every((word) => normalizedName.includes(word));
};

let productsRequest: Promise<Product[]> | null = null;
const detailsRequests = new Map<string, Promise<ProductDetails[]>>();

export const getProducts = (): Promise<Product[]> => {
  if (!productsRequest) {
    productsRequest = withFallback(
      async () => {
        const rows = await supabase.select<ProductRow[]>(
          'products',
          `select=${PRODUCT_COLUMNS}&order=id`,
        );

        return rows.map(toProduct);
      },
      () => client.get<Product[]>('/products.json'),
    ).catch((error) => {
      productsRequest = null;
      throw error;
    });
  }

  return productsRequest;
};

export const searchProducts = async (
  query: string,
  { page, perPage, sort }: SearchProductsOptions,
): Promise<{ items: Product[]; total: number }> => {
  const words = query.trim().toLowerCase().split(/\s+/).filter(Boolean);

  if (words.length === 0) {
    return { items: [], total: 0 };
  }

  const products = await getProducts();
  const matches = products
    .filter(({ name }) => matchesSearchWords(name, words))
    .sort((a, b) => {
      switch (sort) {
        case 'age':
          return b.year - a.year;
        case 'title':
          return a.name.localeCompare(b.name);
        case 'price':
          return a.price - b.price;
        default:
          return 0;
      }
    });
  const startIndex = (page - 1) * perPage;

  return {
    items: matches.slice(startIndex, startIndex + perPage),
    total: matches.length,
  };
};

export const getSearchSuggestions = async (
  query: string,
): Promise<string[]> => {
  const normalizedQuery = query.trim().toLowerCase();
  const words = normalizedQuery.split(/\s+/).filter(Boolean);

  if (words.length === 0) {
    return [];
  }

  const products = await getProducts();
  const suggestions = products
    .filter(({ name }) => matchesSearchWords(name, words))
    .map(({ name }) => ({
      name,
      normalizedName: name.toLowerCase(),
    }))
    .sort((a, b) => {
      const aStartsWithQuery = a.normalizedName.startsWith(normalizedQuery);
      const bStartsWithQuery = b.normalizedName.startsWith(normalizedQuery);

      if (aStartsWithQuery !== bStartsWithQuery) {
        return aStartsWithQuery ? -1 : 1;
      }

      const aPosition = Math.min(
        ...words.map((word) => a.normalizedName.indexOf(word)),
      );
      const bPosition = Math.min(
        ...words.map((word) => b.normalizedName.indexOf(word)),
      );

      return aPosition - bPosition || a.name.localeCompare(b.name);
    });

  return [...new Set(suggestions.map(({ name }) => name))].slice(0, 5);
};

const getDetailsFile = (category: Category, language: Language) =>
  language === 'ua' ? `/${category}.ua.json` : `/${category}.json`;

const getDetailsList = (
  category: Category,
  language: Language,
): Promise<ProductDetails[]> => {
  const file = getDetailsFile(category, language);
  const cached = detailsRequests.get(file);

  if (cached) {
    return cached;
  }

  const request = client.get<ProductDetails[]>(file).catch((error) => {
    detailsRequests.delete(file);
    throw error;
  });

  detailsRequests.set(file, request);

  return request;
};

export const getProductsByCategory = async (
  category: Category,
): Promise<Product[]> => {
  const products = await getProducts();

  return products.filter((product) => product.category === category);
};

export const getNewProducts = async (): Promise<Product[]> => {
  const products = await getProducts();

  return [...products].sort((a, b) => b.year - a.year).slice(0, SLIDER_SIZE);
};

export const getHotPriceProducts = async (): Promise<Product[]> => {
  const products = await getProducts();

  return [...products]
    .sort((a, b) => b.fullPrice - b.price - (a.fullPrice - a.price))
    .slice(0, SLIDER_SIZE);
};

export const getSuggestedProducts = async (
  namespaceId: string,
): Promise<Product[]> => {
  const products = await getProducts();

  return products
    .filter((product) => !product.itemId.startsWith(`${namespaceId}-`))
    .map((product) => ({ product, order: Math.random() }))
    .sort((a, b) => a.order - b.order)
    .slice(0, SLIDER_SIZE)
    .map(({ product }) => product);
};

export const getCategoryCounts = async (): Promise<
  Record<Category, number>
> => {
  const products = await getProducts();
  const counts: Record<Category, number> = {
    phones: 0,
    tablets: 0,
    accessories: 0,
  };

  products.forEach((product) => {
    counts[product.category] += 1;
  });

  return counts;
};

const getProductDetailsFromJson = async (
  itemId: string,
  language: Language,
): Promise<ProductWithDetails | null> => {
  const products = await getProducts();
  const product = products.find((item) => item.itemId === itemId);

  if (!product) {
    return null;
  }

  const list = await getDetailsList(product.category, language);
  const details = list.find((item) => item.id === itemId);

  return details ? { category: product.category, product, details } : null;
};

const getProductDetailsFromSupabase = async (
  itemId: string,
  language: Language,
): Promise<ProductWithDetails | null> => {
  const rows = await supabase.select<ProductWithTranslationsRow[]>(
    'products',
    `select=*,product_translations(language,zoom,cell,description)&item_id=eq.${encodeURIComponent(itemId)}&product_translations.language=eq.${language}`,
  );

  return rows[0] ? toProductWithDetails(rows[0]) : null;
};

export const getProductDetails = (
  itemId: string,
  language: Language,
): Promise<ProductWithDetails | null> =>
  withFallback(
    () => getProductDetailsFromSupabase(itemId, language),
    () => getProductDetailsFromJson(itemId, language),
  );
