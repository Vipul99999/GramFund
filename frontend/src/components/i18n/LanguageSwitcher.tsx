'use client';

import { useLanguage } from '../../i18n/LanguageContext';

export function LanguageSwitcher() {
  const { locale, setLocale, t } = useLanguage();
  return (
    <label style={{ display: 'inline-flex', gap: 8, alignItems: 'center' }}>
      {t('chooseLanguage')}:
      <select value={locale} onChange={(e) => setLocale(e.target.value as 'en' | 'hi')}>
        <option value="en">English</option>
        <option value="hi">हिन्दी</option>
      </select>
    </label>
  );
}
