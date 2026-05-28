import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';

@Injectable()
export class AuditService {
  constructor(private readonly prisma: PrismaService) {}
  list() { return this.prisma.auditLog.findMany({ orderBy: { createdAt: 'desc' }, take: 100 }); }
}
