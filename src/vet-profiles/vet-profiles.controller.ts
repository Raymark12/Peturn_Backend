import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { VetProfilesService } from './vet-profiles.service';
import { CreateVetProfileDto, UpdateVetProfileDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Role } from '../common/enums/role.enum';

@Controller('vet-profiles')
export class VetProfilesController {
  constructor(private readonly vetProfilesService: VetProfilesService) { }

  @Get()
  async findAll() {
    return this.vetProfilesService.findAll();
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMyProfile(@CurrentUser('id') userId: string) {
    const profile = await this.vetProfilesService.findByUserId(userId);
    if (!profile) {
      throw new NotFoundException('Profile not found');
    }
    return profile;
  }

  @Post('me')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.VET)
  async createProfile(
    @CurrentUser('id') userId: string,
    @Body() createVetProfileDto: CreateVetProfileDto,
  ) {
    return this.vetProfilesService.create({
      ...createVetProfileDto,
      userId,
    });
  }

  @Patch('me')
  @UseGuards(JwtAuthGuard)
  async updateProfile(
    @CurrentUser('id') userId: string,
    @Body() updateVetProfileDto: UpdateVetProfileDto,
  ) {
    const profile = await this.vetProfilesService.update(
      userId,
      updateVetProfileDto,
    );
    if (!profile) {
      throw new NotFoundException('Profile not found');
    }
    return profile;
  }
}

