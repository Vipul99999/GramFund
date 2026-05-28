import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';

@Injectable()
export class ApprovalsService {
  constructor(private readonly prisma: PrismaService) {}

  async createForTransaction(transactionId: string) {
    const tx = await this.prisma.transaction.findUnique({ where: { id: transactionId } });
    if (!tx) throw new BadRequestException('Transaction not found');
    const threshold = 10000;
    if (Number(tx.amount) < threshold) return { required: false, threshold };
    const approval = await this.prisma.multiPartyApproval.create({ data: { transactionId, thresholdAmount: threshold, status: 'PENDING' } });
    return { required: true, approval };
  }
}
