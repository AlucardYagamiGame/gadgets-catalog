import { Button } from '@/components/atoms/Button';

import styles from './ErrorMessage.module.scss';

interface ErrorMessageProps {
  message: string;
  retryLabel?: string;
  onRetry?: () => void;
}

export const ErrorMessage = ({
  message,
  retryLabel,
  onRetry,
}: ErrorMessageProps) => (
  <div
    className={styles.root}
    role="alert"
  >
    <p className={styles.text}>{message}</p>
    {onRetry && retryLabel && <Button onClick={onRetry}>{retryLabel}</Button>}
  </div>
);
