import { PartialType } from '@nestjs/mapped-types';
import { CreateOwnerProfileDto } from './create-owner-profile.dto';

export class UpdateOwnerProfileDto extends PartialType(CreateOwnerProfileDto) { }

