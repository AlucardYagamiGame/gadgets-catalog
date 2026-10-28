import styles from './ProductSpecs.module.scss';

export interface Spec {
  label: string;
  value: string;
}

interface ProductSpecsProps {
  specs: Spec[];
}

export const ProductSpecs = ({ specs }: ProductSpecsProps) => (
  <dl className={styles.root}>
    {specs.map(({ label, value }) => (
      <div
        key={label}
        className={styles.row}
      >
        <dt className={styles.label}>{label}</dt>
        <dd className={styles.value}>{value}</dd>
      </div>
    ))}
  </dl>
);
