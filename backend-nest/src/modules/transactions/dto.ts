import { IsArray, IsNumber, IsOptional, IsString, IsUUID, MaxLength, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class WitnessDto {
  @IsString() @MaxLength(120) name!: string;
  @IsOptional() @IsString() phone?: string;
}

export class CreateTransactionDto {
  @IsUUID() familyId!: string;
  @IsUUID() handlerId!: string;
  @IsOptional() @IsUUID() eventId?: string;
  @IsNumber() @Min(1) amount!: number;
  @IsString() idempotencyKey!: string;
  @IsOptional() @IsString() note?: string;
  @IsOptional() @IsArray() @ValidateNested({ each: true }) @Type(() => WitnessDto) witnesses?: WitnessDto[];
}
