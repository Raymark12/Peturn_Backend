import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OwnerProfile } from './entities/owner-profile.entity';
import { OwnerProfilesService } from './owner-profiles.service';
import { OwnerProfilesController } from './owner-profiles.controller';

@Module({
  imports: [TypeOrmModule.forFeature([OwnerProfile])],
  controllers: [OwnerProfilesController],
  providers: [OwnerProfilesService],
  exports: [OwnerProfilesService],
})
export class OwnerProfilesModule {}

