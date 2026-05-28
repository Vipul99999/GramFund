import { Module } from '@nestjs/common';
import { FraudPreventionController } from './fraud-prevention.controller';
import { FraudPreventionService } from './fraud-prevention.service';

@Module({ controllers: [FraudPreventionController], providers: [FraudPreventionService] })
export class FraudPreventionModule {}
