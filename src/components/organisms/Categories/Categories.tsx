import { CategoryCard } from '@/components/molecules/CategoryCard';
import { CATEGORIES } from '@/constants';
import { useTranslation } from '@/hooks';

import styles from './Categories.module.scss';

import type { Category } from '@/types';

interface CategoriesProps {
  counts: Record<Category, number>;
}

export const Categories = ({ counts }: CategoriesProps) => {
  const { t } = useTranslation();

  return (
    <section className={styles.root}>
      <h2 className={styles.title}>{t.home.shopByCategory}</h2>
      <div className={styles.list}>
        {CATEGORIES.map((category) => (
          <CategoryCard
            key={category.id}
            category={category}
            title={t.categories[category.id]}
            countLabel={t.catalog.models(counts[category.id])}
          />
        ))}
      </div>
    </section>
  );
};
