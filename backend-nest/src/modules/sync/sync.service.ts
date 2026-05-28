import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';

@Injectable()
export class SyncService {
  constructor(private readonly prisma: PrismaService) {}

  async replay(deviceId: string, events: Array<{ eventId: string; aggregateType: string; aggregateId: string; eventType: string; payload: object; occurredAt: string }>) {
    const applied: string[] = [];
    for (const event of events) {
      const exists = await this.prisma.syncEvent.findUnique({ where: { eventId: event.eventId } });
      if (exists) continue;
      await this.prisma.syncEvent.create({ data: { ...event, deviceId, occurredAt: new Date(event.occurredAt) } });
      await this.prisma.financialEvent.create({ data: { aggregateType: event.aggregateType, aggregateId: event.aggregateId, eventType: event.eventType, payload: event.payload } });
      applied.push(event.eventId);
    }
    return { appliedCount: applied.length, applied };
  }
}
