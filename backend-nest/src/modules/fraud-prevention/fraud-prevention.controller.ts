import { Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FraudPreventionService } from './fraud-prevention.service';

@ApiTags('fraud-prevention')
@Controller({ path: 'fraud-prevention', version: '1' })
export class FraudPreventionController {
  constructor(private readonly service: FraudPreventionService) {}
  @Post('run') run() { return this.service.runDetectors(); }
}
