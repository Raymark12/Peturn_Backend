import { IsString, IsOptional, IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';
import { capitalize, trim, normalizePhone } from '../../common/utils/string.utils';

export class CreateVetProfileDto {
  @Transform(({ value }) => capitalize(value))
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @Transform(({ value }) => capitalize(value))
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @Transform(({ value }) => normalizePhone(value))
  @IsString()
  @IsOptional()
  phone?: string;

  @Transform(({ value }) => trim(value))
  @IsString()
  @IsOptional()
  licenseNumber?: string;

  @Transform(({ value }) => capitalize(value))
  @IsString()
  @IsOptional()
  specialization?: string;
}
