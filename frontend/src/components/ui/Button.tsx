import { ButtonHTMLAttributes } from 'react';

export function Button(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button {...props} style={{ padding: '0.6rem 1rem', borderRadius: 8, border: '1px solid #cbd5e1', background: '#0f172a', color: '#fff' }} />;
}
