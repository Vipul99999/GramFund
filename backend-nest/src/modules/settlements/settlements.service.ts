import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';

@Injectable()
export class SettlementsService {
  constructor(private readonly prisma: PrismaService) {}
  list() { return this.prisma.settlement.findMany(); }
}
