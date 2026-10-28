import { normalizeColor } from '@/constants';
import { TRANSLATIONS } from '@/i18n';
import { useLanguageStore } from '@/store';

import type { Language } from '@/types';

const UAH_RATE = 40;

const UNIT_PATTERN = /(\d+(?:\.\d+)?)\s*(GB|TB|MB|mm|Mp)\b/gi;

const UNIT_KEYS: Record<string, string> = {
  gb: 'GB',
  tb: 'TB',
  mb: 'MB',
  mm: 'mm',
  mp: 'Mp',
};

export const getTranslations = (language: Language) => {
  const t = TRANSLATIONS[language];

  const formatColor = (color: string) =>
    t.colors[normalizeColor(color)] ?? color;

  const formatValue = (value: string) =>
    language === 'en' ? value : (
      value.replace(UNIT_PATTERN, (_, amount: string, unit: string) => {
        const translated = t.units[UNIT_KEYS[unit.toLowerCase()]];

        return `${amount} ${translated ?? unit}`;
      })
    );

  const formatPrice = (usd: number) =>
    language === 'ua' ?
      `${new Intl.NumberFormat('uk-UA').format(Math.round(usd * UAH_RATE))} грн`
    : `$${usd}`;

  return { t, language, formatColor, formatValue, formatPrice };
};

export const useTranslation = () => {
  const language = useLanguageStore((state) => state.language);

  return getTranslations(language);
};
