import { Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SecurityService } from './security.service';

@ApiTags('security')
@Controller({ path: 'security', version: '1' })
export class SecurityController {
  constructor(private readonly service: SecurityService) {}
  @Get('secrets-audit') secrets() { return this.service.auditSecretsPolicy(); }
  @Post('encrypt-family-phones') encryptPhones() { return this.service.encryptFamilyPhones(); }
  @Get('zero-trust-audit') zeroTrust() { return this.service.zeroTrustAccessAudit(); }
}
