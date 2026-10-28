import filtersIcon from '@/assets/icons/filters.svg';
import { Icon } from '@/components/atoms/Icon';
import { Dropdown } from '@/components/molecules/Dropdown';
import { PER_PAGE_ROWS, SORT_VALUES } from '@/constants';
import { useTranslation } from '@/hooks';

import styles from './CatalogControls.module.scss';

import type { PerPageRows, SortBy } from '@/types';

interface CatalogControlsProps {
  sortBy: SortBy;
  perPageRows: PerPageRows | 'all';
  columns: number;
  onSortChange: (value: SortBy) => void;
  onPerPageRowsChange: (value: PerPageRows | 'all') => void;
  filtersCount: number;
  onOpenFilters: () => void;
}

export const CatalogControls = ({
  sortBy,
  perPageRows,
  columns,
  onSortChange,
  onPerPageRowsChange,
  filtersCount,
  onOpenFilters,
}: CatalogControlsProps) => {
  const { t } = useTranslation();

  return (
    <div className={styles.root}>
      <button
        type="button"
        className={styles.filters}
        onClick={onOpenFilters}
      >
        <Icon
          src={filtersIcon}
          alt=""
        />
        {t.filters.open}
        {filtersCount > 0 && (
          <span className={styles.badge}>{filtersCount}</span>
        )}
      </button>
      <Dropdown
        description={t.catalog.sortBy}
        options={SORT_VALUES.map((value) => ({
          value,
          label: t.catalog.sort[value],
        }))}
        value={sortBy}
        onChange={(value) => onSortChange(value as SortBy)}
      />
      <Dropdown
        description={t.catalog.itemsOnPage}
        options={[
          ...PER_PAGE_ROWS.map((rows) => ({
            value: rows,
            label: String(Number(rows) * columns),
          })),
          { value: 'all', label: t.catalog.all },
        ]}
        value={perPageRows}
        onChange={(value) => onPerPageRowsChange(value as PerPageRows | 'all')}
      />
    </div>
  );
};
