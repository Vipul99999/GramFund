import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GovernanceService } from './governance.service';

@ApiTags('governance')
@Controller({ path: 'governance', version: '1' })
export class GovernanceController {
  constructor(private readonly service: GovernanceService) {}
  @Post('daily-cash-close') daily(@Body() body: { handlerId: string; actualCash: number }) { return this.service.dailyCashClose(body.handlerId, body.actualCash); }
  @Post('period-close') period(@Body() body: { periodKey: string; approverIds: string[] }) { return this.service.closeLedgerPeriod(body.periodKey, body.approverIds); }
  @Post('succession-approve') succession(@Body() body: { entityId: string; successorId: string; approverIds: string[] }) { return this.service.successionApproval(body.entityId, body.successorId, body.approverIds); }
  @Post('sla-run') sla(@Body() body: { localHour?: number; varianceThreshold?: number }) { return this.service.enforceSlaAndEscalations(body.localHour, body.varianceThreshold); }
}
