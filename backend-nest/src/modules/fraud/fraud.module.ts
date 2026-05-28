import { Module } from '@nestjs/common';
import { FraudController } from './fraud.controller';
import { FraudService } from './fraud.service';

@Module({ controllers: [FraudController], providers: [FraudService] })
export class FraudModule {}
