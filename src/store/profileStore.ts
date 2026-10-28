import { create } from 'zustand';

import { fetchProfile, upsertProfile } from '@/services';

import type { AuthUser, UserProfile } from '@/types';

interface ProfileState {
  profile: UserProfile | null;
}

export const useProfileStore = create<ProfileState>()(() => ({
  profile: null,
}));

let activeUserId: string | null = null;

export const syncProfile = async (user: AuthUser | null) => {
  if (!user) {
    activeUserId = null;
    useProfileStore.setState({ profile: null });

    return;
  }

  if (activeUserId === user.id) {
    return;
  }

  activeUserId = user.id;

  try {
    const profile = await fetchProfile();

    if (activeUserId === user.id) {
      useProfileStore.setState({ profile });
    }
  } catch {
    if (activeUserId === user.id) {
      activeUserId = null;
    }
  }
};

export const rememberProfile = async (profile: UserProfile) => {
  if (!activeUserId) {
    return;
  }

  useProfileStore.setState({ profile });

  try {
    await upsertProfile(profile);
  } catch {
    return;
  }
};
