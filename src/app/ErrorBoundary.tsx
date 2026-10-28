import { Component } from 'react';

import { ErrorMessage } from '@/components/molecules/ErrorMessage';
import { getTranslations } from '@/hooks';
import { useLanguageStore } from '@/store';

import type { ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      const { t } = getTranslations(useLanguageStore.getState().language);

      return (
        <ErrorMessage
          message={t.errors.page}
          retryLabel={t.status.retry}
          onRetry={() => window.location.reload()}
        />
      );
    }

    return this.props.children;
  }
}
