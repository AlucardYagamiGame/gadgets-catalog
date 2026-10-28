import { useEffect, useId, useRef } from 'react';

import closeIcon from '@/assets/icons/close.svg';
import { Icon } from '@/components/atoms/Icon';

import styles from './Modal.module.scss';

import type { ReactNode, SyntheticEvent } from 'react';

interface ModalProps {
  title: string;
  closeLabel?: string;
  compact?: boolean;
  wide?: boolean;
  onClose: () => void;
  children: ReactNode;
}

export const Modal = ({
  title,
  closeLabel = 'Close',
  compact = false,
  wide = false,
  onClose,
  children,
}: ModalProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (!dialog.open) {
      dialog.showModal();
    }

    const handleBackdropPress = (event: MouseEvent) => {
      if (event.target === dialog) {
        onClose();
      }
    };

    dialog.addEventListener('mousedown', handleBackdropPress);

    return () => {
      dialog.removeEventListener('mousedown', handleBackdropPress);
    };
  }, [onClose]);

  const handleCancel = (event: SyntheticEvent) => {
    event.preventDefault();
    onClose();
  };

  const classes = [styles.root, compact && styles.compact, wide && styles.wide]
    .filter(Boolean)
    .join(' ');

  return (
    <dialog
      ref={dialogRef}
      className={classes}
      aria-labelledby={titleId}
      onCancel={handleCancel}
    >
      <div className={styles.panel}>
        <header className={styles.header}>
          <h2
            id={titleId}
            className={styles.title}
          >
            {title}
          </h2>
          <button
            type="button"
            className={styles.close}
            aria-label={closeLabel}
            onClick={onClose}
          >
            <Icon
              src={closeIcon}
              alt=""
            />
          </button>
        </header>

        {children}
      </div>
    </dialog>
  );
};
