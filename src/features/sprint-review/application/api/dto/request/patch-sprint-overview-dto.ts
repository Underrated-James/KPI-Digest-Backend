import { PartialType } from '@nestjs/mapped-types';
import { CreateSprintOverviewDto } from './create-sprint-overview-dto';

export class PatchSprintOverviewDto extends PartialType(CreateSprintOverviewDto) {}
