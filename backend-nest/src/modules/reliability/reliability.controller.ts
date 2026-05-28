import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ReliabilityService } from './reliability.service';

@ApiTags('reliability')
@Controller({ path: 'reliability', version: '1' })
export class ReliabilityController {
  constructor(private readonly service: ReliabilityService) {}
  @Get('health-snapshot') snapshot() { return this.service.healthSnapshot(); }
}
