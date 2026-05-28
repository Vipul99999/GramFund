import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';

@Injectable()
export class GovernanceService {
  constructor(private readonly prisma: PrismaService) {}

  async dailyCashClose(handlerId: string, actualCash: number) {
    const today = new Date(); today.setUTCHours(0,0,0,0);
    const txAgg = await this.prisma.transaction.aggregate({ where: { handlerId, createdAt: { gte: today } }, _sum: { amount: true } });
    const setAgg = await this.prisma.settlement.aggregate({ where: { handlerId, createdAt: { gte: today } }, _sum: { deliveredAmount: true } });
    const collections = Number(txAgg._sum.amount ?? 0); const settlements = Number(setAgg._sum.deliveredAmount ?? 0);
    const expected = collections - settlements; const variance = actualCash - expected;
    return this.prisma.cashClosing.upsert({
      where: { handlerId_closingDate: { handlerId, closingDate: today } },
      create: { handlerId, closingDate: today, openingBalance: 0, totalCollections: collections, totalSettlements: settlements, expectedCash: expected, actualCash, variance },
      update: { totalCollections: collections, totalSettlements: settlements, expectedCash: expected, actualCash, variance }
    });
  }

  async closeLedgerPeriod(periodKey: string, approverIds: string[]) {
    if (approverIds.length < 2) throw new BadRequestException('At least 2 approvers required');
    return this.prisma.ledgerPeriod.upsert({ where: { periodKey }, create: { periodKey, status: 'CLOSED', closedBy: approverIds.join(','), closedAt: new Date() }, update: { status: 'CLOSED', closedBy: approverIds.join(','), closedAt: new Date() } });
  }

  async successionApproval(entityId: string, successorId: string, approverIds: string[]) {
    if (approverIds.length < 2) throw new BadRequestException('At least 2 approvers required');
    return this.prisma.successionWorkflow.create({ data: { entityType: 'FAMILY', entityId, successorId, approvedBy: approverIds.join(','), status: 'APPROVED' } });
  }

  async enforceSlaAndEscalations(localHour = 21, varianceThreshold = 1000) {
    const now = new Date();
    const today = new Date(); today.setUTCHours(0,0,0,0);
    if (now.getUTCHours() < localHour) return { checked: false, reason: 'Before SLA cutoff' };

    const handlers = await this.prisma.handler.findMany();
    const missing: string[] = [];
    const highVariance: string[] = [];

    for (const h of handlers) {
      const close = await this.prisma.cashClosing.findUnique({ where: { handlerId_closingDate: { handlerId: h.id, closingDate: today } } });
      if (!close) {
        missing.push(h.id);
        await this.prisma.handler.update({ where: { id: h.id }, data: { riskLevel: 'HIGH', dailyLimitAmount: Number(h.dailyLimitAmount) > 5000 ? 5000 : h.dailyLimitAmount } });
        await this.prisma.fraudAlert.create({ data: { type: 'MISSING_CASH_CLOSE', severity: 'HIGH', subjectType: 'Handler', subjectId: h.id, message: 'Cash close missing after SLA cutoff' } });
        continue;
      }
      if (Math.abs(Number(close.variance)) > varianceThreshold) {
        highVariance.push(h.id);
        await this.prisma.handler.update({ where: { id: h.id }, data: { riskLevel: 'HIGH', dailyLimitAmount: 2000 } });
        await this.prisma.fraudAlert.create({ data: { type: 'HIGH_VARIANCE', severity: 'CRITICAL', subjectType: 'Handler', subjectId: h.id, message: `Variance ${close.variance} exceeds threshold ${varianceThreshold}` } });
      }
    }

    return { checked: true, missingCashCloseHandlers: missing, highVarianceHandlers: highVariance };
  }

  async assertPeriodOpenOrThrow(periodKey: string) {
    const period = await this.prisma.ledgerPeriod.findUnique({ where: { periodKey } });
    if (period?.status === 'CLOSED') throw new BadRequestException(`Ledger period ${periodKey} is closed and locked`);
  }
}
