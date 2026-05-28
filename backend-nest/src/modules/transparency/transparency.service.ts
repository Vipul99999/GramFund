import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';

@Injectable()
export class TransparencyService {
  constructor(private readonly prisma: PrismaService) {}

  async communityWall(villageId: string) {
    const tx = await this.prisma.transaction.aggregate({ _sum: { amount: true } });
    const settlements = await this.prisma.settlement.aggregate({ _sum: { pendingAmount: true } });
    const families = await this.prisma.family.count({ where: { villageId } });
    return { villageId, totalCollected: tx._sum.amount ?? 0, totalFamilies: families, pendingSettlements: settlements._sum.pendingAmount ?? 0 };
  }
}
