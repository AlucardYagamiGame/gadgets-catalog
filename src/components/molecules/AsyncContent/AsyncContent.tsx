import { Loader } from '@/components/atoms/Loader';
import { ErrorMessage } from '@/components/molecules/ErrorMessage';

import type { ReactNode } from 'react';

interface AsyncContentProps {
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
  labels: { loading: string; retry: string };
  children: ReactNode;
}

export const AsyncContent = ({
  isLoading,
  error,
  onRetry,
  labels,
  children,
}: AsyncContentProps) => {
  if (isLoading) {
    return <Loader label={labels.loading} />;
  }

  if (error) {
    return (
      <ErrorMessage
        message={error}
        retryLabel={labels.retry}
        onRetry={onRetry}
      />
    );
  }

  return <>{children}</>;
};
