import { Module } from '@nestjs/common';
import { PeriodCloseService } from './period-close.service';

@Module({ providers: [PeriodCloseService], exports: [PeriodCloseService] })
export class PeriodCloseModule {}
