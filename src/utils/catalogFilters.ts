import {
  FACET_IDS,
  FILTER_CONFIG,
  MIN_FACET_OPTIONS,
  PRICE_STEP,
  SCREEN_THRESHOLDS,
  normalizeColor,
} from '@/constants';

import type {
  CatalogFacets,
  Category,
  Facet,
  FacetId,
  FacetOption,
  FilterSelection,
  PriceBounds,
  Product,
} from '@/types';

interface FacetValue {
  key: string;
  raw: string;
  order: number;
}

const UNIT_WEIGHTS: Record<string, number> = {
  tb: 1048576,
  gb: 1024,
  mb: 1,
  mm: 1,
};

const MEMORY_PATTERN = /^(\d+(?:\.\d+)?)\s*(tb|gb|mb|mm)$/i;
const NUMBER_PATTERN = /\d+(?:\.\d+)?/;

const parseMemory = (value: string) => {
  const match = MEMORY_PATTERN.exec(value.trim());

  if (!match) {
    return null;
  }

  const unit = match[2].toLowerCase();

  return { unit, amount: Number(match[1]) * UNIT_WEIGHTS[unit] };
};

const getMemoryValue = (value: string): FacetValue | null => {
  const parsed = parseMemory(value);

  if (!parsed) {
    return value ? { key: value.toLowerCase(), raw: value, order: 0 } : null;
  }

  if (parsed.unit === 'mm') {
    return {
      key: `${parsed.amount}mm`,
      raw: `${parsed.amount}mm`,
      order: parsed.amount,
    };
  }

  const raw =
    parsed.amount >= UNIT_WEIGHTS.tb ? `${parsed.amount / UNIT_WEIGHTS.tb}TB`
    : parsed.amount >= UNIT_WEIGHTS.gb ? `${parsed.amount / UNIT_WEIGHTS.gb}GB`
    : `${parsed.amount}MB`;

  return { key: `${parsed.amount}mb`, raw, order: parsed.amount };
};

const getScreenValue = (
  screen: string,
  category: Category,
): FacetValue | null => {
  const match = NUMBER_PATTERN.exec(screen);

  if (!match) {
    return null;
  }

  const diagonal = Number(match[0]);
  const thresholds = SCREEN_THRESHOLDS[category];
  const index = thresholds.findIndex((limit) => diagonal <= limit);
  const bucket = index === -1 ? thresholds.length : index;

  return { key: `s${bucket}`, raw: String(bucket), order: bucket };
};

const getBrandValue = (name: string): FacetValue | null => {
  const brand = name.trim().split(/\s+/)[0];

  return brand ? { key: brand.toLowerCase(), raw: brand, order: 0 } : null;
};

const resolveFacetValue = (
  id: FacetId,
  product: Product,
): FacetValue | null => {
  switch (id) {
    case 'brand':
      return getBrandValue(product.name);
    case 'capacity':
      return getMemoryValue(product.capacity);
    case 'ram':
      return getMemoryValue(product.ram);
    case 'screen':
      return getScreenValue(product.screen, product.category);
    case 'color':
      return product.color ?
          { key: normalizeColor(product.color), raw: product.color, order: 0 }
        : null;
    case 'year':
      return {
        key: String(product.year),
        raw: String(product.year),
        order: -product.year,
      };
    default:
      return null;
  }
};

const matchesPrice = (product: Product, price: PriceBounds | null) =>
  !price || (product.price >= price.min && product.price <= price.max);

const matchesFacets = (
  product: Product,
  selection: FilterSelection,
  skip?: FacetId,
) =>
  FACET_IDS.every((id) => {
    const selected = selection.facets[id];

    if (id === skip || !selected || selected.length === 0) {
      return true;
    }

    const value = resolveFacetValue(id, product);

    return value !== null && selected.includes(value.key);
  });

export const filterProducts = (
  products: Product[],
  selection: FilterSelection,
): Product[] =>
  products.filter(
    (product) =>
      matchesPrice(product, selection.price) &&
      matchesFacets(product, selection),
  );

const getPriceBounds = (products: Product[]): PriceBounds => {
  if (products.length === 0) {
    return { min: 0, max: 0 };
  }

  const prices = products.map(({ price }) => price);

  return {
    min: Math.floor(Math.min(...prices) / PRICE_STEP) * PRICE_STEP,
    max: Math.ceil(Math.max(...prices) / PRICE_STEP) * PRICE_STEP,
  };
};

const buildFacet = (
  config: Facet['config'],
  products: Product[],
  selection: FilterSelection,
): Facet => {
  const available = products.filter(
    (product) =>
      matchesPrice(product, selection.price) &&
      matchesFacets(product, selection, config.id),
  );
  const options = new Map<
    string,
    FacetOption & { order: number; total: number }
  >();

  products.forEach((product) => {
    const value = resolveFacetValue(config.id, product);

    if (!value) {
      return;
    }

    const option = options.get(value.key) ?? {
      value: value.key,
      raw: value.raw,
      count: 0,
      order: value.order,
      total: 0,
    };

    option.total += 1;
    options.set(value.key, option);
  });

  available.forEach((product) => {
    const value = resolveFacetValue(config.id, product);
    const option = value && options.get(value.key);

    if (option) {
      option.count += 1;
    }
  });

  const sorted = [...options.values()].sort(
    (a, b) =>
      a.order - b.order || b.total - a.total || a.raw.localeCompare(b.raw),
  );

  return {
    config,
    options: sorted.map(({ value, raw, count }) => ({ value, raw, count })),
  };
};

export const buildCatalogFacets = (
  products: Product[],
  category: Category,
  selection: FilterSelection,
): CatalogFacets => ({
  price: getPriceBounds(products),
  facets: FILTER_CONFIG[category]
    .map((config) => buildFacet(config, products, selection))
    .filter((facet) => facet.options.length >= MIN_FACET_OPTIONS),
});

export const parseSelection = (params: URLSearchParams): FilterSelection => {
  const facets: FilterSelection['facets'] = {};

  FACET_IDS.forEach((id) => {
    const values = (params.get(id) ?? '').split(',').filter(Boolean);

    if (values.length > 0) {
      facets[id] = values;
    }
  });

  const [min, max] = (params.get('price') ?? '').split('-').map(Number);
  const hasPrice =
    Number.isFinite(min) && Number.isFinite(max) && max > 0 && min <= max;

  return { price: hasPrice ? { min, max } : null, facets };
};

export const serializeSelection = (
  selection: FilterSelection,
  bounds: PriceBounds | null,
): URLSearchParams => {
  const params = new URLSearchParams();
  const { price } = selection;

  if (price && (!bounds || price.min > bounds.min || price.max < bounds.max)) {
    params.set('price', `${price.min}-${price.max}`);
  }

  FACET_IDS.forEach((id) => {
    const values = selection.facets[id];

    if (values && values.length > 0) {
      params.set(id, values.join(','));
    }
  });

  return params;
};

export const countActiveFilters = (selection: FilterSelection) =>
  (selection.price ? 1 : 0) +
  FACET_IDS.reduce((sum, id) => sum + (selection.facets[id]?.length ?? 0), 0);
