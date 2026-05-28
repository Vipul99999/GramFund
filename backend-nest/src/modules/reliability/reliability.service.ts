import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';

@Injectable()
export class ReliabilityService {
  constructor(private readonly prisma: PrismaService) {}

  async healthSnapshot() {
    const failedDeliveries = await this.prisma.notificationDelivery.count({ where: { status: 'FAILED' } });
    const deadLetters = await this.prisma.notificationDelivery.count({ where: { deadLetteredAt: { not: null } } });
    const fraudAlerts24h = await this.prisma.fraudAlert.count({ where: { createdAt: { gte: new Date(Date.now() - 24*3600*1000) } } });
    return { failedDeliveries, deadLetters, fraudAlerts24h, checkedAt: new Date().toISOString() };
  }
}
