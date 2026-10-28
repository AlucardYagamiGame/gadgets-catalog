import styles from './IconButton.module.scss';

import type { ButtonHTMLAttributes } from 'react';

type Variant = 'slider' | 'favourite';

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant: Variant;
  added?: boolean;
}

export const IconButton = ({
  variant,
  added = false,
  className,
  children,
  ...rest
}: IconButtonProps) => {
  const classes = [
    styles.iconButton,
    styles[variant],
    variant === 'favourite' && added ? styles.added : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type="button"
      className={classes}
      {...rest}
    >
      {children}
    </button>
  );
};
