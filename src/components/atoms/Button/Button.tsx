import styles from './Button.module.scss';

import type { ButtonHTMLAttributes } from 'react';

type Variant = 'primary' | 'selected';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

export const Button = ({
  variant = 'primary',
  className,
  children,
  ...rest
}: ButtonProps) => {
  const classes = [styles.button, styles[variant], className]
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
