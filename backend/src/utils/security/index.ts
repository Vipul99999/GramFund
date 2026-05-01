import crypto from 'node:crypto';
export const hashPassword = (value: string) => crypto.createHash('sha256').update(value).digest('hex');
export const compareHash = (value: string, hash: string) => hashPassword(value) === hash;
export const validatePhone = (phone: string) => /^[6-9]\d{9}$/.test(phone);
export const sanitizeInput = (input: string) => input.trim().replace(/[<>]/g, '');
