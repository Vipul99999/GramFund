import Link from 'next/link';

const stats = [
  { label: 'Today Collected', value: '₹0', tone: 'good' },
  { label: 'Today Delivered', value: '₹0', tone: 'good' },
  { label: 'Pending', value: '₹0', tone: 'fair' }
] as const;

export default function Page() {
  return (
    <main>
      <section className="card" style={{ padding: 16, borderRadius: 12, border: '1px solid #e2e8f0' }}>
        <h1 style={{ marginTop: 0 }}>Handler Dashboard</h1>
        <p style={{ marginTop: 0, color: '#475569' }}>Mobile-first summary for today’s money flow and quick actions.</p>

        <div className="stats-grid">
          {stats.map((s) => (
            <article key={s.label} className={`mini-stat ${s.tone}`}>
              <p>{s.label}</p>
              <strong>{s.value}</strong>
            </article>
          ))}
        </div>

        <div className="quick-actions">
          <Link className="quick-link" href="/handler/payments">Collect / Record Payment</Link>
          <Link className="quick-link" href="/offline/queue-status">Offline Queue Status</Link>
          <Link className="quick-link" href="/offline/conflicts">Resolve Sync Conflicts</Link>
        </div>
      </section>
    </main>
  );
}
