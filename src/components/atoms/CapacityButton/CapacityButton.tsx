import styles from './CapacityButton.module.scss';

import type { ButtonHTMLAttributes } from 'react';

type Variant = 'default' | 'filter';

interface CapacityButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean;
  variant?: Variant;
}

export const CapacityButton = ({
  selected = false,
  variant = 'default',
  className,
  children,
  ...rest
}: CapacityButtonProps) => {
  const classes = [
    styles.root,
    variant === 'filter' ? styles.filter : '',
    selected ? styles.selected : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type="button"
      className={classes}
      aria-pressed={selected}
      {...rest}
    >
      {children}
    </button>
  );
};
