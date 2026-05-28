import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { CreateTransactionDto } from './dto';

@Injectable()
export class TransactionsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateTransactionDto, actorUserId: string) {
    return this.prisma.$transaction(async (tx) => {
      const periodKey = new Date().toISOString().slice(0, 7);
      const period = await tx.ledgerPeriod.findUnique({ where: { periodKey } });
      if (period?.status === 'CLOSED') throw new BadRequestException(`Ledger period ${periodKey} is locked`);

      const existing = await tx.transaction.findUnique({ where: { idempotencyKey: dto.idempotencyKey } });
      if (existing) throw new ConflictException('Duplicate idempotency key');

      const handler = await tx.handler.findUnique({ where: { id: dto.handlerId } });
      if (!handler) throw new BadRequestException('Invalid handler');

      const policy = await tx.approvalPolicy.findFirst({ where: { isActive: true }, orderBy: { thresholdAmount: 'asc' } });
      const threshold = Number(policy?.thresholdAmount ?? 10000);
      const minWitness = policy?.minWitnessCount ?? 0;
      if (dto.amount >= threshold && (dto.witnesses?.length ?? 0) < minWitness) throw new BadRequestException(`At least ${minWitness} witnesses required`);

      const start = new Date(); start.setUTCHours(0,0,0,0); const end = new Date(start); end.setUTCDate(end.getUTCDate()+1);
      const agg = await tx.transaction.aggregate({ where: { handlerId: dto.handlerId, createdAt: { gte: start, lt: end } }, _sum: { amount: true } });
      if (Number(agg._sum.amount ?? 0) + dto.amount > Number(handler.dailyLimitAmount)) throw new BadRequestException('Handler daily exposure limit exceeded/frozen');

      const created = await tx.transaction.create({ data: { familyId: dto.familyId, handlerId: dto.handlerId, eventId: dto.eventId, amount: dto.amount, idempotencyKey: dto.idempotencyKey, createdByUserId: actorUserId, note: dto.note, riskSnapshot: { trustScore: handler.trustScore } } });
      await tx.ledgerEntry.createMany({ data: [{ transactionId: created.id, familyId: dto.familyId, direction: 'DEBIT', amount: dto.amount }, { transactionId: created.id, familyId: dto.familyId, direction: 'CREDIT', amount: dto.amount }]});
      if (dto.witnesses?.length) await tx.transactionWitness.createMany({ data: dto.witnesses.map((w) => ({ transactionId: created.id, witnessName: w.name, witnessPhone: w.phone })) });
      if (dto.amount >= threshold) await tx.multiPartyApproval.create({ data: { transactionId: created.id, thresholdAmount: threshold, status: 'PENDING' } });
      await tx.auditLog.create({ data: { actorUserId, action: 'TRANSACTION_CREATED', entityType: 'Transaction', entityId: created.id } });
      await tx.financialEvent.create({ data: { aggregateType: 'TRANSACTION', aggregateId: created.id, eventType: 'TransactionCreated', payload: created as unknown as object, sequenceNo: 1 } });
      return created;
    });
  }

  async finalize(transactionId: string) {
    const approval = await this.prisma.multiPartyApproval.findUnique({ where: { transactionId } });
    if (approval && approval.status !== 'APPROVED') throw new BadRequestException('Approval pending; cannot finalize transaction');
    return this.prisma.transaction.update({ where: { id: transactionId }, data: { status: 'POSTED' } });
  }
}
