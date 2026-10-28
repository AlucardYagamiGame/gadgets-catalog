import type { ReactNode } from 'react';

export interface AnimationProviderProps {
  children: ReactNode;
}

export interface PageTransitionProps {
  children: ReactNode;
}

export interface RevealProps {
  children: ReactNode;
  delay?: number;
}
