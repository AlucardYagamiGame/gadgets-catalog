import { useState } from 'react';

import closeIcon from '@/assets/icons/close.svg';
import { AiButton } from '@/components/atoms/AiButton';
import { Icon } from '@/components/atoms/Icon';
import { useTranslation } from '@/hooks';

import styles from './AiAssistant.module.scss';

interface AiAssistantProps {
  isOpen?: boolean;
  onToggle?: () => void;
}

export const AiAssistant = ({ isOpen = false, onToggle }: AiAssistantProps) => {
  const { t } = useTranslation();
  const [isHidden, setIsHidden] = useState(false);

  if (isHidden) {
    return null;
  }

  return (
    <div className={styles.dock}>
      <div className={styles.widget}>
        <AiButton
          aria-label={isOpen ? t.assistant.close : t.assistant.open}
          aria-expanded={isOpen}
          onClick={onToggle}
        >
          AI
        </AiButton>
        <button
          type="button"
          className={styles.close}
          aria-label={t.assistant.hide}
          onClick={() => setIsHidden(true)}
        >
          <Icon
            src={closeIcon}
            alt=""
          />
        </button>
      </div>
    </div>
  );
};
