import { Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ReadModelsService } from './read-models.service';
import { LegalAcceptanceGuard } from '../compliance/legal-acceptance.guard';
import { LegalModule } from '../compliance/decorators/legal-module.decorator';

@ApiTags('read-models')
@Controller({ path: 'read-models', version: '1' })
export class ReadModelsController {
  constructor(private readonly service: ReadModelsService) {}

  @Post('project') project(@Query('limit') limit?: string) { return this.service.projectFinancialEvents(limit ? Number(limit) : 500); }
  @UseGuards(LegalAcceptanceGuard)
  @LegalModule('STATEMENTS', 'v1')
  @Get('family-statement/:familyId') family(@Param('familyId') familyId: string) { return this.service.familyStatement(familyId); }
  @UseGuards(LegalAcceptanceGuard)
  @LegalModule('EXPOSURE', 'v1')
  @Get('handler-exposure/:handlerId') handler(@Param('handlerId') handlerId: string) { return this.service.handlerExposure(handlerId); }
  @Get('village-trust/:villageId') village(@Param('villageId') villageId: string) { return this.service.villageTrust(villageId); }
  @Get('fraud-dashboard') fraud() { return this.service.fraudDashboard(); }
}
