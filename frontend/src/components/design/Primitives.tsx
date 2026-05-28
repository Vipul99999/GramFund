import { InputHTMLAttributes } from 'react';

export const Card = ({ children }: { children: React.ReactNode }) => <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">{children}</div>;
export const Button = ({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => <button {...props} className={`rounded-lg px-4 py-2 ${props.className || 'bg-slate-900 text-white'}`}>{children}</button>;
export const TextInput = (props: InputHTMLAttributes<HTMLInputElement>) => <input {...props} className={`w-full rounded-lg border p-2 ${props.className || ''}`} />;
export const StatusPill = ({ tone='neutral', children }: { tone?: 'neutral'|'good'|'warn'|'bad'; children: React.ReactNode }) => {
  const cls = tone==='good'?'bg-green-100 text-green-900':tone==='warn'?'bg-amber-100 text-amber-900':tone==='bad'?'bg-red-100 text-red-900':'bg-slate-100 text-slate-800';
  return <span className={`rounded-full px-2 py-1 text-xs ${cls}`}>{children}</span>;
};
