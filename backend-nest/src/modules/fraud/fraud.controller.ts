import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FraudService } from './fraud.service';

@ApiTags('fraud')
@Controller({ path: 'fraud', version: '1' })
export class FraudController {
  constructor(private readonly service: FraudService) {}
  @Get('alerts') list() { return this.service.listAlerts(); }
}
