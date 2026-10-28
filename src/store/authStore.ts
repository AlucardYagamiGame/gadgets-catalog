import { create } from 'zustand';

import { isSupabaseConfigured, onAuthChange } from '@/services';

import { syncProfile } from './profileStore';
import { startUserSync, syncUser } from './userSync';

import type { AuthUser } from '@/types';

interface AuthState {
  user: AuthUser | null;
  isReady: boolean;
}

const SESSION_KEY = /^sb-.+-auth-token$/;
const IDLE_TIMEOUT = 3000;

let isStarted = false;

export const useAuthStore = create<AuthState>()(() => ({
  user: null,
  isReady: false,
}));

const hasStoredSession = () => {
  try {
    return Object.keys(localStorage).some((key) => SESSION_KEY.test(key));
  } catch {
    return false;
  }
};

const hasAuthRedirect = () =>
  new URLSearchParams(window.location.search).has('code');

const whenIdle = (task: () => void) => {
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(task, { timeout: IDLE_TIMEOUT });
  } else {
    setTimeout(task, 1);
  }
};

export const startAuth = () => {
  if (isStarted || !isSupabaseConfigured) {
    return;
  }

  isStarted = true;
  startUserSync();

  onAuthChange((user) => {
    useAuthStore.setState({ user, isReady: true });
    setTimeout(() => {
      void syncUser(user);
      void syncProfile(user);
    }, 0);
  }).catch(() => {
    isStarted = false;
    useAuthStore.setState({ isReady: true });
  });
};

export const initAuth = () => {
  if (isSupabaseConfigured && hasAuthRedirect()) {
    startAuth();

    return;
  }

  if (!isSupabaseConfigured || !hasStoredSession()) {
    useAuthStore.setState({ isReady: true });

    return;
  }

  whenIdle(startAuth);
};
