import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VetSchedule } from './entities/vet-schedule.entity';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { DayOfWeek } from '../common/enums/day-of-week.enum';

export interface TimeSlot {
  startTime: string;
  endTime: string;
  available: boolean;
}

@Injectable()
export class SchedulesService {
  constructor(
    @InjectRepository(VetSchedule)
    private readonly scheduleRepository: Repository<VetSchedule>,
  ) { }

  async findAllByVet(vetId: string): Promise<VetSchedule[]> {
    return this.scheduleRepository.find({
      where: { vetId },
      order: { dayOfWeek: 'ASC' },
    });
  }

  async findOne(id: string, vetId: string): Promise<VetSchedule> {
    const schedule = await this.scheduleRepository.findOne({
      where: { id, vetId },
    });
    if (!schedule) {
      throw new NotFoundException('Schedule not found');
    }
    return schedule;
  }

  async create(
    vetId: string,
    createScheduleDto: CreateScheduleDto,
  ): Promise<VetSchedule> {
    // Validate time order
    if (createScheduleDto.startTime >= createScheduleDto.endTime) {
      throw new BadRequestException('End time must be after start time');
    }

    // Check for duplicate day
    const existing = await this.scheduleRepository.findOne({
      where: { vetId, dayOfWeek: createScheduleDto.dayOfWeek },
    });
    if (existing) {
      throw new ConflictException(
        'Schedule already exists for this day. Use update instead.',
      );
    }

    const schedule = this.scheduleRepository.create({
      ...createScheduleDto,
      vetId,
    });
    return this.scheduleRepository.save(schedule);
  }

  async update(
    id: string,
    vetId: string,
    updateScheduleDto: UpdateScheduleDto,
  ): Promise<VetSchedule> {
    const schedule = await this.findOne(id, vetId);

    // Validate time order if both times provided
    const startTime = updateScheduleDto.startTime || schedule.startTime;
    const endTime = updateScheduleDto.endTime || schedule.endTime;
    if (startTime >= endTime) {
      throw new BadRequestException('End time must be after start time');
    }

    Object.assign(schedule, updateScheduleDto);
    return this.scheduleRepository.save(schedule);
  }

  async remove(id: string, vetId: string): Promise<void> {
    const schedule = await this.findOne(id, vetId);
    await this.scheduleRepository.remove(schedule);
  }

  async getVetSchedule(vetId: string): Promise<VetSchedule[]> {
    return this.scheduleRepository.find({
      where: { vetId, isActive: true },
      order: { dayOfWeek: 'ASC' },
    });
  }

  async getAvailableSlots(
    vetId: string,
    date: string,
    bookedSlots: string[] = [],
  ): Promise<{ date: string; slots: TimeSlot[] }> {
    const requestedDate = new Date(date);
    const dayOfWeek = requestedDate.getDay() as DayOfWeek;

    const schedule = await this.scheduleRepository.findOne({
      where: { vetId, dayOfWeek, isActive: true },
    });

    if (!schedule) {
      return { date, slots: [] };
    }

    const slots = this.generateTimeSlots(
      schedule.startTime,
      schedule.endTime,
      schedule.slotDuration,
      bookedSlots,
    );

    return { date, slots };
  }

  private generateTimeSlots(
    startTime: string,
    endTime: string,
    durationMinutes: number,
    bookedSlots: string[],
  ): TimeSlot[] {
    const slots: TimeSlot[] = [];
    let current = this.timeToMinutes(startTime);
    const end = this.timeToMinutes(endTime);

    while (current + durationMinutes <= end) {
      const slotStart = this.minutesToTime(current);
      const slotEnd = this.minutesToTime(current + durationMinutes);

      slots.push({
        startTime: slotStart,
        endTime: slotEnd,
        available: !bookedSlots.includes(slotStart),
      });

      current += durationMinutes;
    }

    return slots;
  }

  private timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  private minutesToTime(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  }
}

