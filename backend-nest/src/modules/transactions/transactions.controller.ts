import { Body, Controller, Headers, Post, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateTransactionDto } from './dto';
import { TransactionsService } from './transactions.service';

@ApiTags('transactions')
@ApiBearerAuth()
@Controller({ path: 'transactions', version: '1' })
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  async create(@Body() dto: CreateTransactionDto, @Headers('x-user-id') userId = 'system') {
    return this.transactionsService.create(dto, userId);
  }
}
