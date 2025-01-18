import { Controller } from '@nestjs/common';
import { OwnerProfilesService } from './owner-profiles.service';

@Controller('owner-profiles')
export class OwnerProfilesController {
  constructor(private readonly ownerProfilesService: OwnerProfilesService) { }

}

