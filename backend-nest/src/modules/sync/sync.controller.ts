import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SyncService } from './sync.service';

@ApiTags('sync')
@Controller({ path: 'sync', version: '1' })
export class SyncController {
  constructor(private readonly service: SyncService) {}
  @Post('replay') replay(@Body() body: { deviceId: string; events: any[] }) { return this.service.replay(body.deviceId, body.events); }
}
