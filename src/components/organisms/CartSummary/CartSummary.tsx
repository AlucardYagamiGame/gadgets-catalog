import { Button } from '@/components/atoms/Button';

import styles from './CartSummary.module.scss';

interface CartSummaryProps {
  totalLabel: string;
  countLabel: string;
  checkoutLabel: string;
  onCheckout: () => void;
}

export const CartSummary = ({
  totalLabel,
  countLabel,
  checkoutLabel,
  onCheckout,
}: CartSummaryProps) => (
  <aside className={styles.root}>
    <p className={styles.total}>{totalLabel}</p>
    <p className={styles.count}>{countLabel}</p>
    <Button
      className={styles.button}
      onClick={onCheckout}
    >
      {checkoutLabel}
    </Button>
  </aside>
);
