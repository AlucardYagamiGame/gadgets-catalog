import { useEffect } from 'react';
import { NavLink } from 'react-router-dom';

import astronautActive from '@/assets/icons/astronaut-active.svg';
import astronaut from '@/assets/icons/astronaut.svg';
import close from '@/assets/icons/close.svg';
import favoriteOutline from '@/assets/icons/favorite-outline.svg';
import shoppingBag from '@/assets/icons/shopping-bag.svg';
import { Counter } from '@/components/atoms/Counter';
import { Icon } from '@/components/atoms/Icon';
import { Logo } from '@/components/atoms/Logo';
import { CATEGORIES, ROUTES } from '@/constants';
import { useTranslation } from '@/hooks';
import { isSupabaseConfigured } from '@/services';
import {
  selectCartCount,
  selectFavoritesCount,
  useAuthStore,
  useCartStore,
  useFavoritesStore,
} from '@/store';

import styles from './BurgerMenu.module.scss';

interface BurgerMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onAccount: () => void;
}

const getItemClassName = ({ isActive }: { isActive: boolean }) =>
  isActive ? `${styles.item} ${styles.itemActive}` : styles.item;

export const BurgerMenu = ({ isOpen, onClose, onAccount }: BurgerMenuProps) => {
  const { t } = useTranslation();
  const cartCount = useCartStore(selectCartCount);
  const favoritesCount = useFavoritesStore(selectFavoritesCount);
  const isSignedIn = useAuthStore((state) => state.user !== null);

  const navItems = [
    { to: ROUTES.HOME, label: t.common.home },
    ...CATEGORIES.map((category) => ({
      to: category.path,
      label: t.nav[category.id],
    })),
  ];

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    const desktopQuery = window.matchMedia('(min-width: 640px)');

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    const handleDesktop = (event: MediaQueryListEvent) => {
      if (event.matches) {
        onClose();
      }
    };

    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);
    desktopQuery.addEventListener('change', handleDesktop);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
      desktopQuery.removeEventListener('change', handleDesktop);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  const handleAccount = () => {
    onClose();
    onAccount();
  };

  return (
    <aside
      className={styles.root}
      aria-label={t.header.menu}
    >
      <div className={styles.top}>
        <div className={styles.logo}>
          <Logo onClick={onClose} />
        </div>

        <button
          type="button"
          className={styles.close}
          aria-label={t.header.closeMenu}
          onClick={onClose}
        >
          <Icon
            src={close}
            alt=""
          />
        </button>
      </div>

      <nav
        className={styles.nav}
        aria-label={t.header.mainNav}
      >
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end
            className={getItemClassName}
            onClick={onClose}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className={styles.actions}>
        <NavLink
          to={ROUTES.FAVORITES}
          className={styles.cell}
          aria-label={t.header.favourites}
          onClick={onClose}
        >
          <Icon
            src={favoriteOutline}
            alt=""
          />
          {favoritesCount > 0 && (
            <span className={styles.counter}>
              <Counter value={favoritesCount} />
            </span>
          )}
        </NavLink>
        <NavLink
          to={ROUTES.CART}
          className={styles.cell}
          aria-label={t.header.cart}
          onClick={onClose}
        >
          <Icon
            src={shoppingBag}
            alt=""
          />
          {cartCount > 0 && (
            <span className={styles.counter}>
              <Counter value={cartCount} />
            </span>
          )}
        </NavLink>
        {isSupabaseConfigured && (
          <button
            type="button"
            className={`${styles.cell} ${styles.cellButton} ${isSignedIn ? styles.cellActive : ''}`}
            aria-label={isSignedIn ? t.auth.account : t.auth.signIn}
            onClick={handleAccount}
          >
            <Icon
              src={isSignedIn ? astronautActive : astronaut}
              alt=""
            />
          </button>
        )}
      </div>
    </aside>
  );
};
