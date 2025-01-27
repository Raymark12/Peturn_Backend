import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pet } from './entities/pet.entity';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';

@Injectable()
export class PetsService {
  constructor(
    @InjectRepository(Pet)
    private readonly petRepository: Repository<Pet>,
  ) { }

  async findAllByOwner(ownerId: string): Promise<Pet[]> {
    return this.petRepository.find({ where: { ownerId } });
  }

  async findOne(id: string, ownerId: string): Promise<Pet> {
    const pet = await this.petRepository.findOne({
      where: { id, ownerId },
    });
    if (!pet) {
      throw new NotFoundException('Pet not found');
    }
    return pet;
  }

  async create(ownerId: string, createPetDto: CreatePetDto): Promise<Pet> {
    const pet = this.petRepository.create({
      ...createPetDto,
      ownerId,
    });
    return this.petRepository.save(pet);
  }

  async update(
    id: string,
    ownerId: string,
    updatePetDto: UpdatePetDto,
  ): Promise<Pet> {
    const pet = await this.findOne(id, ownerId);
    Object.assign(pet, updatePetDto);
    return this.petRepository.save(pet);
  }

  async remove(id: string, ownerId: string): Promise<void> {
    const pet = await this.findOne(id, ownerId);
    await this.petRepository.remove(pet);
  }
}

