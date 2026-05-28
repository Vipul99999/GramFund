import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { createHash } from 'crypto';

@Injectable()
export class ReceiptsService {
  constructor(private readonly prisma: PrismaService) {}

  async generate(transactionId: string) {
    const tx = await this.prisma.transaction.findUnique({ where: { id: transactionId } });
    if (!tx) throw new Error('Transaction not found');
    const verificationToken = createHash('sha256').update(`${tx.id}|${tx.idempotencyKey}|${tx.createdAt.toISOString()}`).digest('hex');
    const receiptNumber = `GF-${tx.createdAt.getUTCFullYear()}-${tx.id.slice(0, 8).toUpperCase()}`;
    return {
      receiptNumber,
      qrPayload: JSON.stringify({ type: 'GRAMFUND_RECEIPT', transactionId: tx.id, verificationToken }),
      pdfTemplate: { receiptNumber, amount: tx.amount, createdAt: tx.createdAt, transactionId: tx.id },
      thermalTemplate: `Receipt ${receiptNumber}\nAmount: ${tx.amount}\nTx: ${tx.id}`,
      whatsappText: `GramFund Receipt ${receiptNumber} Amount ${tx.amount}`
    };
  }
}
