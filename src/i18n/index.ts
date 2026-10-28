import { en } from './en';
import { ua } from './ua';

import type { Translations } from './en';
import type { Language } from '@/types';

export type { Translations };

export const TRANSLATIONS: Record<Language, Translations> = { en, ua };
