import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { CreateTransactionDto } from './dto';

@Injectable()
export class TransactionsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateTransactionDto, actorUserId: string) {
    return this.prisma.$transaction(async (tx) => {
      const existing = await tx.transaction.findUnique({ where: { idempotencyKey: dto.idempotencyKey } });
      if (existing) throw new ConflictException('Duplicate idempotency key');

      const handler = await tx.handler.findUnique({ where: { id: dto.handlerId } });
      if (!handler) throw new BadRequestException('Invalid handler');

      const start = new Date();
      start.setUTCHours(0, 0, 0, 0);
      const end = new Date(start);
      end.setUTCDate(end.getUTCDate() + 1);
      const agg = await tx.transaction.aggregate({
        where: { handlerId: dto.handlerId, createdAt: { gte: start, lt: end } },
        _sum: { amount: true }
      });
      const currentDaily = Number(agg._sum.amount ?? 0);
      if (currentDaily + dto.amount > Number(handler.dailyLimitAmount)) {
        throw new BadRequestException('Handler daily exposure limit exceeded');
      }

      const created = await tx.transaction.create({
        data: {
          familyId: dto.familyId,
          handlerId: dto.handlerId,
          eventId: dto.eventId,
          amount: dto.amount,
          idempotencyKey: dto.idempotencyKey,
          createdByUserId: actorUserId,
          note: dto.note,
          riskSnapshot: { trustScore: handler.trustScore, dailyLimitAmount: handler.dailyLimitAmount.toString() }
        }
      });

      await tx.ledgerEntry.createMany({
        data: [
          { transactionId: created.id, familyId: dto.familyId, direction: 'DEBIT', amount: dto.amount },
          { transactionId: created.id, familyId: dto.familyId, direction: 'CREDIT', amount: dto.amount }
        ]
      });

      if (dto.witnesses?.length) {
        await tx.transactionWitness.createMany({
          data: dto.witnesses.map((w) => ({ transactionId: created.id, witnessName: w.name, witnessPhone: w.phone }))
        });
      }

      await tx.auditLog.create({ data: { actorUserId, action: 'TRANSACTION_CREATED', entityType: 'Transaction', entityId: created.id } });
      await tx.financialEvent.create({ data: { aggregateType: 'TRANSACTION', aggregateId: created.id, eventType: 'TransactionCreated', payload: created as unknown as object } });

      return created;
    });
  }
}
