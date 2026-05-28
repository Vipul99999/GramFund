import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuditService } from './audit.service';

@ApiTags('audit')
@Controller({ path: 'audit', version: '1' })
export class AuditController {
  constructor(private readonly service: AuditService) {}
  @Get('logs') list() { return this.service.list(); }
}
