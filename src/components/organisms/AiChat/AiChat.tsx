import { Fragment, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import chevronDownIcon from '@/assets/icons/chevron-down.svg';
import chevronUpIcon from '@/assets/icons/chevron-up.svg';
import closeIcon from '@/assets/icons/close.svg';
import { Button } from '@/components/atoms/Button';
import { Icon } from '@/components/atoms/Icon';
import { ChatChips } from '@/components/molecules/ChatChips';
import { ChatCompare } from '@/components/molecules/ChatCompare';
import { ChatMessage } from '@/components/molecules/ChatMessage';
import { useTranslation } from '@/hooks';
import { askAi } from '@/services/ai';
import { runToolCall } from '@/services/aiTools';
import { useAiChatStore } from '@/store';

import styles from './AiChat.module.scss';
import { buildCompareTable } from './buildCompareTable';

import type { ChatChip } from '@/components/molecules/ChatChips';
import type { AiErrorReason, AiHistoryMessage } from '@/services/ai';
import type { AiComparison } from '@/services/aiCompare';
import type { AiChatMessage } from '@/store';
import type { FormEvent } from 'react';

interface AiChatProps {
  onClose: () => void;
}

const HISTORY_LIMIT = 6;

// The last few text turns give the model context for follow-up questions.
const buildHistory = (text: string): AiHistoryMessage[] => {
  const history = useAiChatStore
    .getState()
    .messages.flatMap<AiHistoryMessage>((message) =>
      message.role === 'user' || message.role === 'assistant' ?
        [{ role: message.role, content: message.text }]
      : [],
    )
    .slice(-HISTORY_LIMIT);
  const last = history[history.length - 1];

  return last?.role === 'user' && last.content === text ?
      history
    : [...history.slice(-(HISTORY_LIMIT - 1)), { role: 'user', content: text }];
};

interface ChatError {
  reason: AiErrorReason;
  text: string;
}

export const AiChat = ({ onClose }: AiChatProps) => {
  const { t, language, formatValue, formatPrice } = useTranslation();
  const navigate = useNavigate();
  const messages = useAiChatStore((state) => state.messages);
  const add = useAiChatStore((state) => state.add);
  const clear = useAiChatStore((state) => state.clear);
  const [value, setValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ChatError | null>(null);
  const [areChipsOpen, setAreChipsOpen] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const chipsText = t.assistant.chips;

  const chips: ChatChip[] = [
    { id: 'language', label: chipsText.switchLanguage },
    { id: 'find', label: chipsText.find },
    { id: 'compare', label: chipsText.compare },
  ];

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !document.querySelector('dialog[open]')) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  useEffect(() => {
    const list = listRef.current;

    if (list) {
      list.scrollTop = list.scrollHeight;
    }
  }, [messages, isLoading, error]);

  const request = async (text: string) => {
    setIsLoading(true);
    setError(null);

    const result = await askAi(buildHistory(text), navigate);

    setIsLoading(false);

    if (!result.ok) {
      setError({ reason: result.reason, text });

      return;
    }

    const answer = result.text.trim();

    if (
      result.actions.length === 0 &&
      result.comparisons.length === 0 &&
      !answer
    ) {
      setError({ reason: 'invalid', text });

      return;
    }

    result.actions.forEach((action) => add({ role: 'action', action }));
    result.comparisons.forEach((comparison) =>
      add({ role: 'compare', comparison }),
    );

    if (answer && result.comparisons.length === 0) {
      add({ role: 'assistant', text: answer });
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const text = value.trim();

    if (!text || isLoading) {
      return;
    }

    add({ role: 'user', text });
    setValue('');
    void request(text);
  };

  const handleClear = () => {
    clear();
    setError(null);
  };

  const switchLanguage = async () => {
    const next = language === 'en' ? 'ua' : 'en';

    add({ role: 'user', text: chipsText.switchLanguage });
    setError(null);

    const outcome = await runToolCall(
      {
        function: {
          name: 'set_language',
          arguments: JSON.stringify({ language: next }),
        },
      },
      navigate,
    );

    if (outcome) {
      add({ role: 'action', action: outcome.name });
    }
  };

  const fillInput = (prefix: string, example: string) => {
    const text = `${prefix}${example}`;

    setValue(text);

    requestAnimationFrame(() => {
      const input = inputRef.current;

      if (!input) {
        return;
      }

      input.focus();
      input.setSelectionRange(prefix.length, text.length);
    });
  };

  const handleChipSelect = (id: string) => {
    if (id === 'language') {
      void switchLanguage();
    }

    if (id === 'find') {
      fillInput(chipsText.findPrefix, chipsText.findExample);
    }

    if (id === 'compare') {
      fillInput(chipsText.comparePrefix, chipsText.compareExample);
    }
  };

  const renderComparison = (
    id: string,
    { products, missing, mismatched }: AiComparison,
  ) => {
    const c = t.assistant.compare;
    const notes: string[] = [];

    if (missing.length > 0) {
      notes.push(c.missing(missing.join(', ')));
    }

    if (mismatched.length > 0) {
      notes.push(c.mismatched(mismatched.join(', ')));
    }

    const table =
      products.length >= 2 ?
        buildCompareTable(products, t.specs, formatValue, formatPrice)
      : null;

    return (
      <Fragment key={id}>
        {table ?
          <ChatCompare
            caption={c.table}
            columns={table.columns}
            rows={table.rows}
          />
        : <ChatMessage variant="assistant">{c.notEnough}</ChatMessage>}

        {notes.map((note) => (
          <ChatMessage
            key={note}
            variant="action"
          >
            {note}
          </ChatMessage>
        ))}
      </Fragment>
    );
  };

  const renderMessage = (message: AiChatMessage) => {
    if (message.role === 'action') {
      return (
        <ChatMessage
          key={message.id}
          variant="action"
        >
          {t.assistant.actions[message.action] ?? message.action}
        </ChatMessage>
      );
    }

    if (message.role === 'compare') {
      return renderComparison(message.id, message.comparison);
    }

    return (
      <ChatMessage
        key={message.id}
        variant={message.role}
      >
        {message.text}
      </ChatMessage>
    );
  };

  return (
    <aside
      className={styles.root}
      aria-label={t.assistant.title}
    >
      <header className={styles.header}>
        <h2 className={styles.title}>{t.assistant.title}</h2>
        <div className={styles.actions}>
          {messages.length > 0 && (
            <button
              type="button"
              className={styles.clear}
              disabled={isLoading}
              onClick={handleClear}
            >
              {t.assistant.clear}
            </button>
          )}
          <button
            type="button"
            className={styles.close}
            aria-label={t.assistant.close}
            onClick={onClose}
          >
            <Icon
              src={closeIcon}
              alt=""
            />
          </button>
        </div>
      </header>

      <div
        ref={listRef}
        className={styles.list}
        role="log"
        aria-label={t.assistant.messages}
      >
        {messages.length === 0 && (
          <>
            <ChatMessage variant="assistant">
              {t.assistant.greeting}
            </ChatMessage>
            <ChatChips
              chips={chips}
              label={chipsText.label}
              disabled={isLoading}
              onSelect={handleChipSelect}
            />
          </>
        )}

        {messages.map(renderMessage)}

        {isLoading && (
          <ChatMessage variant="assistant">{t.assistant.thinking}</ChatMessage>
        )}

        {error && (
          <div
            className={styles.error}
            role="alert"
          >
            <p className={styles.errorText}>
              {t.assistant.errors[error.reason]}
            </p>
            {error.reason !== 'config' && (
              <Button
                className={styles.retry}
                onClick={() => void request(error.text)}
              >
                {t.status.retry}
              </Button>
            )}
          </div>
        )}
      </div>

      {messages.length > 0 && (
        <div className={styles.suggestions}>
          <button
            type="button"
            className={styles.toggle}
            aria-expanded={areChipsOpen}
            aria-label={areChipsOpen ? chipsText.hide : chipsText.show}
            onClick={() => setAreChipsOpen((isOpen) => !isOpen)}
          >
            <span>{chipsText.label}</span>
            <Icon
              src={areChipsOpen ? chevronDownIcon : chevronUpIcon}
              alt=""
            />
          </button>

          {areChipsOpen && (
            <div className={styles.chips}>
              <ChatChips
                chips={chips}
                label={chipsText.label}
                disabled={isLoading}
                onSelect={handleChipSelect}
              />
            </div>
          )}
        </div>
      )}

      <form
        className={styles.form}
        onSubmit={handleSubmit}
      >
        <input
          ref={inputRef}
          className={styles.input}
          type="text"
          autoComplete="off"
          maxLength={500}
          aria-label={t.assistant.inputLabel}
          placeholder={t.assistant.placeholder}
          value={value}
          onChange={(event) => setValue(event.target.value)}
        />
        <Button
          className={styles.send}
          type="submit"
          disabled={isLoading || !value.trim()}
        >
          {t.assistant.send}
        </Button>
      </form>
    </aside>
  );
};
