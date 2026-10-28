import astronautActiveLightIcon from '@/assets/icons/astronaut-active-light.svg';
import astronautActiveIcon from '@/assets/icons/astronaut-active.svg';
import astronautLightIcon from '@/assets/icons/astronaut-light.svg';
import astronautIcon from '@/assets/icons/astronaut.svg';
import chevronDownLightIcon from '@/assets/icons/chevron-down-light.svg';
import chevronDownIcon from '@/assets/icons/chevron-down.svg';
import chevronLeftLightIcon from '@/assets/icons/chevron-left-light.svg';
import chevronLeftIcon from '@/assets/icons/chevron-left.svg';
import chevronRightLightIcon from '@/assets/icons/chevron-right-light.svg';
import chevronRightIcon from '@/assets/icons/chevron-right.svg';
import chevronUpLightIcon from '@/assets/icons/chevron-up-light.svg';
import chevronUpIcon from '@/assets/icons/chevron-up.svg';
import closeLightIcon from '@/assets/icons/close-light.svg';
import closeIcon from '@/assets/icons/close.svg';
import favoriteFilledLightIcon from '@/assets/icons/favorite-filled-light.svg';
import favoriteFilledIcon from '@/assets/icons/favorite-filled.svg';
import favoriteOutlineLightIcon from '@/assets/icons/favorite-outline-light.svg';
import favoriteOutlineIcon from '@/assets/icons/favorite-outline.svg';
import filtersLightIcon from '@/assets/icons/filters-light.svg';
import filtersIcon from '@/assets/icons/filters.svg';
import homeLightIcon from '@/assets/icons/home-light.svg';
import homeIcon from '@/assets/icons/home.svg';
import menuLightIcon from '@/assets/icons/menu-light.svg';
import menuIcon from '@/assets/icons/menu.svg';
import minusLightIcon from '@/assets/icons/minus-light.svg';
import minusIcon from '@/assets/icons/minus.svg';
import plusLightIcon from '@/assets/icons/plus-light.svg';
import plusIcon from '@/assets/icons/plus.svg';
import searchLightIcon from '@/assets/icons/search-light.svg';
import searchIcon from '@/assets/icons/search.svg';
import shoppingBagLightIcon from '@/assets/icons/shopping-bag-light.svg';
import shoppingBagIcon from '@/assets/icons/shopping-bag.svg';
import userLightIcon from '@/assets/icons/user-light.svg';
import userIcon from '@/assets/icons/user.svg';
import { useThemeStore } from '@/store';

import styles from './Icon.module.scss';

type Size = 'sm' | 'lg';

interface IconProps {
  src: string;
  alt?: string;
  size?: Size;
  className?: string;
}

const LIGHT_THEME_ICONS: Record<string, string> = {
  [astronautActiveIcon]: astronautActiveLightIcon,
  [astronautIcon]: astronautLightIcon,
  [chevronDownIcon]: chevronDownLightIcon,
  [chevronLeftIcon]: chevronLeftLightIcon,
  [chevronRightIcon]: chevronRightLightIcon,
  [chevronUpIcon]: chevronUpLightIcon,
  [closeIcon]: closeLightIcon,
  [favoriteFilledIcon]: favoriteFilledLightIcon,
  [favoriteOutlineIcon]: favoriteOutlineLightIcon,
  [filtersIcon]: filtersLightIcon,
  [homeIcon]: homeLightIcon,
  [menuIcon]: menuLightIcon,
  [minusIcon]: minusLightIcon,
  [plusIcon]: plusLightIcon,
  [searchIcon]: searchLightIcon,
  [shoppingBagIcon]: shoppingBagLightIcon,
  [userIcon]: userLightIcon,
};

export const Icon = ({ src, alt = '', size = 'sm', className }: IconProps) => {
  const theme = useThemeStore((state) => state.theme);
  const classes = [styles.icon, styles[size], className]
    .filter(Boolean)
    .join(' ');
  const iconSrc = theme === 'light' ? (LIGHT_THEME_ICONS[src] ?? src) : src;

  return (
    <img
      className={classes}
      src={iconSrc}
      alt={alt}
    />
  );
};
