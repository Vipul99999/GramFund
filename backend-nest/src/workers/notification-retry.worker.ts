import { PrismaService } from '../infrastructure/prisma/prisma.service';
import { NotificationsService } from '../modules/notifications/notifications.service';

export async function runNotificationRetryWorker(prisma: PrismaService, notifications: NotificationsService) {
  const failed = await prisma.notificationDelivery.findMany({ where: { status: 'FAILED', deadLetteredAt: { not: null } }, take: 100 });
  for (const f of failed) {
    await notifications.processFallback(f.userId, f.title, f.body);
  }
  return { retried: failed.length };
}
