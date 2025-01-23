import { IsString, IsOptional } from 'class-validator';

export class CreateOwnerProfileDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  @IsOptional()
  phone?: string;
}

