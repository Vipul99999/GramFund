import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ReceiptsService } from './receipts.service';

@ApiTags('receipts')
@Controller({ path: 'receipts', version: '1' })
export class ReceiptsController {
  constructor(private readonly service: ReceiptsService) {}
  @Get(':transactionId')
  generate(@Param('transactionId') transactionId: string) { return this.service.generate(transactionId); }
  @Get('verify/:transactionId')
  verify(@Param('transactionId') transactionId: string, @Query('sig') sig: string) { return this.service.verify(transactionId, sig); }
}
