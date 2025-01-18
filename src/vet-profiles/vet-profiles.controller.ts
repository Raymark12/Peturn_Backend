import { Controller } from '@nestjs/common';
import { VetProfilesService } from './vet-profiles.service';

@Controller('vet-profiles')
export class VetProfilesController {
  constructor(private readonly vetProfilesService: VetProfilesService) { }

}

