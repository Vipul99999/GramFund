import type { MetadataRoute } from 'next';
export default function sitemap(): MetadataRoute.Sitemap { const base='https://gramfund.app'; return ['','/trust','/security','/compliance','/no-money-held','/incident-policy'].map((p)=>({url:base+p,lastModified:new Date()})); }
