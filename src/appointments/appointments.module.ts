import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppointmentsController } from './appointments.controller';
import { AppointmentsService } from './appointments.service';
import { Appointment } from './entities/appointment.entity';
import { PetsModule } from '../pets/pets.module';
import { VetProfilesModule } from '../vet-profiles/vet-profiles.module';
import { OwnerProfilesModule } from '../owner-profiles/owner-profiles.module';
import { SchedulesModule } from '../schedules/schedules.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Appointment]),
    PetsModule,
    VetProfilesModule,
    OwnerProfilesModule,
    SchedulesModule,
    AuthModule,
  ],
  controllers: [AppointmentsController],
  providers: [AppointmentsService],
  exports: [AppointmentsService],
})
export class AppointmentsModule {}

