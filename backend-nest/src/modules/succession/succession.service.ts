import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';

@Injectable()
export class SuccessionService {
  constructor(private readonly prisma: PrismaService) {}
  transferFamilyControl(familyId: string, successorId: string, approvedBy: string) {
    return this.prisma.$transaction(async (tx) => {
      await tx.family.update({ where: { id: familyId }, data: { successorId } });
      return tx.successionWorkflow.create({ data: { entityType: 'FAMILY', entityId: familyId, successorId, approvedBy, status: 'APPROVED' } });
    });
  }
}
