import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';

@Injectable()
export class PeriodCloseService {
  constructor(private readonly prisma: PrismaService) {}
  closePeriod(periodKey: string, closedBy: string) {
    return this.prisma.ledgerPeriod.upsert({ where: { periodKey }, create: { periodKey, status: 'CLOSED', closedBy, closedAt: new Date() }, update: { status: 'CLOSED', closedBy, closedAt: new Date() } });
  }
}
