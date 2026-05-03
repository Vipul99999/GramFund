export function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="card" style={{ border: '1px solid #e2e8f0', borderRadius: 12, padding: 16, marginBottom: 12 }}><h3>{title}</h3>{children}</section>;
}
