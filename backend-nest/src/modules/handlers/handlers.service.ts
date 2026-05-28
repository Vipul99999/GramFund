import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';

@Injectable()
export class HandlersService {
  constructor(private readonly prisma: PrismaService) {}
  list() { return this.prisma.handler.findMany(); }
}
