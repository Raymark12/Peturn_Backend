import { IsString, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { capitalize, normalizePhone } from '../../common/utils/string.utils';

export class CreateOwnerProfileDto {
  @Transform(({ value }) => capitalize(value))
  @IsString()
  firstName: string;

  @Transform(({ value }) => capitalize(value))
  @IsString()
  lastName: string;

  @Transform(({ value }) => normalizePhone(value))
  @IsString()
  @IsOptional()
  phone?: string;
}
