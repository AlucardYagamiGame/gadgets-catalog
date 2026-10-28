import { useState } from 'react';

import styles from './PriceRange.module.scss';

import type { CSSProperties } from 'react';

interface Range {
  min: number;
  max: number;
}

interface PriceRangeProps {
  bounds: Range;
  value: Range;
  step: number;
  title: string;
  labels: {
    min: string;
    max: string;
  };
  formatPrice: (value: number) => string;
  onChange: (value: Range) => void;
}

export const PriceRange = ({
  bounds,
  value,
  step,
  title,
  labels,
  formatPrice,
  onChange,
}: PriceRangeProps) => {
  const [draft, setDraft] = useState(value);
  const [prevValue, setPrevValue] = useState(value);

  if (value.min !== prevValue.min || value.max !== prevValue.max) {
    setPrevValue(value);
    setDraft(value);
  }

  const span = Math.max(bounds.max - bounds.min, 1);
  const style = {
    '--from': `${((draft.min - bounds.min) / span) * 100}%`,
    '--to': `${((draft.max - bounds.min) / span) * 100}%`,
  } as CSSProperties;

  const commit = () => {
    if (draft.min !== value.min || draft.max !== value.max) {
      onChange(draft);
    }
  };

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <span className={styles.title}>{title}</span>
      </div>

      <div
        className={styles.slider}
        style={style}
      >
        <div className={styles.track} />
        <div className={styles.fill} />
        <input
          className={styles.thumb}
          type="range"
          aria-label={labels.min}
          aria-valuetext={formatPrice(draft.min)}
          min={bounds.min}
          max={bounds.max}
          step={step}
          value={draft.min}
          onChange={(event) =>
            setDraft({
              ...draft,
              min: Math.min(Number(event.target.value), draft.max - step),
            })
          }
          onPointerUp={commit}
          onKeyUp={commit}
          onBlur={commit}
        />
        <input
          className={styles.thumb}
          type="range"
          aria-label={labels.max}
          aria-valuetext={formatPrice(draft.max)}
          min={bounds.min}
          max={bounds.max}
          step={step}
          value={draft.max}
          onChange={(event) =>
            setDraft({
              ...draft,
              max: Math.max(Number(event.target.value), draft.min + step),
            })
          }
          onPointerUp={commit}
          onKeyUp={commit}
          onBlur={commit}
        />
      </div>

      <div className={styles.values}>
        <div className={styles.value}>
          <span className={styles.valueLabel}>{labels.min}</span>
          <span className={styles.valueText}>{formatPrice(draft.min)}</span>
        </div>
        <span
          className={styles.dash}
          aria-hidden="true"
        />
        <div className={styles.value}>
          <span className={styles.valueLabel}>{labels.max}</span>
          <span className={styles.valueText}>{formatPrice(draft.max)}</span>
        </div>
      </div>
    </div>
  );
};
