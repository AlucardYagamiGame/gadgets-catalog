import styles from './ColorSwatch.module.scss';

import type { ButtonHTMLAttributes, CSSProperties } from 'react';

interface ColorSwatchProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  color: string;
  label: string;
  selected?: boolean;
}

export const ColorSwatch = ({
  color,
  label,
  selected = false,
  className,
  style,
  ...rest
}: ColorSwatchProps) => {
  const classes = [styles.swatch, selected ? styles.selected : '', className]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type="button"
      className={classes}
      style={{ ...style, '--swatch-color': color } as CSSProperties}
      aria-label={label}
      aria-pressed={selected}
      {...rest}
    />
  );
};
