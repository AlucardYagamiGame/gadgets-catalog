import { Breadcrumbs } from '@/components/molecules/Breadcrumbs';
import { ProductsList } from '@/components/organisms/ProductsList';
import { useTranslation } from '@/hooks';
import { useFavoritesStore } from '@/store';

import styles from './FavoritesPage.module.scss';

export const FavoritesPage = () => {
  const { t } = useTranslation();
  const favorites = useFavoritesStore((state) => state.items);

  return (
    <div className={styles.root}>
      <Breadcrumbs
        items={[{ label: t.favourites.title }]}
        label={t.header.breadcrumbs}
        homeLabel={t.common.home}
      />
      <h1 className={styles.title}>{t.favourites.title}</h1>
      <p className={styles.count}>{t.favourites.count(favorites.length)}</p>
      {favorites.length === 0 ?
        <p className={styles.empty}>{t.favourites.empty}</p>
      : <ProductsList products={favorites} />}
    </div>
  );
};
