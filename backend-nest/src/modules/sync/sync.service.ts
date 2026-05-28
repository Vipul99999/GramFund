import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';

@Injectable()
export class SyncService {
  constructor(private readonly prisma: PrismaService) {}

  async replay(deviceId: string, events: Array<{ eventId: string; aggregateType: string; aggregateId: string; eventType: string; payload: object; occurredAt: string; sequenceNo: number }>) {
    const applied: string[] = []; const parked: string[] = [];
    for (const event of events.sort((a,b)=>a.sequenceNo-b.sequenceNo)) {
      const exists = await this.prisma.syncEvent.findUnique({ where: { eventId: event.eventId } });
      if (exists) continue;
      const last = await this.prisma.financialEvent.findFirst({ where: { aggregateType: event.aggregateType, aggregateId: event.aggregateId }, orderBy: { sequenceNo: 'desc' } });
      const expected = (last?.sequenceNo ?? 0) + 1;
      if (event.sequenceNo !== expected) {
        await this.prisma.syncConflict.create({ data: { deviceId, eventId: event.eventId, reason: `OUT_OF_ORDER expected ${expected} got ${event.sequenceNo}` } });
        parked.push(event.eventId);
        continue;
      }
      await this.prisma.syncEvent.create({ data: { ...event, deviceId, occurredAt: new Date(event.occurredAt) } });
      await this.prisma.financialEvent.create({ data: { aggregateType: event.aggregateType, aggregateId: event.aggregateId, eventType: event.eventType, payload: event.payload, sequenceNo: event.sequenceNo } });
      applied.push(event.eventId);
    }
    return { appliedCount: applied.length, applied, parkedCount: parked.length, parked };
  }

  report(deviceId: string) {
    return this.prisma.syncConflict.findMany({ where: { deviceId }, orderBy: { createdAt: 'desc' } });
  }
}
