const rules = new Intl.PluralRules('uk');

export const pluralUa = (
  count: number,
  forms: { one: string; few: string; many: string },
) => {
  const category = rules.select(count);

  if (category === 'one') {
    return forms.one;
  }

  if (category === 'few') {
    return forms.few;
  }

  return forms.many;
};
