import { prisma } from '../../../lib/prisma.js';
import { hashPassword, verifyPassword } from './password.service.js';

export async function ensureUserByPhone(phone: string) {
  const existing = await prisma.user.findUnique({ where: { phone } });
  if (existing) return existing;
  return prisma.user.create({ data: { id: `user_${Date.now()}`, phone, role: 'USER' } });
}

export async function ensureUserByEmail(email: string, password?: string) {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return existing;
  return prisma.user.create({ data: { id: `user_${Date.now()}`, email, passwordHash: password ? hashPassword(password) : undefined, role: 'USER' } });
}

export async function loginWithEmail(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.passwordHash || !verifyPassword(password, user.passwordHash as string)) throw new Error('Invalid credentials');
  return user;
}
