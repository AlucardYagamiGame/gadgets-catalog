import favoriteFilledIcon from '@/assets/icons/favorite-filled.svg';
import favoriteOutlineIcon from '@/assets/icons/favorite-outline.svg';
import { Button } from '@/components/atoms/Button';
import { CapacityButton } from '@/components/atoms/CapacityButton';
import { ColorSwatch } from '@/components/atoms/ColorSwatch';
import { Icon } from '@/components/atoms/Icon';
import { IconButton } from '@/components/atoms/IconButton';
import { ProductPrice } from '@/components/molecules/ProductPrice';
import { ProductSpecs } from '@/components/molecules/ProductSpecs';
import { getColorHex } from '@/constants';
import { useTranslation } from '@/hooks';

import styles from './ProductVariants.module.scss';

import type { ProductDetails } from '@/types';
interface ProductVariantsProps {
  product: ProductDetails;
  onVariantChange: (color: string, capacity: string) => void;
  isInCart: boolean;
  isFavourite: boolean;
  onToggleCart: () => void;
  onToggleFavourite: () => void;
}
export const ProductVariants = ({
  product,
  onVariantChange,
  isInCart,
  isFavourite,
  onToggleCart,
  onToggleFavourite,
}: ProductVariantsProps) => {
  const { t, formatColor, formatValue, formatPrice } = useTranslation();

  const handleCartClick = () => {
    onToggleCart();
  };
  return (
    <div className={styles.root}>
      <p className={styles.label}>{t.product.availableColors}</p>
      <div className={styles.options}>
        {product.colorsAvailable.map((color) => (
          <ColorSwatch
            key={color}
            color={getColorHex(color)}
            label={formatColor(color)}
            selected={color === product.color}
            onClick={() => onVariantChange(color, product.capacity)}
          />
        ))}
      </div>
      <p className={styles.label}>{t.product.selectCapacity}</p>
      <div className={styles.options}>
        {product.capacityAvailable.map((capacity) => (
          <CapacityButton
            key={capacity}
            selected={capacity === product.capacity}
            onClick={() => onVariantChange(product.color, capacity)}
          >
            {formatValue(capacity)}
          </CapacityButton>
        ))}
      </div>
      <ProductPrice
        price={product.priceDiscount}
        fullPrice={product.priceRegular}
        format={formatPrice}
      />
      <div className={styles.actions}>
        <Button
          variant={isInCart ? 'selected' : 'primary'}
          className={styles.addToCart}
          onClick={handleCartClick}
        >
          {isInCart ? t.card.added : t.card.addToCart}
        </Button>
        <IconButton
          variant="favourite"
          added={isFavourite}
          className={styles.favourite}
          aria-label={
            isFavourite ? t.card.removeFromFavourites : t.card.addToFavourites
          }
          onClick={onToggleFavourite}
        >
          <Icon
            src={isFavourite ? favoriteFilledIcon : favoriteOutlineIcon}
            alt={t.card.favourite}
          />
        </IconButton>
      </div>
      <ProductSpecs
        specs={[
          { label: t.specs.screen, value: product.screen },
          { label: t.specs.resolution, value: product.resolution },
          { label: t.specs.processor, value: product.processor },
          { label: t.specs.ram, value: formatValue(product.ram) },
        ]}
      />
    </div>
  );
};
