'use client';
import { lazy, Suspense } from 'react';
import { LoginCard } from '../components/auth/LoginCard';
import { RoleGate } from '../components/common/RoleGate';
import { OperatorWorkflows } from '../components/operator/OperatorWorkflows';
import { OfflinePanel } from '../components/offline/OfflinePanel';
import { AuditTimeline } from '../components/audit/AuditTimeline';
import { useLanguage } from '../i18n/LanguageContext';
const Overview = lazy(async () => ({ default: (await import('../components/dashboard/Overview')).Overview }));

export default function HomePage() {
  const { t } = useLanguage();
  return (
    <main id="main-content" className="mx-auto grid max-w-6xl gap-6 p-4 md:grid-cols-[380px_1fr]">
      <LoginCard />
      <section>
        <h1 className="mb-3 text-2xl font-bold">{t('dashboard')}</h1>
        <p className="mb-4 text-sm text-slate-600">Secure, auditable, resilient operations for community finance.</p>
        <Suspense fallback={<div className="rounded-xl border bg-white p-4">Loading dashboard module...</div>}>
          <Overview />
        </Suspense>
        <div className="mt-4"><OfflinePanel /></div>
        <div className="mt-4"><AuditTimeline /></div>
        <div className="mt-5">
          <RoleGate roles={['ADMIN','HANDLER','COMMUNITY_ADMIN']}>
            <OperatorWorkflows />
          </RoleGate>
        </div>
      </section>
    </main>
  );
}
