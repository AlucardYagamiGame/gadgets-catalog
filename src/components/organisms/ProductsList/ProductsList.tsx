import { ProductCard } from '@/components/molecules/ProductCard';
import { useTranslation, useProductActions } from '@/hooks';

import styles from './ProductsList.module.scss';

import type { Product } from '@/types';

interface ProductsListProps {
  products: Product[];
  withSidebar?: boolean;
}

export const ProductsList = ({
  products,
  withSidebar = false,
}: ProductsListProps) => {
  const { t, formatValue, formatPrice } = useTranslation();
  const { isInCart, isFavourite, toggleCart, toggleFavourite } =
    useProductActions();

  return (
    <ul
      className={
        withSidebar ? `${styles.root} ${styles.withSidebar}` : styles.root
      }
    >
      {products.map((product) => (
        <li key={product.id}>
          <ProductCard
            product={product}
            labels={{ ...t.card, ...t.specs }}
            formatValue={formatValue}
            formatPrice={formatPrice}
            isInCart={isInCart(product.itemId)}
            isFavourite={isFavourite(product.itemId)}
            onToggleCart={() => toggleCart(product)}
            onToggleFavourite={() => toggleFavourite(product)}
          />
        </li>
      ))}
    </ul>
  );
};
