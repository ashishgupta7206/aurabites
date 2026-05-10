export const KEYRING_STORAGE_KEY = 'aurabites-keyring-name';

export const sanitizeKeyringName = (value: string) =>
  value.replace(/[^a-zA-Z0-9 ]/g, '').replace(/\s+/g, ' ').trim().slice(0, 10);
