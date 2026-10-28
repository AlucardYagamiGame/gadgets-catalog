import type { Category, FacetConfig, FacetId } from '@/types';

export const FACET_IDS: FacetId[] = [
  'brand',
  'capacity',
  'screen',
  'ram',
  'color',
  'year',
];

export const PRICE_STEP = 10;

export const MIN_FACET_OPTIONS = 2;

const BRAND: FacetConfig = {
  id: 'brand',
  kind: 'checkbox',
  titleKey: 'brand',
};

const SCREEN: FacetConfig = {
  id: 'screen',
  kind: 'checkbox',
  titleKey: 'screen',
};

const RAM: FacetConfig = { id: 'ram', kind: 'chips', titleKey: 'ram' };

const COLOR: FacetConfig = {
  id: 'color',
  kind: 'swatches',
  titleKey: 'color',
};

const YEAR: FacetConfig = { id: 'year', kind: 'chips', titleKey: 'year' };

export const FILTER_CONFIG: Record<Category, FacetConfig[]> = {
  phones: [
    BRAND,
    { id: 'capacity', kind: 'chips', titleKey: 'memory' },
    SCREEN,
    COLOR,
    RAM,
    YEAR,
  ],
  tablets: [
    BRAND,
    { id: 'capacity', kind: 'chips', titleKey: 'memory' },
    SCREEN,
    COLOR,
    RAM,
    YEAR,
  ],
  accessories: [
    BRAND,
    { id: 'capacity', kind: 'chips', titleKey: 'caseSize' },
    SCREEN,
    COLOR,
    RAM,
    YEAR,
  ],
};

export const SCREEN_THRESHOLDS: Record<Category, number[]> = {
  phones: [6, 6.5],
  tablets: [9, 10.5],
  accessories: [1.5, 1.7],
};
