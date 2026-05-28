import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';

@Injectable()
export class FraudService {
  constructor(private readonly prisma: PrismaService) {}
  listAlerts() { return this.prisma.fraudAlert.findMany({ orderBy: { createdAt: 'desc' } }); }
}
