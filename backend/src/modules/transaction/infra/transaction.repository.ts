import { prisma } from '../../../lib/prisma.js';
import { TransactionEntity } from '../domain/transaction.entity.js';

export class TransactionRepository {
  async create(tx: TransactionEntity): Promise<TransactionEntity> {
    await prisma.transaction.create({ data: tx as unknown as Record<string, unknown> });
    return tx;
  }

  async findById(id: string): Promise<TransactionEntity | null> {
    const row = await prisma.transaction.findUnique({ where: { id } });
    return (row as TransactionEntity | null) ?? null;
  }

  async findByIdempotencyKey(idempotencyKey: string): Promise<TransactionEntity | null> {
    const row = await prisma.transaction.findUnique({ where: { idempotencyKey } });
    return (row as TransactionEntity | null) ?? null;
  }
}
