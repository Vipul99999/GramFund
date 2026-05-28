import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { LEGAL_MODULE_KEY } from './decorators/legal-module.decorator';

@Injectable()
export class LegalAcceptanceGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService, private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const userId = req.user?.sub;
    if (!userId) throw new ForbiddenException('Authenticated user required');
    const policy = this.reflector.getAllAndOverride<{ module: string; version: string }>(LEGAL_MODULE_KEY, [context.getHandler(), context.getClass()]);
    if (!policy) return true;
    const accepted = await this.prisma.legalDisclaimerAcceptance.findFirst({ where: { userId, module: policy.module, version: policy.version } });
    await this.prisma.auditLog.create({ data: { actorUserId: userId, action: accepted ? 'LEGAL_ACCEPTANCE_CHECK_PASS' : 'LEGAL_ACCEPTANCE_CHECK_FAIL', entityType: 'LegalDisclaimerAcceptance', entityId: `${policy.module}:${policy.version}` } });
    if (!accepted) throw new ForbiddenException('Legal disclaimer not accepted');
    return true;
  }
}
