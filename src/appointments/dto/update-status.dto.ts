import { IsEnum } from 'class-validator';
import { AppointmentStatus } from '../../common/enums/appointment-status.enum';

export class UpdateStatusDto {
  @IsEnum(AppointmentStatus)
  status: AppointmentStatus;
}

