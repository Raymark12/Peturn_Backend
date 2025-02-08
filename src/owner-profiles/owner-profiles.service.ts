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

  async findById(id: string): Promise<OwnerProfile | null> {
    return this.ownerProfileRepository.findOne({ where: { id } });
  }

  async create(profileData: Partial<OwnerProfile>): Promise<OwnerProfile> {
    const profile = this.ownerProfileRepository.create(profileData);
    return this.ownerProfileRepository.save(profile);
  }

  async findOrCreate(
    userId: string,
    profileData?: { firstName?: string; lastName?: string; phone?: string },
  ): Promise<OwnerProfile> {
    let profile = await this.findByUserId(userId);

    if (!profile) {
      profile = await this.create({
        userId,
        firstName: profileData?.firstName || 'Unknown',
        lastName: profileData?.lastName || 'Owner',
        phone: profileData?.phone,
      });
    }

    return profile;
  }

  async update(
    userId: string,
    profileData: Partial<OwnerProfile>,
  ): Promise<OwnerProfile | null> {
    await this.ownerProfileRepository.update({ userId }, profileData);
    return this.findByUserId(userId);
  }
}

