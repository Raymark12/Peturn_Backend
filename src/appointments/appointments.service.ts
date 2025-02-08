import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment } from './entities/appointment.entity';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { AppointmentStatus } from '../common/enums/appointment-status.enum';
import { PetsService } from '../pets/pets.service';
import { VetProfilesService } from '../vet-profiles/vet-profiles.service';
import { SchedulesService } from '../schedules/schedules.service';
import { OwnerProfilesService } from '../owner-profiles/owner-profiles.service';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
    private readonly petsService: PetsService,
    private readonly vetProfilesService: VetProfilesService,
    private readonly schedulesService: SchedulesService,
    private readonly ownerProfilesService: OwnerProfilesService,
  ) { }

  async create(
    userId: string,
    createAppointmentDto: CreateAppointmentDto,
  ): Promise<Appointment> {
    const {
      // Owner info
      ownerFirstName,
      ownerLastName,
      ownerPhone,
      // Pet info
      petId,
      petName,
      petSpecies,
      petBreed,
      petBirthDate,
      petWeight,
      petNotes,
      // Appointment info
      vetId,
      date,
      startTime,
      reason,
      notes,
    } = createAppointmentDto;

    // Validate: must have either petId or pet info
    if (!petId && !petName) {
      throw new BadRequestException(
        'Either petId (existing pet) or petName (new pet) is required',
      );
    }

    // Find or create owner profile
    const ownerProfile = await this.ownerProfilesService.findOrCreate(userId, {
      firstName: ownerFirstName,
      lastName: ownerLastName,
      phone: ownerPhone,
    });

    // Get or create pet
    let finalPetId: string;

    if (petId) {
      // Use existing pet - validate ownership
      await this.petsService.findOne(petId, ownerProfile.id);
      finalPetId = petId;
    } else {
      // Create new pet inline
      if (!petSpecies) {
        throw new BadRequestException('petSpecies is required when creating a new pet');
      }
      const newPet = await this.petsService.create(ownerProfile.id, {
        name: petName!,
        species: petSpecies,
        breed: petBreed,
        birthDate: petBirthDate,
        weight: petWeight,
        notes: petNotes,
      });
      finalPetId = newPet.id;
    }

    // Validate vet exists
    const vets = await this.vetProfilesService.findAll();
    const vet = vets.find((v) => v.id === vetId);
    if (!vet) {
      throw new NotFoundException('Vet not found');
    }

    // Validate appointment is in the future
    const appointmentDate = new Date(`${date}T${startTime}`);
    if (appointmentDate <= new Date()) {
      throw new BadRequestException('Appointment must be in the future');
    }

    // Check slot availability
    const bookedSlots = await this.getBookedSlots(vetId, date);
    if (bookedSlots.includes(startTime)) {
      throw new ConflictException('This time slot is already booked');
    }

    // Check if vet works on this day/time
    const schedule = await this.schedulesService.getAvailableSlots(vetId, date, bookedSlots);
    const slotAvailable = schedule.slots.some(
      (slot) => slot.startTime === startTime && slot.available,
    );
    if (schedule.slots.length === 0) {
      throw new BadRequestException('Vet is not available on this day');
    }
    if (!slotAvailable) {
      throw new BadRequestException('Selected time slot is not available');
    }

    const appointment = this.appointmentRepository.create({
      petId: finalPetId,
      vetId,
      date: new Date(date),
      startTime,
      reason,
      notes,
      status: AppointmentStatus.PENDING,
    });

    return this.appointmentRepository.save(appointment);
  }

  async findAllByOwner(ownerId: string): Promise<Appointment[]> {
    return this.appointmentRepository
      .createQueryBuilder('appointment')
      .innerJoin('appointment.pet', 'pet')
      .where('pet.ownerId = :ownerId', { ownerId })
      .leftJoinAndSelect('appointment.pet', 'petData')
      .leftJoinAndSelect('appointment.vet', 'vet')
      .orderBy('appointment.date', 'DESC')
      .addOrderBy('appointment.startTime', 'DESC')
      .getMany();
  }

  async findAllByVet(vetId: string): Promise<Appointment[]> {
    return this.appointmentRepository.find({
      where: { vetId },
      relations: ['pet', 'pet.owner'],
      order: { date: 'DESC', startTime: 'DESC' },
    });
  }

  async findOneForOwner(id: string, ownerId: string): Promise<Appointment> {
    const appointment = await this.appointmentRepository
      .createQueryBuilder('appointment')
      .innerJoin('appointment.pet', 'pet')
      .where('appointment.id = :id', { id })
      .andWhere('pet.ownerId = :ownerId', { ownerId })
      .leftJoinAndSelect('appointment.pet', 'petData')
      .leftJoinAndSelect('appointment.vet', 'vet')
      .getOne();

    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }
    return appointment;
  }

  async findOneForVet(id: string, vetId: string): Promise<Appointment> {
    const appointment = await this.appointmentRepository.findOne({
      where: { id, vetId },
      relations: ['pet', 'pet.owner'],
    });

    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }
    return appointment;
  }

  async update(
    id: string,
    ownerId: string,
    updateAppointmentDto: UpdateAppointmentDto,
  ): Promise<Appointment> {
    const appointment = await this.findOneForOwner(id, ownerId);

    // Only allow updates for pending appointments
    if (appointment.status !== AppointmentStatus.PENDING) {
      throw new ForbiddenException('Can only update pending appointments');
    }

    // If changing date/time, validate availability
    if (updateAppointmentDto.date || updateAppointmentDto.startTime) {
      const newDate = updateAppointmentDto.date || appointment.date.toISOString().split('T')[0];
      const newTime = updateAppointmentDto.startTime || appointment.startTime;

      const appointmentDate = new Date(`${newDate}T${newTime}`);
      if (appointmentDate <= new Date()) {
        throw new BadRequestException('Appointment must be in the future');
      }

      const bookedSlots = await this.getBookedSlots(appointment.vetId, newDate, id);
      if (bookedSlots.includes(newTime)) {
        throw new ConflictException('This time slot is already booked');
      }
    }

    Object.assign(appointment, updateAppointmentDto);
    return this.appointmentRepository.save(appointment);
  }

  async updateStatus(
    id: string,
    vetId: string,
    status: AppointmentStatus,
  ): Promise<Appointment> {
    const appointment = await this.findOneForVet(id, vetId);

    // Validate status transitions
    const validTransitions: Record<AppointmentStatus, AppointmentStatus[]> = {
      [AppointmentStatus.PENDING]: [AppointmentStatus.CONFIRMED, AppointmentStatus.CANCELLED],
      [AppointmentStatus.CONFIRMED]: [AppointmentStatus.COMPLETED, AppointmentStatus.CANCELLED],
      [AppointmentStatus.COMPLETED]: [],
      [AppointmentStatus.CANCELLED]: [],
    };

    if (!validTransitions[appointment.status].includes(status)) {
      throw new BadRequestException(
        `Cannot change status from ${appointment.status} to ${status}`,
      );
    }

    appointment.status = status;
    return this.appointmentRepository.save(appointment);
  }

  async cancel(id: string, ownerId: string): Promise<Appointment> {
    const appointment = await this.findOneForOwner(id, ownerId);

    if (appointment.status === AppointmentStatus.COMPLETED) {
      throw new ForbiddenException('Cannot cancel completed appointment');
    }

    if (appointment.status === AppointmentStatus.CANCELLED) {
      throw new ForbiddenException('Appointment is already cancelled');
    }

    appointment.status = AppointmentStatus.CANCELLED;
    return this.appointmentRepository.save(appointment);
  }

  private async getBookedSlots(
    vetId: string,
    date: string,
    excludeAppointmentId?: string,
  ): Promise<string[]> {
    const queryBuilder = this.appointmentRepository
      .createQueryBuilder('appointment')
      .where('appointment.vetId = :vetId', { vetId })
      .andWhere('appointment.date = :date', { date })
      .andWhere('appointment.status NOT IN (:...excludeStatuses)', {
        excludeStatuses: [AppointmentStatus.CANCELLED],
      });

    if (excludeAppointmentId) {
      queryBuilder.andWhere('appointment.id != :excludeId', {
        excludeId: excludeAppointmentId,
      });
    }

    const appointments = await queryBuilder.getMany();
    return appointments.map((a) => a.startTime);
  }
}

