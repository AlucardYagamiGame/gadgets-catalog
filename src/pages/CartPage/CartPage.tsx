import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { BackLink } from '@/components/atoms/BackLink';
import { CartItem } from '@/components/molecules/CartItem';
import { CartSummary } from '@/components/organisms/CartSummary';
import { CheckoutModal } from '@/components/organisms/CheckoutModal';
import { useTranslation } from '@/hooks';
import { selectCartCount, selectCartTotal, useCartStore } from '@/store';

import styles from './CartPage.module.scss';

export const CartPage = () => {
  const { t, formatPrice } = useTranslation();
  const navigate = useNavigate();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const items = useCartStore((state) => state.items);
  const total = useCartStore(selectCartTotal);
  const count = useCartStore(selectCartCount);
  const { remove, increment, decrement, clear } = useCartStore.getState();

  return (
    <div className={styles.root}>
      <BackLink onClick={() => navigate(-1)}>{t.common.back}</BackLink>
      <h1 className={styles.title}>{t.cart.title}</h1>

      {items.length === 0 ?
        <p className={styles.empty}>{t.cart.empty}</p>
      : <div className={styles.content}>
          <ul className={styles.list}>
            {items.map((item) => (
              <li key={item.id}>
                <CartItem
                  item={item}
                  formatPrice={formatPrice}
                  removeLabel={t.cart.remove}
                  decreaseLabel={t.cart.decrease}
                  increaseLabel={t.cart.increase}
                  onDecrease={() => decrement(item.id)}
                  onIncrease={() => increment(item.id)}
                  onRemove={() => remove(item.id)}
                />
              </li>
            ))}
          </ul>

          <CartSummary
            totalLabel={formatPrice(total)}
            countLabel={t.cart.total(count)}
            checkoutLabel={t.cart.checkout}
            onCheckout={() => setIsCheckoutOpen(true)}
          />
        </div>
      }

      {isCheckoutOpen && (
        <CheckoutModal
          total={total}
          count={count}
          onSubmit={clear}
          onClose={() => setIsCheckoutOpen(false)}
        />
      )}
    </div>
  );
};
