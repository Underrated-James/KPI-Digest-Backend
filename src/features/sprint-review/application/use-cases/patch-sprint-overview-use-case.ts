import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { SPRINT_OVERVIEW_REPO } from '../../domain/constants/sprint-overview-constants';
import type { SprintRepository } from '../../infrastracture/repository/sprint-overview-repository';
import { SprintOverviewEntity } from '../../domain/entities/sprint-overview-entity';
import { PatchSprintOverviewDto } from '../api/dto/request/patch-sprint-overview-dto';

@Injectable()
export class PatchSprintOverviewUseCase {
  constructor(
    @Inject(SPRINT_OVERVIEW_REPO)
    private readonly sprintRepository: SprintRepository,
  ) {}

  async execute(id: string, dto: PatchSprintOverviewDto): Promise<SprintOverviewEntity> {
    const existing = await this.sprintRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(`Sprint overview with ID ${id} not found`);
    }

    const updated = await this.sprintRepository.patch(id, dto as any);
    return updated!;
  }
}
