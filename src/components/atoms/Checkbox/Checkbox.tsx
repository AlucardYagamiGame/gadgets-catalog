import styles from './Checkbox.module.scss';

import type { InputHTMLAttributes } from 'react';

interface CheckboxProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type' | 'onChange'
> {
  label: string;
  checked: boolean;
  count?: number;
  onChange: (checked: boolean) => void;
}

export const Checkbox = ({
  label,
  checked,
  count,
  disabled,
  onChange,
  className,
  ...rest
}: CheckboxProps) => {
  const classes = [styles.root, disabled ? styles.disabled : '', className]
    .filter(Boolean)
    .join(' ');

  return (
    <label className={classes}>
      <input
        {...rest}
        className={styles.input}
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(event) => onChange(event.target.checked)}
      />
      <span
        className={styles.box}
        aria-hidden="true"
      />
      <span className={styles.label}>{label}</span>
      {count !== undefined && <span className={styles.count}>{count}</span>}
    </label>
  );
};
