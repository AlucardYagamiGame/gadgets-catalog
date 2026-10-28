import { NavLink } from 'react-router-dom';

import styles from './NavItem.module.scss';

import type { ReactNode } from 'react';

interface NavItemProps {
  to: string;
  children: ReactNode;
}

export const NavItem = ({ to, children }: NavItemProps) => (
  <NavLink
    to={to}
    end
    className={({ isActive }) =>
      isActive ? `${styles.root} ${styles.active}` : styles.root
    }
  >
    {children}
  </NavLink>
);
