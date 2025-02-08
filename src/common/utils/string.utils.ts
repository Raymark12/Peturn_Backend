export const trim = (value: unknown): string | undefined => {
  if (typeof value !== 'string') return undefined;
  return value.trim();
};

export const capitalize = (value: unknown): string | undefined => {
  if (typeof value !== 'string') return undefined;
  return value
    .trim()
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

export const normalizePhone = (value: unknown): string | undefined => {
  if (typeof value !== 'string') return undefined;
  return value.trim().replace(/\s+/g, '');
};

