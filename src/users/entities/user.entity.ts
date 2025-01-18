import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
} from 'typeorm';
import { Role } from '../../common/enums/role.enum';
import { OwnerProfile } from '../../owner-profiles/entities/owner-profile.entity';
import { VetProfile } from '../../vet-profiles/entities/vet-profile.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.OWNER,
  })
  role: Role;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => OwnerProfile, (ownerProfile) => ownerProfile.user)
  ownerProfile?: OwnerProfile;

  @OneToOne(() => VetProfile, (vetProfile) => vetProfile.user)
  vetProfile?: VetProfile;
}

