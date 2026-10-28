import { useState } from 'react';

import chevronDown from '@/assets/icons/chevron-down.svg';
import chevronLeft from '@/assets/icons/chevron-left.svg';
import chevronRight from '@/assets/icons/chevron-right.svg';
import chevronUp from '@/assets/icons/chevron-up.svg';
import close from '@/assets/icons/close.svg';
import favoriteFilled from '@/assets/icons/favorite-filled.svg';
import favoriteOutline from '@/assets/icons/favorite-outline.svg';
import home from '@/assets/icons/home.svg';
import menu from '@/assets/icons/menu.svg';
import minus from '@/assets/icons/minus.svg';
import plus from '@/assets/icons/plus.svg';
import search from '@/assets/icons/search.svg';
import shoppingBag from '@/assets/icons/shopping-bag.svg';
import { BackLink } from '@/components/atoms/BackLink';
import { Button } from '@/components/atoms/Button';
import { CapacityButton } from '@/components/atoms/CapacityButton';
import { ColorSwatch } from '@/components/atoms/ColorSwatch';
import { Counter } from '@/components/atoms/Counter';
import { Icon } from '@/components/atoms/Icon';
import { IconButton } from '@/components/atoms/IconButton';
import { Loader } from '@/components/atoms/Loader';
import { Logo } from '@/components/atoms/Logo';
import { getColorHex } from '@/constants';

import styles from './UiKitPage.module.scss';

import type { ReactNode } from 'react';

const ICONS = [
  { name: 'chevron-down', src: chevronDown },
  { name: 'chevron-left', src: chevronLeft },
  { name: 'chevron-right', src: chevronRight },
  { name: 'chevron-up', src: chevronUp },
  { name: 'close', src: close },
  { name: 'favorite-filled', src: favoriteFilled },
  { name: 'favorite-outline', src: favoriteOutline },
  { name: 'home', src: home },
  { name: 'menu', src: menu },
  { name: 'minus', src: minus },
  { name: 'plus', src: plus },
  { name: 'search', src: search },
  { name: 'shopping-bag', src: shoppingBag },
];

const COLORS = ['gold', 'spacegray', 'silver', 'midnightgreen'];
const CAPACITIES = ['64GB', '128GB', '256GB'];

interface SpecimenProps {
  title: string;
  figma: string;
  children: ReactNode;
}

const Specimen = ({ title, figma, children }: SpecimenProps) => (
  <section className={styles.specimen}>
    <h2 className={styles.title}>{title}</h2>
    <p className={styles.figma}>Figma: {figma}</p>
    <div className={styles.cases}>{children}</div>
  </section>
);

interface CaseProps {
  label: string;
  children: ReactNode;
}

const Case = ({ label, children }: CaseProps) => (
  <figure className={styles.case}>
    <div className={styles.sample}>{children}</div>
    <figcaption className={styles.caption}>{label}</figcaption>
  </figure>
);

export const UiKitPage = () => {
  const [color, setColor] = useState(COLORS[0]);
  const [capacity, setCapacity] = useState(CAPACITIES[0]);

  return (
    <div className={styles.root}>
      <h1 className={styles.heading}>Atoms</h1>
      <p className={styles.hint}>
        Сторінка видна лише в режимі розробки. Наведи курсор на елемент, щоб
        побачити hover. Порівнюй із фреймами UI Kit у Figma.
      </p>

      <Specimen
        title="Button"
        figma="Buttons/Primary (Default, Hover, Added to cart)"
      >
        <Case label="primary">
          <Button>Add to cart</Button>
        </Case>
        <Case label="selected">
          <Button variant="selected">Added to cart</Button>
        </Case>
      </Specimen>

      <Specimen
        title="IconButton"
        figma="Buttons/Slider button (Default, Hover, Disabled), Add to favourites (Default, Hover, Added)"
      >
        <Case label="slider, left">
          <IconButton
            variant="slider"
            aria-label="Previous"
          >
            <Icon src={chevronLeft} />
          </IconButton>
        </Case>
        <Case label="slider, right">
          <IconButton
            variant="slider"
            aria-label="Next"
          >
            <Icon src={chevronRight} />
          </IconButton>
        </Case>
        <Case label="slider, disabled">
          <IconButton
            variant="slider"
            aria-label="Next"
            disabled
          >
            <Icon src={chevronRight} />
          </IconButton>
        </Case>
        <Case label="favourite">
          <IconButton
            variant="favourite"
            aria-label="Add to favourites"
          >
            <Icon src={favoriteOutline} />
          </IconButton>
        </Case>
        <Case label="favourite, added">
          <IconButton
            variant="favourite"
            added
            aria-label="Remove from favourites"
          >
            <Icon src={favoriteFilled} />
          </IconButton>
        </Case>
      </Specimen>

      <Specimen
        title="Icon"
        figma="Icons"
      >
        {ICONS.map(({ name, src }) => (
          <Case
            key={name}
            label={name}
          >
            <Icon src={src} />
          </Case>
        ))}
        <Case label="size lg">
          <Icon
            src={shoppingBag}
            size="lg"
          />
        </Case>
      </Specimen>

      <Specimen
        title="BackLink"
        figma="Buttons / Back (Default, Hover)"
      >
        <Case label="default">
          <BackLink>Back</BackLink>
        </Case>
      </Specimen>

      <Specimen
        title="ColorSwatch"
        figma="Selectors/Color (Default, Hover, Selected)"
      >
        {COLORS.map((name) => (
          <Case
            key={name}
            label={name === color ? `${name}, selected` : name}
          >
            <ColorSwatch
              color={getColorHex(name)}
              label={name}
              selected={name === color}
              onClick={() => setColor(name)}
            />
          </Case>
        ))}
      </Specimen>

      <Specimen
        title="CapacityButton"
        figma="Capacity на Item card, Select capacity (Default, Hover, Selected, Disabled)"
      >
        {CAPACITIES.map((value) => (
          <Case
            key={value}
            label={value === capacity ? `${value}, selected` : value}
          >
            <CapacityButton
              selected={value === capacity}
              onClick={() => setCapacity(value)}
            >
              {value}
            </CapacityButton>
          </Case>
        ))}
      </Specimen>

      <Specimen
        title="Counter"
        figma="Icons + Counter"
      >
        <Case label="1">
          <Counter value={1} />
        </Case>
        <Case label="12">
          <Counter value={12} />
        </Case>
        <Case label="99">
          <Counter value={99} />
        </Case>
        <Case label="0, нічого не показує">
          <Counter value={0} />
        </Case>
      </Specimen>

      <Specimen
        title="Loader"
        figma="У Figma не знайдено"
      >
        <Case label="default">
          <Loader label="Loading" />
        </Case>
      </Specimen>

      <Specimen
        title="Logo"
        figma="Logo"
      >
        <Case label="default">
          <Logo />
        </Case>
      </Specimen>
    </div>
  );
};
