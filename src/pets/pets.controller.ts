import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { PetsService } from './pets.service';
import { CreatePetDto, UpdatePetDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Role } from '../common/enums/role.enum';
import { OwnerProfilesService } from '../owner-profiles/owner-profiles.service';

@Controller('pets')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.OWNER)
export class PetsController {
  constructor(
    private readonly petsService: PetsService,
    private readonly ownerProfilesService: OwnerProfilesService,
  ) {}

  private async getOwnerId(userId: string): Promise<string> {
    const profile = await this.ownerProfilesService.findByUserId(userId);
    if (!profile) {
      throw new NotFoundException('Owner profile not found. Please create a profile first.');
    }
    return profile.id;
  }

  @Get()
  async findAll(@CurrentUser('id') userId: string) {
    const ownerId = await this.getOwnerId(userId);
    return this.petsService.findAllByOwner(ownerId);
  }

  @Post()
  async create(
    @CurrentUser('id') userId: string,
    @Body() createPetDto: CreatePetDto,
  ) {
    const ownerId = await this.getOwnerId(userId);
    return this.petsService.create(ownerId, createPetDto);
  }

  @Get(':id')
  async findOne(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
  ) {
    const ownerId = await this.getOwnerId(userId);
    return this.petsService.findOne(id, ownerId);
  }

  @Patch(':id')
  async update(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
    @Body() updatePetDto: UpdatePetDto,
  ) {
    const ownerId = await this.getOwnerId(userId);
    return this.petsService.update(id, ownerId, updatePetDto);
  }

  @Delete(':id')
  async remove(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
  ) {
    const ownerId = await this.getOwnerId(userId);
    await this.petsService.remove(id, ownerId);
    return { message: 'Pet removed successfully' };
  }
}

