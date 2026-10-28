import { useEffect, useId, useRef, useState } from 'react';

import styles from './SearchInput.module.scss';

import type { KeyboardEvent } from 'react';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onEscape?: () => void;
  suggestions?: string[];
  suggestionError?: string;
  placeholder: string;
  label: string;
  focusOnMount?: boolean;
}

export const SearchInput = ({
  value,
  onChange,
  onEscape,
  suggestions = [],
  suggestionError,
  placeholder,
  label,
  focusOnMount = false,
}: SearchInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const listId = useId();
  const [isFocused, setIsFocused] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const isListVisible =
    isFocused &&
    !isDismissed &&
    value.trim().length > 0 &&
    suggestions.length > 0;
  const completion = suggestions.find((suggestion) =>
    suggestion.toLowerCase().startsWith(value.toLowerCase()),
  );

  useEffect(() => {
    if (focusOnMount) {
      inputRef.current?.focus();
    }
  }, [focusOnMount]);

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      if (isListVisible) {
        setIsDismissed(true);
        setActiveIndex(-1);
      } else {
        onEscape?.();
      }

      return;
    }

    if (!isListVisible) {
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((previous) => (previous + 1) % suggestions.length);
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((previous) =>
        previous <= 0 ? suggestions.length - 1 : previous - 1,
      );
    }

    if (event.key === 'Enter' && suggestions[activeIndex]) {
      event.preventDefault();
      onChange(suggestions[activeIndex]);
      setActiveIndex(-1);
      setIsDismissed(true);
    }
  };

  return (
    <div className={styles.root}>
      {value.length > 0 && (
        <span
          className={styles.completion}
          aria-hidden="true"
        >
          <span>{value}</span>
          {completion && (
            <span className={styles.completionSuffix}>
              {completion.slice(value.length)}
            </span>
          )}
        </span>
      )}
      <input
        ref={inputRef}
        className={styles.input}
        type="search"
        name="search"
        value={value}
        placeholder={placeholder}
        aria-label={label}
        role="combobox"
        autoComplete="off"
        aria-expanded={isListVisible}
        aria-controls={listId}
        aria-autocomplete="both"
        aria-activedescendant={
          activeIndex >= 0 ? `${listId}-${activeIndex}` : undefined
        }
        onChange={(event) => {
          setActiveIndex(-1);
          setIsDismissed(false);
          onChange(event.target.value);
        }}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onKeyDown={handleKeyDown}
      />
      {isListVisible && (
        <ul
          id={listId}
          className={styles.suggestions}
          role="listbox"
        >
          {suggestions.map((suggestion, index) => (
            <li key={suggestion}>
              <button
                id={`${listId}-${index}`}
                className={
                  index === activeIndex ?
                    `${styles.suggestion} ${styles.activeSuggestion}`
                  : styles.suggestion
                }
                type="button"
                role="option"
                aria-selected={index === activeIndex}
                tabIndex={-1}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => {
                  onChange(suggestion);
                  setActiveIndex(-1);
                  setIsDismissed(true);
                }}
              >
                {suggestion}
              </button>
            </li>
          ))}
        </ul>
      )}
      {isFocused && suggestionError && (
        <p
          className={styles.suggestionError}
          role="alert"
        >
          {suggestionError}
        </p>
      )}
    </div>
  );
};
