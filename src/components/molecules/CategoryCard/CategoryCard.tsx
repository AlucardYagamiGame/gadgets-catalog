import { Link } from 'react-router-dom';

import styles from './CategoryCard.module.scss';

import type { CategoryInfo } from '@/constants';

interface CategoryCardProps {
  category: CategoryInfo;
  title: string;
  countLabel: string;
}

export const CategoryCard = ({
  category,
  title,
  countLabel,
}: CategoryCardProps) => (
  <Link
    to={category.path}
    className={`${styles.root} ${styles[category.id]}`}
  >
    <div className={styles.frame}>
      <span
        className={styles.rim}
        aria-hidden="true"
      >
        <span className={styles.rimGlow}>
          <span className={styles.rimRing} />
        </span>
        <span className={styles.rimRing} />
      </span>
      <div className={styles.preview}>
        <span
          className={styles.space}
          aria-hidden="true"
        >
          <span className={styles.starsFar} />
          <span className={styles.stars} />
          <span className={styles.core} />
          <span className={styles.swirl} />
          <span className={styles.streaks} />
        </span>
        <span className={styles.float}>
          <img
            className={styles.image}
            src={category.image}
            srcSet={category.srcSet}
            sizes={category.sizes}
            width={category.width}
            height={category.height}
            alt={title}
            loading="lazy"
            decoding="async"
          />
        </span>
      </div>
    </div>
    <div className={styles.info}>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.count}>{countLabel}</p>
    </div>
  </Link>
);
