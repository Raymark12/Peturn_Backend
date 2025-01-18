import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VetProfile } from './entities/vet-profile.entity';
import { VetProfilesService } from './vet-profiles.service';
import { VetProfilesController } from './vet-profiles.controller';

@Module({
  imports: [TypeOrmModule.forFeature([VetProfile])],
  controllers: [VetProfilesController],
  providers: [VetProfilesService],
  exports: [VetProfilesService],
})
export class VetProfilesModule {}

