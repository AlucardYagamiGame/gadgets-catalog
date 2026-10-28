import styles from './Loader.module.scss';

interface LoaderProps {
  label: string;
}

export const Loader = ({ label }: LoaderProps) => (
  <div
    className={styles.root}
    role="status"
    data-loader
    aria-label={label}
  >
    <div
      className={styles.dots}
      aria-hidden="true"
    >
      <span className={styles.dot} />
      <span className={styles.dot} />
      <span className={styles.dot} />
    </div>
  </div>
);
