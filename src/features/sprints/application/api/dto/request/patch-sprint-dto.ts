import { PartialType } from '@nestjs/mapped-types';
import { CreateSprintDto } from './create-sprint-parent-dto';

export class PatchSprintDto extends PartialType(CreateSprintDto) {}
