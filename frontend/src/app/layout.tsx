import '../styles/globals.css';
import { ReactNode } from 'react';
import { LanguageProvider } from '../i18n/LanguageContext';
import { LanguageSwitcher } from '../components/i18n/LanguageSwitcher';
import type { Metadata } from 'next';
import { AuthProvider } from '../contexts/AuthContext';
import { PwaRegistrar } from '../components/common/PwaRegistrar';

export const metadata: Metadata = {
  title: 'GramFund CFOS',
  description: 'Community Finance Operating System with transparent record-only money tracking',
  keywords: ['community finance', 'GramFund', 'ledger', 'village finance', 'SHG'],
  openGraph: { title: 'GramFund CFOS', description: 'Transparent community finance operations', images: ['/logo.svg'] },
  icons: { icon: '/icon.svg', apple: '/icon.svg' }
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return <html lang="en"><body className="bg-slate-50 text-slate-900"><a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:rounded focus:bg-white focus:p-2">Skip to content</a><LanguageProvider><AuthProvider><PwaRegistrar /><header className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 backdrop-blur"><div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3"><nav aria-label="Primary" className="flex items-center gap-3"><img src="/logo.svg" alt="GramFund logo" className="h-8 w-8" /><span className="font-semibold">GramFund</span><a href="/trust" className="text-sm text-slate-600 hover:text-slate-900">Trust</a><a href="/security" className="text-sm text-slate-600 hover:text-slate-900">Security</a><a href="/compliance" className="text-sm text-slate-600 hover:text-slate-900">Compliance</a></nav><LanguageSwitcher /></div></header>{children}</AuthProvider></LanguageProvider></body></html>;
}
