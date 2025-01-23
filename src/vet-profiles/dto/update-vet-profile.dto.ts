import { PartialType } from '@nestjs/mapped-types';
import { CreateVetProfileDto } from './create-vet-profile.dto';

export class UpdateVetProfileDto extends PartialType(CreateVetProfileDto) {}

