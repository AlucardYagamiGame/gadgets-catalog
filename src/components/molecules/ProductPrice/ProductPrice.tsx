import styles from './ProductPrice.module.scss';

interface ProductPriceProps {
  price: number;
  fullPrice?: number;
  format: (value: number) => string;
}

export const ProductPrice = ({
  price,
  fullPrice,
  format,
}: ProductPriceProps) => (
  <p className={styles.root}>
    <span className={styles.price}>{format(price)}</span>
    {fullPrice && fullPrice !== price && (
      <s className={styles.fullPrice}>{format(fullPrice)}</s>
    )}
  </p>
);
