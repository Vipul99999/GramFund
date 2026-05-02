'use client';

import { useLanguage } from '../../i18n/LanguageContext';

export default function AboutPage() {
  const { t } = useLanguage();
  return (
    <main style={{ maxWidth: 860, margin: '2rem auto', padding: '0 1rem' }}>
      <h1>{t('about')}</h1>
      <p>
        GramFund is a ledger-first financial platform built for transparent contribution collection,
        controlled disbursement, and reliable reconciliation.
      </p>

      <h2>{t('financialPolicy')}</h2>
      <p>
        GramFund enforces strict anti-fraud and anti-abuse expectations. Prohibited uses include
        money laundering, sanctioned activity, identity misuse, and deliberate replay attacks.
      </p>
    </main>
  );
}
