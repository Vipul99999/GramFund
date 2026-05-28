import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './infrastructure/prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { VillagesModule } from './modules/villages/villages.module';
import { FamiliesModule } from './modules/families/families.module';
import { HandlersModule } from './modules/handlers/handlers.module';
import { EventsModule } from './modules/events/events.module';
import { TransactionsModule } from './modules/transactions/transactions.module';
import { SettlementsModule } from './modules/settlements/settlements.module';
import { FraudModule } from './modules/fraud/fraud.module';
import { AuditModule } from './modules/audit/audit.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    VillagesModule,
    FamiliesModule,
    HandlersModule,
    EventsModule,
    TransactionsModule,
    SettlementsModule,
    FraudModule,
    AuditModule
  ]
})
export class AppModule {}
