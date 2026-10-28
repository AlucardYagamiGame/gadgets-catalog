import { useId } from 'react';

import styles from './FormField.module.scss';

import type { InputHTMLAttributes } from 'react';

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  soft?: boolean;
}

export const FormField = ({
  label,
  error,
  soft = false,
  ...rest
}: FormFieldProps) => {
  const errorId = useId();

  return (
    <label className={styles.root}>
      <span className={styles.label}>{label}</span>
      <input
        {...rest}
        className={`${styles.input} ${soft ? styles.soft : ''}`}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
      />
      {error && (
        <span
          id={errorId}
          className={styles.error}
          role="alert"
        >
          {error}
        </span>
      )}
    </label>
  );
};
