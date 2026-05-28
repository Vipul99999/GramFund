import { Module } from '@nestjs/common';
import { ReliabilityController } from './reliability.controller';
import { ReliabilityService } from './reliability.service';

@Module({ controllers: [ReliabilityController], providers: [ReliabilityService] })
export class ReliabilityModule {}
