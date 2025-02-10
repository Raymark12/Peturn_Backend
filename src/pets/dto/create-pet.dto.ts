import {
  IsString,
  IsEnum,
  IsOptional,
  IsDateString,
  IsNumber,
  IsNotEmpty,
  Min,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { Species } from '../../common/enums/species.enum';
import { capitalize, trim } from '../../common/utils/string.utils';

export class CreatePetDto {
  @Transform(({ value }) => capitalize(value))
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(Species)
  species: Species;

  @Transform(({ value }) => capitalize(value))
  @IsString()
  @IsOptional()
  breed?: string;

  @IsDateString()
  @IsOptional()
  birthDate?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  weight?: number;

  @Transform(({ value }) => trim(value))
  @IsString()
  @IsOptional()
  notes?: string;
}
