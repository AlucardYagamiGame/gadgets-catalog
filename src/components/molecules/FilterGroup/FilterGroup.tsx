import { useId } from 'react';

import styles from './FilterGroup.module.scss';

import type { ReactNode } from 'react';

interface FilterGroupProps {
  title: string;
  children: ReactNode;
}

export const FilterGroup = ({ title, children }: FilterGroupProps) => {
  const titleId = useId();

  return (
    <div
      className={styles.root}
      role="group"
      aria-labelledby={titleId}
    >
      <p
        id={titleId}
        className={styles.title}
      >
        {title}
      </p>
      {children}
    </div>
  );
};
