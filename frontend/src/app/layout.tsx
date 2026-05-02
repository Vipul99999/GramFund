import '../styles/globals.css';
import { ReactNode } from 'react';
import { LanguageProvider } from '../i18n/LanguageContext';
import { LanguageSwitcher } from '../components/i18n/LanguageSwitcher';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <LanguageProvider>
          <header style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #ddd' }}>
            <LanguageSwitcher />
          </header>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
