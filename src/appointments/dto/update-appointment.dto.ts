import { IsString, IsOptional, IsDateString, Matches } from 'class-validator';
import { Transform } from 'class-transformer';
import { trim } from '../../common/utils/string.utils';

export class UpdateAppointmentDto {
  @IsDateString()
  @IsOptional()
  date?: string;

  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'startTime must be in HH:mm format',
  })
  @IsOptional()
  startTime?: string;

  @Transform(({ value }) => trim(value))
  @IsString()
  @IsOptional()
  reason?: string;

  @Transform(({ value }) => trim(value))
  @IsString()
  @IsOptional()
  notes?: string;
}
