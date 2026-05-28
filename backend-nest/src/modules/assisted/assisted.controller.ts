import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AssistedService } from './assisted.service';

@ApiTags('assisted')
@Controller({ path: 'assisted', version: '1' })
export class AssistedController {
  constructor(private readonly service: AssistedService) {}
  @Post('enable')
  enable(@Body() body: { familyId: string; operatorUserId: string; contactPhone?: string }) {
    return this.service.createAssistedProfile(body.familyId, body.operatorUserId, body.contactPhone);
  }
}
