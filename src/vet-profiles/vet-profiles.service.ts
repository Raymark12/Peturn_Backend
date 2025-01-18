import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VetProfile } from './entities/vet-profile.entity';

@Injectable()
export class VetProfilesService {
  constructor(
    @InjectRepository(VetProfile)
    private readonly vetProfileRepository: Repository<VetProfile>,
  ) {}

  async findByUserId(userId: string): Promise<VetProfile | null> {
    return this.vetProfileRepository.findOne({ where: { userId } });
  }

  async findAll(): Promise<VetProfile[]> {
    return this.vetProfileRepository.find({ relations: ['user'] });
  }

  async create(profileData: Partial<VetProfile>): Promise<VetProfile> {
    const profile = this.vetProfileRepository.create(profileData);
    return this.vetProfileRepository.save(profile);
  }

  async update(
    userId: string,
    profileData: Partial<VetProfile>,
  ): Promise<VetProfile | null> {
    await this.vetProfileRepository.update({ userId }, profileData);
    return this.findByUserId(userId);
  }
}

