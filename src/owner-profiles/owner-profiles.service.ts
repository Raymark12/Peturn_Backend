import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OwnerProfile } from './entities/owner-profile.entity';

@Injectable()
export class OwnerProfilesService {
  constructor(
    @InjectRepository(OwnerProfile)
    private readonly ownerProfileRepository: Repository<OwnerProfile>,
  ) {}

  async findByUserId(userId: string): Promise<OwnerProfile | null> {
    return this.ownerProfileRepository.findOne({ where: { userId } });
  }

  async create(profileData: Partial<OwnerProfile>): Promise<OwnerProfile> {
    const profile = this.ownerProfileRepository.create(profileData);
    return this.ownerProfileRepository.save(profile);
  }

  async update(
    userId: string,
    profileData: Partial<OwnerProfile>,
  ): Promise<OwnerProfile | null> {
    await this.ownerProfileRepository.update({ userId }, profileData);
    return this.findByUserId(userId);
  }
}

