import filtersIcon from '@/assets/icons/filters.svg';
import { CapacityButton } from '@/components/atoms/CapacityButton';
import { Checkbox } from '@/components/atoms/Checkbox';
import { ColorSwatch } from '@/components/atoms/ColorSwatch';
import { Icon } from '@/components/atoms/Icon';
import { FilterGroup } from '@/components/molecules/FilterGroup';
import { PriceRange } from '@/components/molecules/PriceRange';
import { PRICE_STEP, SCREEN_THRESHOLDS, getColorHex } from '@/constants';
import { useTranslation } from '@/hooks';

import styles from './CatalogFilters.module.scss';

import type {
  CatalogFacets,
  Category,
  Facet,
  FacetId,
  FacetOption,
  FilterSelection,
  PriceBounds,
} from '@/types';

interface CatalogFiltersProps {
  category: Category;
  catalog: CatalogFacets;
  selection: FilterSelection;
  activeCount: number;
  plain?: boolean;
  onPriceChange: (price: PriceBounds) => void;
  onToggle: (id: FacetId, value: string) => void;
  onReset: () => void;
}

export const CatalogFilters = ({
  category,
  catalog,
  selection,
  activeCount,
  plain = false,
  onPriceChange,
  onToggle,
  onReset,
}: CatalogFiltersProps) => {
  const { t, formatColor, formatValue, formatPrice } = useTranslation();
  const thresholds = SCREEN_THRESHOLDS[category];

  const getLabel = (id: FacetId, option: FacetOption) => {
    switch (id) {
      case 'screen': {
        const index = Number(option.raw);

        if (index === 0) {
          return t.filters.upTo(thresholds[0]);
        }

        return index >= thresholds.length ?
            t.filters.over(thresholds[thresholds.length - 1])
          : t.filters.between(thresholds[index - 1], thresholds[index]);
      }
      case 'color':
        return formatColor(option.raw);
      case 'capacity':
      case 'ram':
        return formatValue(option.raw);
      default:
        return option.raw;
    }
  };

  const renderOptions = ({ config, options }: Facet) => {
    const selected = selection.facets[config.id] ?? [];

    switch (config.kind) {
      case 'chips':
        return (
          <div className={styles.chips}>
            {options.map((option) => {
              const isSelected = selected.includes(option.value);

              return (
                <CapacityButton
                  key={option.value}
                  variant="filter"
                  selected={isSelected}
                  disabled={option.count === 0 && !isSelected}
                  onClick={() => onToggle(config.id, option.value)}
                >
                  {getLabel(config.id, option)}
                </CapacityButton>
              );
            })}
          </div>
        );
      case 'swatches':
        return (
          <div className={styles.swatches}>
            {options.map((option) => {
              const isSelected = selected.includes(option.value);

              return (
                <ColorSwatch
                  key={option.value}
                  color={getColorHex(option.raw)}
                  label={getLabel(config.id, option)}
                  selected={isSelected}
                  disabled={option.count === 0 && !isSelected}
                  onClick={() => onToggle(config.id, option.value)}
                />
              );
            })}
          </div>
        );
      default:
        return (
          <div className={styles.options}>
            {options.map((option) => {
              const isSelected = selected.includes(option.value);

              return (
                <Checkbox
                  key={option.value}
                  label={getLabel(config.id, option)}
                  count={option.count}
                  checked={isSelected}
                  disabled={option.count === 0 && !isSelected}
                  onChange={() => onToggle(config.id, option.value)}
                />
              );
            })}
          </div>
        );
    }
  };

  return (
    <div className={`${styles.root} ${plain ? styles.plain : ''}`}>
      <div className={styles.header}>
        {plain ?
          <span />
        : <h2 className={styles.title}>
            <Icon
              src={filtersIcon}
              alt=""
            />
            {t.filters.title}
          </h2>
        }
        <button
          type="button"
          className={styles.reset}
          disabled={activeCount === 0}
          onClick={onReset}
        >
          {t.filters.reset}
        </button>
      </div>

      <PriceRange
        bounds={catalog.price}
        value={selection.price ?? catalog.price}
        step={PRICE_STEP}
        title={t.filters.price}
        labels={{ min: t.filters.min, max: t.filters.max }}
        formatPrice={formatPrice}
        onChange={onPriceChange}
      />

      {catalog.facets.map((facet) => (
        <FilterGroup
          key={facet.config.id}
          title={t.filters.groups[facet.config.titleKey]}
        >
          {renderOptions(facet)}
        </FilterGroup>
      ))}
    </div>
  );
};
