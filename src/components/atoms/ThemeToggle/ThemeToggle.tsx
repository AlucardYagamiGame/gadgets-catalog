import { useId } from 'react';

import styles from './ThemeToggle.module.scss';

interface ThemeToggleProps {
  isDark: boolean;
  onToggle: () => void;
  label: string;
}

export const ThemeToggle = ({ isDark, onToggle, label }: ThemeToggleProps) => {
  const id = useId();

  return (
    <div className={styles.root}>
      <input
        id={id}
        className={styles.input}
        type="checkbox"
        role="switch"
        checked={isDark}
        onChange={onToggle}
      />
      <label
        className={styles.label}
        htmlFor={id}
      >
        <span className="visually-hidden">{label}</span>
      </label>
    </div>
  );
};
