export type FacetId =
  'brand' | 'capacity' | 'screen' | 'ram' | 'color' | 'year';

export type FacetKind = 'checkbox' | 'chips' | 'swatches';

export type FacetTitleKey =
  'brand' | 'memory' | 'caseSize' | 'screen' | 'ram' | 'color' | 'year';

export interface FacetConfig {
  id: FacetId;
  kind: FacetKind;
  titleKey: FacetTitleKey;
}

export interface FacetOption {
  value: string;
  raw: string;
  count: number;
}

export interface Facet {
  config: FacetConfig;
  options: FacetOption[];
}

export interface PriceBounds {
  min: number;
  max: number;
}

export interface FilterSelection {
  price: PriceBounds | null;
  facets: Partial<Record<FacetId, string[]>>;
}

export interface CatalogFacets {
  price: PriceBounds;
  facets: Facet[];
}
