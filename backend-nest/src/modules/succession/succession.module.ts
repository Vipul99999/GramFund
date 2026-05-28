import { Module } from '@nestjs/common';
import { SuccessionService } from './succession.service';

@Module({ providers: [SuccessionService], exports: [SuccessionService] })
export class SuccessionModule {}
