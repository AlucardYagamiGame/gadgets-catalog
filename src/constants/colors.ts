export const PRODUCT_COLORS: Record<string, string> = {
  black: '#1f2020',
  blue: '#215e7c',
  coral: '#ee7762',
  gold: '#f9e5c9',
  graphite: '#41424c',
  green: '#aee1cd',
  midnight: '#171e27',
  midnightgreen: '#4e5851',
  pink: '#fae0d8',
  purple: '#d1cdda',
  red: '#ba0c2e',
  rosegold: '#e6c7c2',
  sierrablue: '#9bb5ce',
  silver: '#e3e4e5',
  skyblue: '#c7d8e5',
  spaceblack: '#403e3d',
  spacegray: '#535150',
  starlight: '#f9f3ee',
  white: '#f9f6ef',
  yellow: '#ffe681',
};

export const normalizeColor = (color: string) =>
  color.replace(/[\s-]/g, '').toLowerCase();

export const getColorHex = (color: string) =>
  PRODUCT_COLORS[normalizeColor(color)] ?? PRODUCT_COLORS.black;
