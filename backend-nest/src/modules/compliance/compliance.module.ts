import { Module } from '@nestjs/common';
import { LegalAcceptanceGuard } from './legal-acceptance.guard';

@Module({ providers: [LegalAcceptanceGuard], exports: [LegalAcceptanceGuard] })
export class ComplianceModule {}
