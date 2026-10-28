import { useId, useLayoutEffect, useRef } from 'react';

import styles from '../FormField/FormField.module.scss';

import type { ChangeEvent, ClipboardEvent, KeyboardEvent } from 'react';

const PHONE_DIGIT_POSITIONS = [5, 6, 9, 10, 11, 13, 14, 16, 17];
const PHONE_MASK_LENGTH = 18;

interface PhoneFieldProps {
  label: string;
  value: string;
  error?: string;
  onChange: (value: string) => void;
}

const getPhoneDigits = (phone: string) => {
  let digits = phone.replace(/\D/g, '');

  if (digits.startsWith('380')) {
    digits = digits.slice(3);
  } else if (digits.startsWith('38')) {
    digits = digits.slice(2);

    if (digits.startsWith('0')) {
      digits = digits.slice(1);
    }
  } else if (digits.startsWith('0')) {
    digits = digits.slice(1);
  }

  return digits.slice(0, 9);
};

const formatPhone = (digits: string) => {
  const slots = `${digits}_________`.slice(0, 9);

  return `+38(0${slots.slice(0, 2)}) ${slots.slice(2, 5)}-${slots.slice(5, 7)}-${slots.slice(7, 9)}`;
};

const getDigitIndex = (position: number) =>
  PHONE_DIGIT_POSITIONS.filter((digitPosition) => digitPosition < position)
    .length;

const getCaretPosition = (digitIndex: number) =>
  PHONE_DIGIT_POSITIONS[digitIndex] ?? PHONE_MASK_LENGTH;

export const PhoneField = ({
  label,
  value,
  error,
  onChange,
}: PhoneFieldProps) => {
  const errorId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const pendingCaret = useRef<number | null>(null);
  const digits = getPhoneDigits(value);

  useLayoutEffect(() => {
    if (pendingCaret.current !== null && inputRef.current) {
      const position = getCaretPosition(pendingCaret.current);

      inputRef.current.setSelectionRange(position, position);
      pendingCaret.current = null;
    }
  }, [value]);

  const updateDigits = (nextDigits: string, caretIndex: number) => {
    const limitedDigits = nextDigits.slice(0, 9);

    pendingCaret.current = Math.min(caretIndex, limitedDigits.length);
    onChange(limitedDigits ? `+380${limitedDigits}` : '');
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.ctrlKey || event.metaKey || event.altKey) {
      return;
    }

    const input = event.currentTarget;
    const startIndex = getDigitIndex(input.selectionStart ?? 0);
    const endIndex = getDigitIndex(input.selectionEnd ?? 0);

    if (/^\d$/.test(event.key)) {
      event.preventDefault();
      const nextDigits =
        digits.slice(0, startIndex) + event.key + digits.slice(endIndex);

      updateDigits(nextDigits, startIndex + 1);
      return;
    }

    if (event.key === 'Backspace' || event.key === 'Delete') {
      event.preventDefault();

      if (startIndex !== endIndex) {
        updateDigits(
          digits.slice(0, startIndex) + digits.slice(endIndex),
          startIndex,
        );
      } else if (event.key === 'Backspace' && startIndex > 0) {
        updateDigits(
          digits.slice(0, startIndex - 1) + digits.slice(startIndex),
          startIndex - 1,
        );
      } else if (event.key === 'Delete' && startIndex < digits.length) {
        updateDigits(
          digits.slice(0, startIndex) + digits.slice(startIndex + 1),
          startIndex,
        );
      }

      return;
    }

    if (event.key.length === 1) {
      event.preventDefault();
    }
  };

  const handlePaste = (event: ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    const pastedDigits = getPhoneDigits(event.clipboardData.getData('text'));

    updateDigits(pastedDigits, pastedDigits.length);
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextDigits = getPhoneDigits(event.currentTarget.value);

    if (nextDigits !== digits) {
      updateDigits(nextDigits, nextDigits.length);
    }
  };

  return (
    <label className={styles.root}>
      <span className={styles.label}>{label}</span>
      <input
        ref={inputRef}
        className={styles.input}
        type="tel"
        autoComplete="tel"
        inputMode="numeric"
        maxLength={PHONE_MASK_LENGTH}
        value={formatPhone(digits)}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        onFocus={() => {
          const position = getCaretPosition(digits.length);

          inputRef.current?.setSelectionRange(position, position);
        }}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
      />
      {error && (
        <span
          id={errorId}
          className={styles.error}
          role="alert"
        >
          {error}
        </span>
      )}
    </label>
  );
};
