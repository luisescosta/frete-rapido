import { Transform } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class GetQuoteDto {
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsOptional()
  last_quotes: number;
}
