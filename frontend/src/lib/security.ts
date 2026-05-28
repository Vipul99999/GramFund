import DOMPurify from 'isomorphic-dompurify';

export const sanitizeText = (input: string) => DOMPurify.sanitize(input.trim());
export const isEmailOrPhone = (input: string) => /^(\+?[0-9]{10,15}|[^\s@]+@[^\s@]+\.[^\s@]+)$/.test(input);
