import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';

@Injectable()
export class AssistedService {
  constructor(private readonly prisma: PrismaService) {}
  createAssistedProfile(familyId: string, operatorUserId: string, contactPhone?: string) {
    return this.prisma.assistedAccount.upsert({
      where: { familyId },
      create: { familyId, operatorUserId, contactPhone, mode: 'ASSISTED' },
      update: { operatorUserId, contactPhone, mode: 'ASSISTED' }
    });
  }
}
