import chevronLeftIcon from '@/assets/icons/chevron-left.svg';
import chevronRightIcon from '@/assets/icons/chevron-right.svg';
import { Icon } from '@/components/atoms/Icon';
import { IconButton } from '@/components/atoms/IconButton';
import { useMediaQuery } from '@/hooks';

import styles from './Pagination.module.scss';

const MAX_PAGES_DESKTOP = 9;
const MAX_PAGES_MOBILE = 5;

interface PaginationProps {
  current: number;
  total: number;
  onChange: (page: number) => void;
  labels: { pagination: string; previous: string; next: string };
}

export const Pagination = ({
  current,
  total,
  onChange,
  labels,
}: PaginationProps) => {
  const isTablet = useMediaQuery('(min-width: 640px)');
  const maxVisible = isTablet ? MAX_PAGES_DESKTOP : MAX_PAGES_MOBILE;

  const firstPage = Math.floor((current - 1) / maxVisible) * maxVisible + 1;
  const lastPage = Math.min(firstPage + maxVisible - 1, total);
  const pages = Array.from(
    { length: lastPage - firstPage + 1 },
    (_, i) => firstPage + i,
  );

  const handlePrev = () => {
    if (current > 1) {
      onChange(current - 1);
    }
  };

  const handleNext = () => {
    if (current < total) {
      onChange(current + 1);
    }
  };

  return (
    <nav
      className={styles.pagination}
      aria-label={labels.pagination}
    >
      <IconButton
        variant="slider"
        className={styles.arrowButton}
        onClick={handlePrev}
        disabled={current === 1}
        aria-label={labels.previous}
      >
        <Icon
          src={chevronLeftIcon}
          alt=""
          className={styles.arrow}
        />
      </IconButton>

      <div className={styles.pagesWrapper}>
        {pages.map((page) => (
          <button
            key={page}
            type="button"
            className={
              page === current ? `${styles.page} ${styles.active}` : styles.page
            }
            onClick={() => onChange(page)}
            aria-current={page === current ? 'page' : undefined}
          >
            {page}
          </button>
        ))}
      </div>

      <IconButton
        variant="slider"
        className={styles.arrowButton}
        onClick={handleNext}
        disabled={current === total}
        aria-label={labels.next}
      >
        <Icon
          src={chevronRightIcon}
          alt=""
          className={styles.arrow}
        />
      </IconButton>
    </nav>
  );
};
