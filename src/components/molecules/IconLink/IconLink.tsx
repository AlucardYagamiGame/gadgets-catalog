import { NavLink } from 'react-router-dom';

import { Counter } from '@/components/atoms/Counter';

import styles from './IconLink.module.scss';

import type { ReactNode } from 'react';

interface IconLinkProps {
  to: string;
  label: string;
  count?: number;
  children: ReactNode;
}

export const IconLink = ({ to, label, count = 0, children }: IconLinkProps) => (
  <NavLink
    to={to}
    aria-label={label}
    className={({ isActive }) =>
      isActive ? `${styles.root} ${styles.active}` : styles.root
    }
  >
    {children}
    {count > 0 && (
      <span className={styles.counter}>
        <Counter value={count} />
      </span>
    )}
  </NavLink>
);
