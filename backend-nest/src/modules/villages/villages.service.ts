import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';

@Injectable()
export class VillagesService {
  constructor(private readonly prisma: PrismaService) {}
  list() { return this.prisma.village.findMany({ where: { isActive: true } }); }
}
