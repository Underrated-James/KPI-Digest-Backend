import { PartialType } from '@nestjs/mapped-types';
import { CreateTeamDto } from './create-team.dto';

export class PatchTeamDto extends PartialType(CreateTeamDto) {}
