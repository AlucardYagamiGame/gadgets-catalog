import { useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { BackLink } from '@/components/atoms/BackLink';
import { AsyncContent } from '@/components/molecules/AsyncContent';
import { Breadcrumbs } from '@/components/molecules/Breadcrumbs';
import { ErrorMessage } from '@/components/molecules/ErrorMessage';
import { ProductAbout } from '@/components/organisms/ProductAbout';
import { ProductGallery } from '@/components/organisms/ProductGallery';
import { ProductsSlider } from '@/components/organisms/ProductsSlider';
import { ProductTechSpecs } from '@/components/organisms/ProductTechSpecs';
import { ProductVariants } from '@/components/organisms/ProductVariants';
import { CATEGORIES, getProductPath } from '@/constants';
import { useAsync, useProductActions, useTranslation } from '@/hooks';
import { getProductDetails, getSuggestedProducts } from '@/services';

import styles from './ProductDetailsPage.module.scss';

export const ProductDetailsPage = () => {
  const { t, language } = useTranslation();
  const navigate = useNavigate();
  const { productId = '' } = useParams();

  const loadProduct = useCallback(
    () => getProductDetails(productId, language),
    [productId, language],
  );

  const product = useAsync(loadProduct, { keepPrevious: true });
  const namespaceId = product.data?.details.namespaceId;

  const loadSuggested = useCallback(
    () =>
      namespaceId ? getSuggestedProducts(namespaceId) : Promise.resolve([]),
    [namespaceId],
  );
  const suggested = useAsync(loadSuggested);

  const category = CATEGORIES.find(({ id }) => id === product.data?.category);
  const categoryTitle = category ? t.categories[category.id] : '';

  const handleVariantChange = (color: string, capacity: string) => {
    if (!product.data) {
      return;
    }

    const { details } = product.data;
    const variantId = [
      details.namespaceId,
      capacity.toLowerCase(),
      color.toLowerCase().replace(/\s+/g, '-'),
    ].join('-');

    navigate(getProductPath(variantId));
  };

  const { isInCart, isFavourite, toggleCart, toggleFavourite } =
    useProductActions();

  const handleToggleCart = () => {
    if (product?.data) {
      toggleCart(product.data.product);
    }
  };

  const handleToggleFavourite = () => {
    if (product?.data) {
      toggleFavourite(product.data.product);
    }
  };

  return (
    <div className={styles.root}>
      <AsyncContent
        isLoading={product.isLoading && !product.data}
        error={product.error}
        onRetry={product.retry}
        labels={t.status}
      >
        {product.data ?
          <div className={styles.content}>
            <Breadcrumbs
              items={[
                { label: categoryTitle, path: category?.path },
                { label: product.data.details.name },
              ]}
              label={t.header.breadcrumbs}
              homeLabel={t.common.home}
            />
            <header className={styles.header}>
              <BackLink onClick={() => navigate(-1)}>{t.common.back}</BackLink>
              <h1 className={styles.title}>{product.data.details.name}</h1>
            </header>

            <div className={styles.top}>
              <ProductGallery
                key={product.data.details.id}
                images={product.data.details.images}
                name={product.data.details.name}
              />
              <ProductVariants
                product={product.data.details}
                onVariantChange={handleVariantChange}
                isInCart={isInCart(product.data.product.itemId)}
                isFavourite={isFavourite(product.data.product.itemId)}
                onToggleCart={handleToggleCart}
                onToggleFavourite={handleToggleFavourite}
              />
            </div>

            <div className={styles.bottom}>
              <ProductAbout description={product.data.details.description} />
              <ProductTechSpecs product={product.data.details} />
            </div>
          </div>
        : <ErrorMessage message={t.errors.productNotFound} />}
      </AsyncContent>

      {namespaceId && (
        <div className={styles.suggested}>
          <AsyncContent
            isLoading={suggested.isLoading}
            error={suggested.error}
            onRetry={suggested.retry}
            labels={t.status}
          >
            <ProductsSlider
              title={t.product.suggested}
              products={suggested.data ?? []}
            />
          </AsyncContent>
        </div>
      )}
    </div>
  );
};
