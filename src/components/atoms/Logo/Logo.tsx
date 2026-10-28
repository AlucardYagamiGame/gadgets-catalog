import { Link } from 'react-router-dom';

import darkThemeLogo from '@/assets/brand-logo-dark-theme.svg';
import lightThemeLogo from '@/assets/brand-logo-light-theme.svg';
import { ROUTES } from '@/constants';
import { useThemeStore } from '@/store';

import styles from './Logo.module.scss';

interface LogoProps {
  onClick?: () => void;
}

export const Logo = ({ onClick }: LogoProps) => {
  const theme = useThemeStore((state) => state.theme);

  return (
    <Link
      to={ROUTES.HOME}
      className={styles.root}
      aria-label="Nice Gadgets home"
      onClick={onClick}
    >
      <img
        className={styles.image}
        src={theme === 'light' ? lightThemeLogo : darkThemeLogo}
        alt="Nice Gadgets"
        width="119"
        height="32"
      />
    </Link>
  );
};
