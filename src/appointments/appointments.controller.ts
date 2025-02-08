import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  ParseUUIDPipe,
  NotFoundException,
} from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto, UpdateAppointmentDto, UpdateStatusDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Role } from '../common/enums/role.enum';
import { OwnerProfilesService } from '../owner-profiles/owner-profiles.service';
import { VetProfilesService } from '../vet-profiles/vet-profiles.service';

@Controller('appointments')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AppointmentsController {
  constructor(
    private readonly appointmentsService: AppointmentsService,
    private readonly ownerProfilesService: OwnerProfilesService,
    private readonly vetProfilesService: VetProfilesService,
  ) { }

  // OWNER ENDPOINTS

  @Post()
  @Roles(Role.OWNER)
  async create(
    @CurrentUser('id') userId: string,
    @Body() createAppointmentDto: CreateAppointmentDto,
  ) {
    // Service handles profile/pet creation if needed
    return this.appointmentsService.create(userId, createAppointmentDto);
  }

  @Get()
  async findAll(@CurrentUser('id') userId: string, @CurrentUser('role') role: Role) {
    if (role === Role.VET) {
      const vetProfile = await this.vetProfilesService.findByUserId(userId);
      if (!vetProfile) {
        throw new NotFoundException('Vet profile not found');
      }
      return this.appointmentsService.findAllByVet(vetProfile.id);
    }

    // Default to owner
    const ownerProfile = await this.ownerProfilesService.findByUserId(userId);
    if (!ownerProfile) {
      throw new NotFoundException('Owner profile not found');
    }
    return this.appointmentsService.findAllByOwner(ownerProfile.id);
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser('id') userId: string,
    @CurrentUser('role') role: Role,
  ) {
    if (role === Role.VET) {
      const vetProfile = await this.vetProfilesService.findByUserId(userId);
      if (!vetProfile) {
        throw new NotFoundException('Vet profile not found');
      }
      return this.appointmentsService.findOneForVet(id, vetProfile.id);
    }

    const ownerProfile = await this.ownerProfilesService.findByUserId(userId);
    if (!ownerProfile) {
      throw new NotFoundException('Owner profile not found');
    }
    return this.appointmentsService.findOneForOwner(id, ownerProfile.id);
  }

  @Patch(':id')
  @Roles(Role.OWNER)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser('id') userId: string,
    @Body() updateAppointmentDto: UpdateAppointmentDto,
  ) {
    const ownerProfile = await this.ownerProfilesService.findByUserId(userId);
    if (!ownerProfile) {
      throw new NotFoundException('Owner profile not found');
    }
    return this.appointmentsService.update(id, ownerProfile.id, updateAppointmentDto);
  }

  @Delete(':id')
  @Roles(Role.OWNER)
  async cancel(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser('id') userId: string,
  ) {
    const ownerProfile = await this.ownerProfilesService.findByUserId(userId);
    if (!ownerProfile) {
      throw new NotFoundException('Owner profile not found');
    }
    return this.appointmentsService.cancel(id, ownerProfile.id);
  }

  // VET ENDPOINTS

  @Patch(':id/status')
  @Roles(Role.VET)
  async updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser('id') userId: string,
    @Body() updateStatusDto: UpdateStatusDto,
  ) {
    const vetProfile = await this.vetProfilesService.findByUserId(userId);
    if (!vetProfile) {
      throw new NotFoundException('Vet profile not found');
    }
    return this.appointmentsService.updateStatus(id, vetProfile.id, updateStatusDto.status);
  }
}

