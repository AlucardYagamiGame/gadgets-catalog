import closeIcon from '@/assets/icons/close.svg';
import { Icon } from '@/components/atoms/Icon';
import { ProductPrice } from '@/components/molecules/ProductPrice';
import { QuantityCounter } from '@/components/molecules/QuantityCounter';

import styles from './CartItem.module.scss';

import type { CartItem as CartItemType } from '@/types';

interface CartItemProps {
  item: CartItemType;
  formatPrice: (value: number) => string;
  removeLabel: string;
  decreaseLabel: string;
  increaseLabel: string;
  onDecrease: () => void;
  onIncrease: () => void;
  onRemove: () => void;
}

export const CartItem = ({
  item,
  formatPrice,
  removeLabel,
  decreaseLabel,
  increaseLabel,
  onDecrease,
  onIncrease,
  onRemove,
}: CartItemProps) => (
  <article className={styles.root}>
    <button
      type="button"
      className={styles.remove}
      aria-label={removeLabel}
      onClick={onRemove}
    >
      <Icon
        src={closeIcon}
        alt=""
      />
    </button>
    <img
      className={styles.image}
      src={item.product.image}
      alt={item.product.name}
    />
    <p className={styles.title}>{item.product.name}</p>
    <div className={styles.counter}>
      <QuantityCounter
        value={item.quantity}
        decreaseLabel={decreaseLabel}
        increaseLabel={increaseLabel}
        onDecrease={onDecrease}
        onIncrease={onIncrease}
      />
    </div>
    <div className={styles.price}>
      <ProductPrice
        price={item.product.price * item.quantity}
        format={formatPrice}
      />
    </div>
  </article>
);
