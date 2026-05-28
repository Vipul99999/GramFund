import { IsNumber, IsOptional, IsString, IsUUID, Min } from 'class-validator';

export class CreateTransactionDto {
  @IsUUID() familyId!: string;
  @IsUUID() handlerId!: string;
  @IsOptional() @IsUUID() eventId?: string;
  @IsNumber() @Min(1) amount!: number;
  @IsString() idempotencyKey!: string;
}
