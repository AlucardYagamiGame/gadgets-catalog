import { useId, useState } from 'react';

import styles from './Dropdown.module.scss';

import type { MouseEvent } from 'react';

const MENU_MAX_HEIGHT = 280;
const MENU_ITEM_MIN_HEIGHT = 40;
const MENU_EDGE_GAP = 8;
const MENU_MIN_HEIGHT = 80;

interface Placement {
  up: boolean;
  maxHeight?: number;
}

interface Option {
  value: string;
  label: string;
}

interface DropdownProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  description?: string;
  placeholder?: string;
  name?: string;
  error?: string;
  fullWidth?: boolean;
  disabled?: boolean;
  multiline?: boolean;
  autoPlacement?: boolean;
}

export const Dropdown = ({
  options,
  value,
  onChange,
  description,
  placeholder,
  name,
  error,
  fullWidth,
  disabled,
  multiline,
  autoPlacement,
}: DropdownProps) => {
  const [open, setOpen] = useState(false);
  const [placement, setPlacement] = useState<Placement>({ up: false });
  const errorId = useId();
  const selected = options.find((o) => o.value === value);

  const wrapperClasses = [
    styles.wrapper,
    fullWidth && styles.full,
    multiline && styles.multiline,
  ]
    .filter(Boolean)
    .join(' ');

  const getPlacement = (control: HTMLElement): Placement => {
    const rect = control.getBoundingClientRect();
    const container = control.closest('dialog')?.getBoundingClientRect();
    const top = container ? container.top : 0;
    const bottom = container ? container.bottom : window.innerHeight;

    const spaceBelow = bottom - rect.bottom - MENU_EDGE_GAP;
    const spaceAbove = rect.top - top - MENU_EDGE_GAP;
    const needed = Math.min(
      MENU_MAX_HEIGHT,
      options.length * MENU_ITEM_MIN_HEIGHT,
    );

    if (spaceBelow >= needed) {
      return { up: false };
    }

    const up = spaceAbove > spaceBelow;
    const space = up ? spaceAbove : spaceBelow;

    return {
      up,
      maxHeight: Math.max(Math.min(MENU_MAX_HEIGHT, space), MENU_MIN_HEIGHT),
    };
  };

  const handleToggle = (event: MouseEvent<HTMLButtonElement>) => {
    if (!open && autoPlacement) {
      setPlacement(getPlacement(event.currentTarget));
    }

    setOpen((prev) => !prev);
  };

  const controlClasses = [
    styles.control,
    open && styles.focus,
    error && styles.invalid,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={wrapperClasses}>
      {description && <span className={styles.description}>{description}</span>}

      <div className={styles.select}>
        <button
          type="button"
          name={name}
          disabled={disabled}
          className={controlClasses}
          onClick={handleToggle}
          aria-expanded={open}
          aria-describedby={error ? errorId : undefined}
        >
          {selected ?
            selected.label
          : <span className={styles.placeholder}>{placeholder}</span>}
          <span
            className={open ? `${styles.arrow} ${styles.up}` : styles.arrow}
            aria-hidden
          />
        </button>

        {open && options.length > 0 && (
          <ul
            className={
              autoPlacement && placement.up ?
                `${styles.menu} ${styles.menuUp}`
              : styles.menu
            }
            style={
              autoPlacement && placement.maxHeight ?
                { maxHeight: placement.maxHeight }
              : undefined
            }
            role="listbox"
          >
            {options.map((option) => (
              <li key={option.value}>
                <button
                  type="button"
                  role="option"
                  aria-selected={option.value === value}
                  className={
                    option.value === value ?
                      `${styles.item} ${styles.hover}`
                    : styles.item
                  }
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                >
                  {option.label}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {error && (
        <span
          id={errorId}
          className={styles.error}
          role="alert"
        >
          {error}
        </span>
      )}
    </div>
  );
};
