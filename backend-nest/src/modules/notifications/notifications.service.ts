import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { FcmProvider } from './providers/fcm.provider';
import { Msg91Provider } from './providers/msg91.provider';
import { WhatsappProvider } from './providers/whatsapp.provider';
import { IvrProvider } from './providers/ivr.provider';
import { createHmac, timingSafeEqual } from 'crypto';

@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService) {}
  private providers = [new FcmProvider(), new Msg91Provider(), new WhatsappProvider(), new IvrProvider()];

  async processFallback(userId: string, title: string, body: string) {
    const attempts: any[] = [];
    for (const provider of this.providers) {
      const delivery = await this.prisma.notificationDelivery.create({ data: { userId, title, body, channel: provider.channel, status: 'QUEUED', attemptCount: 0, nextRetryAt: new Date() } });
      const result = await provider.send(userId, title, body);
      const status = result.success ? 'SENT' : 'FAILED';
      const attemptCount = 1;
      const backoffMin = 5;
      const nextRetryAt = result.success ? null : new Date(Date.now() + backoffMin * 60 * 1000);
      const updated = await this.prisma.notificationDelivery.update({ where: { id: delivery.id }, data: { status, attemptCount, providerMessageId: result.providerMessageId, lastAttemptAt: new Date(), nextRetryAt, deadLetteredAt: result.success ? null : (attemptCount >= 3 ? new Date() : null) } });
      attempts.push(updated);
      if (result.success) break;
    }
    return attempts;
  }

  callback(deliveryId: string, status: 'DELIVERED' | 'FAILED', signature: string, rawPayload: string) {
    const secret = process.env.NOTIFICATION_WEBHOOK_SECRET as string;
    const expected = createHmac('sha256', secret).update(rawPayload).digest('hex');
    if (!timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) throw new Error('Invalid webhook signature');
    return this.prisma.notificationDelivery.update({ where: { id: deliveryId }, data: { status } });
  }
}
