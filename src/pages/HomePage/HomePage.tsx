import { Reveal } from '@/animations';
import { AsyncContent } from '@/components/molecules/AsyncContent';
import { Categories } from '@/components/organisms/Categories';
import { PicturesSlider } from '@/components/organisms/PicturesSlider';
import { ProductsSlider } from '@/components/organisms/ProductsSlider';
import { useAsync, useTranslation } from '@/hooks';
import {
  getCategoryCounts,
  getHotPriceProducts,
  getNewProducts,
} from '@/services';

import styles from './HomePage.module.scss';

export const HomePage = () => {
  const { t } = useTranslation();
  const newProducts = useAsync(getNewProducts);
  const counts = useAsync(getCategoryCounts);
  const hotProducts = useAsync(getHotPriceProducts);

  return (
    <div className={styles.root}>
      <h1 className={styles.title}>{t.home.title}</h1>
      <Reveal>
        <PicturesSlider />
      </Reveal>

      <AsyncContent
        isLoading={newProducts.isLoading}
        error={newProducts.error}
        onRetry={newProducts.retry}
        labels={t.status}
      >
        <ProductsSlider
          title={t.home.newModels}
          products={newProducts.data ?? []}
        />
      </AsyncContent>

      <AsyncContent
        isLoading={counts.isLoading}
        error={counts.error}
        onRetry={counts.retry}
        labels={t.status}
      >
        {counts.data && <Categories counts={counts.data} />}
      </AsyncContent>

      <AsyncContent
        isLoading={hotProducts.isLoading}
        error={hotProducts.error}
        onRetry={hotProducts.retry}
        labels={t.status}
      >
        <ProductsSlider
          title={t.home.hotPrices}
          products={hotProducts.data ?? []}
        />
      </AsyncContent>
    </div>
  );
};
