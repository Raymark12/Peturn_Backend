import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
} from 'typeorm';
import { VetProfile } from '../../vet-profiles/entities/vet-profile.entity';
import { DayOfWeek } from '../../common/enums/day-of-week.enum';

@Entity('vet_schedules')
@Unique(['vetId', 'dayOfWeek'])
export class VetSchedule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: DayOfWeek,
  })
  dayOfWeek: DayOfWeek;

  @Column({ type: 'time' })
  startTime: string;

  @Column({ type: 'time' })
  endTime: string;

  @Column({ default: 30 })
  slotDuration: number;

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => VetProfile, (vet) => vet.schedules, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'vetId' })
  vet: VetProfile;

  @Column()
  vetId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

