import {
  IsString,
  IsUUID,
  IsDateString,
  IsOptional,
  IsEnum,
  IsNumber,
  IsNotEmpty,
  Matches,
  ValidateIf,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { Species } from '../../common/enums/species.enum';
import { capitalize, trim, normalizePhone } from '../../common/utils/string.utils';

export class CreateAppointmentDto {
  // OWNER INFO (if profile doesn't exist)
  @Transform(({ value }) => capitalize(value))
  @IsString()
  @IsOptional()
  ownerFirstName?: string;

  @Transform(({ value }) => capitalize(value))
  @IsString()
  @IsOptional()
  ownerLastName?: string;

  @Transform(({ value }) => normalizePhone(value))
  @IsString()
  @IsOptional()
  ownerPhone?: string;

  // PET INFO (existing OR new)
  @IsUUID()
  @ValidateIf((o) => !o.petName) // Required if no pet name provided
  @IsOptional()
  petId?: string;

  @Transform(({ value }) => capitalize(value))
  @IsString()
  @IsNotEmpty()
  @ValidateIf((o) => !o.petId) // Required if no pet ID provided
  @IsOptional()
  petName?: string;

  @IsEnum(Species)
  @ValidateIf((o) => !o.petId) // Required if creating new pet
  @IsOptional()
  petSpecies?: Species;

  @Transform(({ value }) => capitalize(value))
  @IsString()
  @IsOptional()
  petBreed?: string;

  @IsDateString()
  @IsOptional()
  petBirthDate?: string;

  @IsNumber()
  @IsOptional()
  petWeight?: number;

  @Transform(({ value }) => trim(value))
  @IsString()
  @IsOptional()
  petNotes?: string;

  // APPOINTMENT INFO
  @IsUUID()
  vetId: string;

  @IsDateString()
  date: string;

  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'startTime must be in HH:mm format',
  })
  startTime: string;

  @Transform(({ value }) => trim(value))
  @IsString()
  @IsNotEmpty()
  reason: string;

  @Transform(({ value }) => trim(value))
  @IsString()
  @IsOptional()
  notes?: string;
}
