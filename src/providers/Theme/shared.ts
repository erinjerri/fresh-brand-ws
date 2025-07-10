import type { Theme } from './types';
import canUseDOM from '@/utilities/canUseDOM';

export const themeLocalStorageKey = 'payload-theme';

export const defaultTheme = 'light';

export const getImplicitPreference = (): Theme | null => {
  if (!canUseDOM) return null;

  const mediaQuery = '(prefers-color-scheme: dark)';
  const mql = window.matchMedia(mediaQuery);
  const hasImplicitPreference = typeof mql.matches === 'boolean';

  if (hasImplicitPreference) {
    return mql.matches ? 'dark' : 'light';
  }

  return null;
};
