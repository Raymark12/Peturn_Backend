import {
  IsString,
  IsEnum,
  IsOptional,
  IsDateString,
  IsNumber,
  Min,
} from 'class-validator';
import { Species } from '../../common/enums/species.enum';

export class CreatePetDto {
  @IsString()
  name: string;

  @IsEnum(Species)
  species: Species;

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

  @IsString()
  @IsOptional()
  notes?: string;
}

