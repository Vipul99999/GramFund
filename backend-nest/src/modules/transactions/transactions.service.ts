import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { CreateTransactionDto } from './dto';

@Injectable()
export class TransactionsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateTransactionDto, actorUserId: string) {
    return this.prisma.$transaction(async (tx) => {
      const existing = await tx.transaction.findUnique({ where: { idempotencyKey: dto.idempotencyKey } });
      if (existing) {
        throw new ConflictException('Duplicate idempotency key');
      }

      const created = await tx.transaction.create({
        data: {
          familyId: dto.familyId,
          handlerId: dto.handlerId,
          eventId: dto.eventId,
          amount: dto.amount,
          idempotencyKey: dto.idempotencyKey,
          createdByUserId: actorUserId
        }
      });

      await tx.ledgerEntry.createMany({
        data: [
          { transactionId: created.id, familyId: dto.familyId, direction: 'DEBIT', amount: dto.amount },
          { transactionId: created.id, familyId: dto.familyId, direction: 'CREDIT', amount: dto.amount }
        ]
      });

      await tx.auditLog.create({ data: { actorUserId, action: 'TRANSACTION_CREATED', entityType: 'Transaction', entityId: created.id } });

      return created;
    });
  }
}
