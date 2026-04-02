import React, {
  createContext, useContext, useState,
  useEffect, useCallback, ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ── Palette definition ────────────────────────────────────────────────────

export interface ThemePalette {
  // Backgrounds
  bgBase:       string;   // root page background
  bgCard:       string;   // card / panel background
  bgInput:      string;   // text-input background
  bgMuted:      string;   // subtle chip / pill background
  bgSkeleton:   string;   // skeleton shimmer block

  // Borders
  borderCard:   string;
  borderInput:  string;
  borderSep:    string;   // list-row separator

  // Text
  textPrimary:  string;
  textSecondary:string;
  textMuted:    string;
  textLink:     string;   // accent / brand blue

  // Status-neutral surfaces (icon bg & icon colour stay the same in both themes)
  successBg:    string;
  successFg:    string;
  failedBg:     string;
  failedFg:     string;
  pendingBg:    string;
  pendingFg:    string;

  // Accent
  accent:       string;   // primary blue
  accentFg:     string;   // text on blue button

  // Notification badge dot background
  badgeBg:      string;
}

const DARK: ThemePalette = {
  bgBase:       '#0B1120',
  bgCard:       '#111C2E',
  bgInput:      '#0B1120',
  bgMuted:      '#1E2D45',
  bgSkeleton:   '#1E2D45',
  borderCard:   '#1A2640',
  borderInput:  '#1A2640',
  borderSep:    '#1A2640',
  textPrimary:  '#FFFFFF',
  textSecondary:'#E2E8F0',
  textMuted:    '#4A5568',
  textLink:     '#4F8EF7',
  successBg:    '#0D2E1B',
  successFg:    '#34D399',
  failedBg:     '#2E0D0D',
  failedFg:     '#F87171',
  pendingBg:    '#2E250D',
  pendingFg:    '#FBBF24',
  accent:       '#4F8EF7',
  accentFg:     '#FFFFFF',
  badgeBg:      '#F87171',
};

const LIGHT: ThemePalette = {
  bgBase:       '#F0F4FA',
  bgCard:       '#FFFFFF',
  bgInput:      '#F0F4FA',
  bgMuted:      '#E4EBF5',
  bgSkeleton:   '#D8E2EF',
  borderCard:   '#DDE5F2',
  borderInput:  '#DDE5F2',
  borderSep:    '#E5EAF2',
  textPrimary:  '#0D1321',
  textSecondary:'#1E293B',
  textMuted:    '#64748B',
  textLink:     '#2563EB',
  successBg:    '#D1FAE5',
  successFg:    '#059669',
  failedBg:     '#FEE2E2',
  failedFg:     '#DC2626',
  pendingBg:    '#FEF3C7',
  pendingFg:    '#D97706',
  accent:       '#2563EB',
  accentFg:     '#FFFFFF',
  badgeBg:      '#EF4444',
};

// ── Context shape ─────────────────────────────────────────────────────────

export type ThemeMode = 'dark' | 'light';

interface ThemeState {
  mode:   ThemeMode;
  colors: ThemePalette;
  isDark: boolean;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeState | undefined>(undefined);

const STORAGE_KEY = 'app_theme';

// ── Provider ──────────────────────────────────────────────────────────────

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>('dark');

  // Restore persisted preference on boot
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then(saved => {
      if (saved === 'light' || saved === 'dark') setMode(saved);
    });
  }, []);

  const toggle = useCallback(() => {
    setMode(prev => {
      const next: ThemeMode = prev === 'dark' ? 'light' : 'dark';
      AsyncStorage.setItem(STORAGE_KEY, next);
      return next;
    });
  }, []);

  const colors = mode === 'dark' ? DARK : LIGHT;

  return (
    <ThemeContext.Provider value={{ mode, colors, isDark: mode === 'dark', toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

// ── Hook ──────────────────────────────────────────────────────────────────

export function useTheme(): ThemeState {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside <ThemeProvider>');
  return ctx;
}
