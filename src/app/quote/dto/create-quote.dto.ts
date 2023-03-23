import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class AddressDto {
  @IsNotEmpty()
  @IsString()
  zipcode: string;
}
class RecipientDto {
  @ValidateNested()
  @IsNotEmpty()
  @IsObject()
  @Type(() => AddressDto)
  address: AddressDto;
}

class VolumeDto {
  @IsNumber()
  category: number;

  @IsNumber()
  amount: number;

  @IsNumber()
  unitary_weight: number;

  @IsNumber()
  price: number;

  @IsString()
  @IsNotEmpty()
  sku: string;

  @IsNumber()
  height: number;

  @IsNumber()
  width: number;

  @IsNumber()
  length: number;
}

export class CreateQuoteDto {
  @ValidateNested()
  @Type(() => RecipientDto)
  @IsObject()
  recipient: RecipientDto;

  @ValidateNested({ each: true })
  @Type(() => VolumeDto)
  @IsArray()
  volumes: VolumeDto[];
}
