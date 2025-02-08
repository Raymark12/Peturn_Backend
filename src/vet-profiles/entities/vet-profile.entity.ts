import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { VetSchedule } from '../../schedules/entities/vet-schedule.entity';
import { Appointment } from '../../appointments/entities/appointment.entity';

@Entity('vet_profiles')
export class VetProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  licenseNumber: string;

  @Column({ nullable: true })
  specialization: string;

  @OneToOne(() => User, (user) => user.vetProfile, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: string;

  @OneToMany(() => VetSchedule, (schedule) => schedule.vet)
  schedules: VetSchedule[];

  @OneToMany(() => Appointment, (appointment) => appointment.vet)
  appointments: Appointment[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

