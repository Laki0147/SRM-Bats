/**
 * Preferences Store
 * Manages user preferences like currency, language, theme
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

export type Currency = 'USD' | 'EUR' | 'GBP' | 'INR' | 'AUD';
export type Language = 'en' | 'es' | 'fr' | 'de' | 'hi';
export type Theme = 'light' | 'dark' | 'system';

export interface PreferencesState {
  // State
  currency: Currency;
  language: Language;
  theme: Theme;
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
    marketing: boolean;
  };
  display: {
    gridView: boolean; // true = grid, false = list
    itemsPerPage: number;
    showPrices: boolean;
  };

  // Actions
  setCurrency: (currency: Currency) => void;
  setLanguage: (language: Language) => void;
  setTheme: (theme: Theme) => void;
  updateNotifications: (updates: Partial<PreferencesState['notifications']>) => void;
  updateDisplay: (updates: Partial<PreferencesState['display']>) => void;
  reset: () => void;
}

const defaultPreferences = {
  currency: 'USD' as Currency,
  language: 'en' as Language,
  theme: 'system' as Theme,
  notifications: {
    email: true,
    sms: false,
    push: true,
    marketing: false,
  },
  display: {
    gridView: true,
    itemsPerPage: 24,
    showPrices: true,
  },
};

export const usePreferencesStore = create<PreferencesState>()()
  devtools(
    persist(
      immer((set) => ({
        ...defaultPreferences,

        setCurrency: (currency) =>
          set((state) => {
            state.currency = currency;
          }),

        setLanguage: (language) =>
          set((state) => {
            state.language = language;
          }),

        setTheme: (theme) =>
          set((state) => {
            state.theme = theme;
          }),

        updateNotifications: (updates) =>
          set((state) => {
            state.notifications = { ...state.notifications, ...updates };
          }),

        updateDisplay: (updates) =>
          set((state) => {
            state.display = { ...state.display, ...updates };
          }),

        reset: () => set(defaultPreferences),
      })),
      {
        name: 'preferences-storage',
      }
    ),
    { name: 'PreferencesStore' }
  );
