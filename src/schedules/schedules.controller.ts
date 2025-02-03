import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { SchedulesService } from './schedules.service';
import { CreateScheduleDto, UpdateScheduleDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Role } from '../common/enums/role.enum';
import { VetProfilesService } from '../vet-profiles/vet-profiles.service';

@Controller('schedules')
export class SchedulesController {
  constructor(
    private readonly schedulesService: SchedulesService,
    private readonly vetProfilesService: VetProfilesService,
  ) { }

  private async getVetId(userId: string): Promise<string> {
    const profile = await this.vetProfilesService.findByUserId(userId);
    if (!profile) {
      throw new NotFoundException(
        'Vet profile not found. Please create a profile first.',
      );
    }
    return profile.id;
  }

  // VET ENDPOINTS

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.VET)
  async create(
    @CurrentUser('id') userId: string,
    @Body() createScheduleDto: CreateScheduleDto,
  ) {
    const vetId = await this.getVetId(userId);
    return this.schedulesService.create(vetId, createScheduleDto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.VET)
  async findMySchedule(@CurrentUser('id') userId: string) {
    const vetId = await this.getVetId(userId);
    return this.schedulesService.findAllByVet(vetId);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.VET)
  async update(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
    @Body() updateScheduleDto: UpdateScheduleDto,
  ) {
    const vetId = await this.getVetId(userId);
    return this.schedulesService.update(id, vetId, updateScheduleDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.VET)
  async remove(@CurrentUser('id') userId: string, @Param('id') id: string) {
    const vetId = await this.getVetId(userId);
    await this.schedulesService.remove(id, vetId);
    return { message: 'Schedule removed successfully' };
  }

  // PUBLIC ENDPOINTS

  @Get('vet/:vetId')
  async getVetSchedule(@Param('vetId') vetId: string) {
    return this.schedulesService.getVetSchedule(vetId);
  }

  @Get('vet/:vetId/slots')
  async getAvailableSlots(
    @Param('vetId') vetId: string,
    @Query('date') date: string,
  ) {
    if (!date) {
      throw new NotFoundException('Date query parameter is required');
    }
    return this.schedulesService.getAvailableSlots(vetId, date, []);
  }
}

