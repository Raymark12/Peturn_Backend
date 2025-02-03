import {
  IsEnum,
  IsString,
  IsNumber,
  IsOptional,
  Min,
  Max,
  Matches,
} from 'class-validator';
import { DayOfWeek } from '../../common/enums/day-of-week.enum';

export class CreateScheduleDto {
  @IsEnum(DayOfWeek)
  dayOfWeek: DayOfWeek;

  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'startTime must be in HH:mm format',
  })
  startTime: string;

  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'endTime must be in HH:mm format',
  })
  endTime: string;

  @IsNumber()
  @Min(15)
  @Max(120)
  @IsOptional()
  slotDuration?: number;
}

