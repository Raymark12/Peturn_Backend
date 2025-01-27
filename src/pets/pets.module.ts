import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pet } from './entities/pet.entity';
import { PetsService } from './pets.service';
import { PetsController } from './pets.controller';
import { OwnerProfilesModule } from '../owner-profiles/owner-profiles.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Pet]),
    OwnerProfilesModule,
  ],
  controllers: [PetsController],
  providers: [PetsService],
  exports: [PetsService],
})
export class PetsModule { }

