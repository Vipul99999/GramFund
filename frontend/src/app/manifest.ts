import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'GramFund CFOS',
    short_name: 'GramFund',
    start_url: '/',
    display: 'standalone',
    background_color: '#f8fafc',
    theme_color: '#0f172a',
    icons: [
      { src: '/icon.svg', sizes: '192x192', type: 'image/svg+xml' },
      { src: '/icon.svg', sizes: '512x512', type: 'image/svg+xml' }
    ]
  };
}
