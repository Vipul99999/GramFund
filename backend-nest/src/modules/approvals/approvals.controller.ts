import { Controller, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApprovalsService } from './approvals.service';

@ApiTags('approvals')
@Controller({ path: 'approvals', version: '1' })
export class ApprovalsController {
  constructor(private readonly service: ApprovalsService) {}
  @Post('transaction/:transactionId')
  create(@Param('transactionId') transactionId: string) { return this.service.createForTransaction(transactionId); }
}
