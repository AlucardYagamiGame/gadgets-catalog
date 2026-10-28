import { Link } from 'react-router-dom';

import heartFilledIcon from '@/assets/icons/favorite-filled.svg';
import heartIcon from '@/assets/icons/favorite-outline.svg';
import { Button } from '@/components/atoms/Button';
import { Icon } from '@/components/atoms/Icon';
import { IconButton } from '@/components/atoms/IconButton';
import { ProductPrice } from '@/components/molecules/ProductPrice';
import { ProductSpecs } from '@/components/molecules/ProductSpecs';
import { getProductPath } from '@/constants';

import styles from './ProductCard.module.scss';

import type { Product } from '@/types';

export interface ProductCardLabels {
  screen: string;
  capacity: string;
  ram: string;
  addToCart: string;
  added: string;
  addToFavourites: string;
  removeFromFavourites: string;
  favourite: string;
}

interface ProductCardProps {
  product: Product;
  labels: ProductCardLabels;
  formatValue: (value: string) => string;
  formatPrice: (value: number) => string;
  isInCart: boolean;
  isFavourite: boolean;
  onToggleCart: () => void;
  onToggleFavourite: () => void;
}

export const ProductCard = ({
  product,
  labels,
  formatValue,
  formatPrice,
  isInCart,
  isFavourite,
  onToggleCart,
  onToggleFavourite,
}: ProductCardProps) => {
  const path = getProductPath(product.itemId);

  const handleCartClick = (event: React.MouseEvent) => {
    event.preventDefault();
    onToggleCart();
  };

  const handleFavouriteClick = (event: React.MouseEvent) => {
    event.preventDefault();
    onToggleFavourite();
  };

  return (
    <article className={styles.root}>
      <Link
        to={path}
        className={styles.imageLink}
      >
        <img
          className={styles.image}
          src={product.image}
          alt={product.name}
          loading="lazy"
          decoding="async"
        />
      </Link>

      <Link
        to={path}
        className={styles.title}
      >
        {product.name}
      </Link>

      <div className={styles.priceContainer}>
        <ProductPrice
          price={product.price}
          fullPrice={product.fullPrice}
          format={formatPrice}
        />
      </div>

      <div className={styles.divider} />

      <ProductSpecs
        specs={[
          { label: labels.screen, value: product.screen },
          { label: labels.capacity, value: formatValue(product.capacity) },
          { label: labels.ram, value: formatValue(product.ram) },
        ]}
      />

      <div className={styles.actions}>
        <Button
          className={[styles.cartButton, isInCart && styles.cartButtonAdded]
            .filter(Boolean)
            .join(' ')}
          variant={isInCart ? 'selected' : 'primary'}
          onClick={handleCartClick}
        >
          {isInCart ?
            <span className={styles.cartLabelAdded}>{labels.added}</span>
          : labels.addToCart}
        </Button>

        <IconButton
          variant="favourite"
          added={isFavourite}
          aria-label={
            isFavourite ? labels.removeFromFavourites : labels.addToFavourites
          }
          onClick={handleFavouriteClick}
        >
          <span
            className={[styles.heart, isFavourite && styles.heartActive]
              .filter(Boolean)
              .join(' ')}
          >
            <Icon
              src={isFavourite ? heartFilledIcon : heartIcon}
              alt={labels.favourite}
            />
          </span>
        </IconButton>
      </div>
    </article>
  );
};
