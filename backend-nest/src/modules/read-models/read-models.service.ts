import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';

@Injectable()
export class ReadModelsService {
  constructor(private readonly prisma: PrismaService) {}

  async projectFinancialEvents(limit = 500) {
    const checkpoint = await this.prisma.projectorCheckpoint.upsert({ where: { projectorName: 'finance_projector' }, create: { projectorName: 'finance_projector', lastSequence: 0 }, update: {} });
    const events = await this.prisma.financialEvent.findMany({ where: { sequenceNo: { gt: checkpoint.lastSequence } }, orderBy: { sequenceNo: 'asc' }, take: limit });
    let maxSeq = checkpoint.lastSequence;
    for (const ev of events) {
      const token = `finance_projector:${ev.id}`;
      const exists = await this.prisma.projectionLog.findUnique({ where: { idempotencyToken: token } });
      if (exists) continue;
      if (ev.aggregateType === 'TRANSACTION' && ev.eventType === 'TransactionCreated') {
        const tx = await this.prisma.transaction.findUnique({ where: { id: ev.aggregateId } });
        if (!tx) continue;
        await this.prisma.familyStatementReadModel.upsert({ where: { familyId: tx.familyId }, create: { familyId: tx.familyId, totalGiven: tx.amount, totalReceived: 0, netBalance: tx.amount }, update: { totalGiven: { increment: tx.amount }, netBalance: { increment: tx.amount } } });
        await this.prisma.handlerExposureReadModel.upsert({ where: { handlerId: tx.handlerId }, create: { handlerId: tx.handlerId, totalCollected: tx.amount, pendingSettlement: tx.amount }, update: { totalCollected: { increment: tx.amount }, pendingSettlement: { increment: tx.amount } } });
      }
      await this.prisma.projectionLog.create({ data: { projectorName: 'finance_projector', idempotencyToken: token, aggregateType: ev.aggregateType, aggregateId: ev.aggregateId } });
      maxSeq = Math.max(maxSeq, ev.sequenceNo);
    }
    await this.prisma.projectorCheckpoint.update({ where: { projectorName: 'finance_projector' }, data: { lastSequence: maxSeq, lastEventAt: new Date() } });
    return { projected: events.length, lastSequence: maxSeq };
  }

  familyStatement(familyId: string) { return this.prisma.familyStatementReadModel.findUnique({ where: { familyId } }); }
  handlerExposure(handlerId: string) { return this.prisma.handlerExposureReadModel.findUnique({ where: { handlerId } }); }
  villageTrust(villageId: string) { return this.prisma.villageTrustReadModel.findUnique({ where: { villageId } }); }
  fraudDashboard() { return this.prisma.fraudAlert.groupBy({ by: ['severity'], _count: { _all: true } }); }
}
