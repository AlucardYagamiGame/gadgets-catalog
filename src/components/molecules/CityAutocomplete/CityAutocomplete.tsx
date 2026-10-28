import { useId, useState } from 'react';

import styles from './CityAutocomplete.module.scss';

import type { ChangeEvent, KeyboardEvent } from 'react';

interface Option {
  value: string;
  label: string;
}

interface CityAutocompleteProps {
  name: string;
  label: string;
  value: string;
  options: Option[];
  message?: string;
  error?: string;
  autoComplete?: string;
  onInputChange: (value: string) => void;
  onSelect: (option: Option) => void;
}

export const CityAutocomplete = ({
  name,
  label,
  value,
  options,
  message,
  error,
  autoComplete,
  onInputChange,
  onSelect,
}: CityAutocompleteProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const listId = useId();
  const errorId = useId();

  const isListVisible = isOpen && (options.length > 0 || Boolean(message));

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setIsOpen(true);
    setActiveIndex(-1);
    onInputChange(event.target.value);
  };

  const handleSelect = (option: Option) => {
    setIsOpen(false);
    setActiveIndex(-1);
    onSelect(option);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setIsOpen(false);

      return;
    }

    if (!isListVisible || options.length === 0) {
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((prev) => (prev + 1) % options.length);
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((prev) => (prev <= 0 ? options.length - 1 : prev - 1));
    }

    if (event.key === 'Enter' && options[activeIndex]) {
      event.preventDefault();
      handleSelect(options[activeIndex]);
    }
  };

  return (
    <div className={styles.root}>
      <label className={styles.field}>
        <span className={styles.label}>{label}</span>
        <input
          name={name}
          type="text"
          role="combobox"
          className={styles.input}
          value={value}
          autoComplete={autoComplete}
          aria-expanded={isListVisible}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={
            activeIndex >= 0 ? `${listId}-${activeIndex}` : undefined
          }
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          onChange={handleChange}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setIsOpen(false)}
          onKeyDown={handleKeyDown}
        />
      </label>

      {isListVisible && (
        <ul
          id={listId}
          className={styles.menu}
          role="listbox"
        >
          {options.length === 0 && (
            <li className={styles.message}>{message}</li>
          )}

          {options.map((option, index) => (
            <li key={option.value}>
              <button
                id={`${listId}-${index}`}
                type="button"
                role="option"
                tabIndex={-1}
                aria-selected={index === activeIndex}
                className={
                  index === activeIndex ?
                    `${styles.item} ${styles.active}`
                  : styles.item
                }
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => handleSelect(option)}
              >
                {option.label}
              </button>
            </li>
          ))}
        </ul>
      )}

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
