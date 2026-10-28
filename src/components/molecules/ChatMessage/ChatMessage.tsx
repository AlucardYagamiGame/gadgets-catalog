import styles from './ChatMessage.module.scss';

import type { ReactNode } from 'react';

type ChatMessageVariant = 'user' | 'assistant' | 'action';

interface ChatMessageProps {
  variant: ChatMessageVariant;
  children: ReactNode;
}

export const ChatMessage = ({ variant, children }: ChatMessageProps) => {
  const classes = [styles.root, styles[variant]].join(' ');

  return (
    <div className={classes}>
      <p className={styles.text}>{children}</p>
    </div>
  );
};
