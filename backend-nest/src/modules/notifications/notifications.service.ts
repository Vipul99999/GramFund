import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';

@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService) {}
  async sendFallback(userId: string, title: string, body: string) {
    const channels = ['PUSH', 'SMS', 'WHATSAPP', 'IVR'];
    for (const channel of channels) {
      await this.prisma.notificationDelivery.create({ data: { userId, title, body, channel, status: 'QUEUED' } });
    }
    return { queuedChannels: channels };
  }
}
