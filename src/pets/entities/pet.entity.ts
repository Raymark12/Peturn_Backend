import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OwnerProfile } from '../../owner-profiles/entities/owner-profile.entity';
import { Species } from '../../common/enums/species.enum';
import { Appointment } from '../../appointments/entities/appointment.entity';

@Entity('pets')
export class Pet {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: Species,
    default: Species.OTHER,
  })
  species: Species;

  @Column({ nullable: true })
  breed: string;

  @Column({ type: 'date', nullable: true })
  birthDate: Date;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  weight: number;

  @Column({ nullable: true })
  notes: string;

  @ManyToOne(() => OwnerProfile, (owner) => owner.pets, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ownerId' })
  owner: OwnerProfile;

  @Column()
  ownerId: string;

  @OneToMany(() => Appointment, (appointment) => appointment.pet)
  appointments: Appointment[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

