import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { OwnerProfilesService } from './owner-profiles.service';
import { CreateOwnerProfileDto, UpdateOwnerProfileDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Role } from '../common/enums/role.enum';

@Controller('owner-profiles')
export class OwnerProfilesController {
  constructor(private readonly ownerProfilesService: OwnerProfilesService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMyProfile(@CurrentUser('id') userId: string) {
    const profile = await this.ownerProfilesService.findByUserId(userId);
    if (!profile) {
      throw new NotFoundException('Profile not found');
    }
    return profile;
  }

  @Post('me')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.OWNER)
  async createProfile(
    @CurrentUser('id') userId: string,
    @Body() createOwnerProfileDto: CreateOwnerProfileDto,
  ) {
    return this.ownerProfilesService.create({
      ...createOwnerProfileDto,
      userId,
    });
  }

  @Patch('me')
  @UseGuards(JwtAuthGuard)
  async updateProfile(
    @CurrentUser('id') userId: string,
    @Body() updateOwnerProfileDto: UpdateOwnerProfileDto,
  ) {
    const profile = await this.ownerProfilesService.update(
      userId,
      updateOwnerProfileDto,
    );
    if (!profile) {
      throw new NotFoundException('Profile not found');
    }
    return profile;
  }
}

