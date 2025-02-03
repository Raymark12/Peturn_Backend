import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VetSchedule } from './entities/vet-schedule.entity';
import { SchedulesService } from './schedules.service';
import { SchedulesController } from './schedules.controller';
import { VetProfilesModule } from '../vet-profiles/vet-profiles.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([VetSchedule]),
    VetProfilesModule,
  ],
  controllers: [SchedulesController],
  providers: [SchedulesService],
  exports: [SchedulesService],
})
export class SchedulesModule {}

