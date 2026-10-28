import styles from './Counter.module.scss';

interface CounterProps {
  value: number;
}

export const Counter = ({ value }: CounterProps) => {
  if (value <= 0) {
    return null;
  }

  return <span className={styles.root}>{value}</span>;
};
