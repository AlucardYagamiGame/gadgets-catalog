import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { AiComparison } from '@/services/aiCompare';

const MAX_MESSAGES = 50;

export type NewAiChatMessage =
  | { role: 'user' | 'assistant'; text: string }
  | { role: 'action'; action: string }
  | { role: 'compare'; comparison: AiComparison };

export type AiChatMessage = NewAiChatMessage & { id: string };

export interface AiChatState {
  messages: AiChatMessage[];
  add: (message: NewAiChatMessage) => void;
  clear: () => void;
}

export const useAiChatStore = create<AiChatState>()(
  persist(
    (set) => ({
      messages: [],

      add: (message) =>
        set((state) => ({
          messages: [
            ...state.messages,
            { ...message, id: crypto.randomUUID() },
          ].slice(-MAX_MESSAGES),
        })),

      clear: () => set({ messages: [] }),
    }),
    { name: 'ai-chat' },
  ),
);
