import styles from './QuantityCounter.module.scss';

interface QuantityCounterProps {
  value: number;
  decreaseLabel: string;
  increaseLabel: string;
  onDecrease: () => void;
  onIncrease: () => void;
}

export const QuantityCounter = ({
  value,
  decreaseLabel,
  increaseLabel,
  onDecrease,
  onIncrease,
}: QuantityCounterProps) => (
  <div className={styles.root}>
    <button
      type="button"
      className={styles.button}
      onClick={onDecrease}
      disabled={value <= 1}
      aria-label={decreaseLabel}
    >
      -
    </button>
    <span className={styles.value}>{value}</span>
    <button
      type="button"
      className={styles.button}
      onClick={onIncrease}
      aria-label={increaseLabel}
    >
      +
    </button>
  </div>
);
