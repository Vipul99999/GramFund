'use client';

import { createContext, useContext, useMemo, useState } from 'react';
import { Locale, messages } from './translations';

const LangContext = createContext<{ locale: Locale; t: (k: keyof typeof messages.en) => string; setLocale: (l: Locale) => void } | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>('en');
  const value = useMemo(() => ({ locale, setLocale, t: (k: keyof typeof messages.en) => messages[locale][k] }), [locale]);
  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
