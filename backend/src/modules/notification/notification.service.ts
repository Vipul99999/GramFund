import { prisma } from '../../lib/prisma.js';
import { NotificationChannel, NotificationPriority } from '../../jobs/contracts.js';

const statusForFinalChannel = (channel: NotificationChannel) => channel === 'MANUAL' ? 'NEEDS_MANUAL' : 'SENT';

export class NotificationService {
  list() { return prisma.notification.findMany({ orderBy: { createdAt: 'desc' } }); }

  async listManualPending(hours = 24) {
    const cutoff = new Date(Date.now() - hours * 60 * 60 * 1000);
    return prisma.notification.findMany({ where: { status: 'NEEDS_MANUAL', createdAt: { lte: cutoff } }, orderBy: { createdAt: 'asc' } });
  }

  async create(input: { userId: string; familyId: string; eventId?: string; to: string; message: string; priority: NotificationPriority }) {
    return prisma.notification.create({
      data: {
        familyId: input.familyId,
        eventId: input.eventId,
        type: `PRIORITY_${input.priority}`,
        channel: 'IN_APP',
        status: 'PENDING',
        payload: { userId: input.userId, to: input.to, message: input.message, priority: input.priority }
      }
    });
  }

  async createDelivery(input: { notificationId: string; channel: NotificationChannel; status: 'SENT' | 'FAILED'; retryCount: number; error?: string }) {
    return prisma.notificationDelivery.create({ data: input });
  }

  async setFinalState(notificationId: string, channel: NotificationChannel, retryCount: number, payload: Record<string, unknown>, error?: string) {
    return prisma.notification.update({ where: { id: notificationId }, data: { channel, status: statusForFinalChannel(channel), retryCount, manualConfirmed: channel === 'MANUAL' ? false : undefined, payload: { ...payload, error }, sentAt: channel === 'MANUAL' ? null : new Date() } });
  }

  async confirmManual(notificationId: string) {
    return prisma.notification.update({ where: { id: notificationId }, data: { manualConfirmed: true, status: 'SENT', sentAt: new Date() } });
  }
}
