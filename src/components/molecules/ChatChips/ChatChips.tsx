import styles from './ChatChips.module.scss';

export interface ChatChip {
  id: string;
  label: string;
}

interface ChatChipsProps {
  chips: ChatChip[];
  label: string;
  disabled?: boolean;
  onSelect: (id: string) => void;
}

export const ChatChips = ({
  chips,
  label,
  disabled = false,
  onSelect,
}: ChatChipsProps) => (
  <div
    className={styles.root}
    role="group"
    aria-label={label}
  >
    {chips.map((chip) => (
      <button
        key={chip.id}
        type="button"
        className={styles.chip}
        disabled={disabled}
        onClick={() => onSelect(chip.id)}
      >
        {chip.label}
      </button>
    ))}
  </div>
);
