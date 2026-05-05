import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { SPRINT_OVERVIEW_REPO } from '../../domain/constants/sprint-overview-constants';
import type { SprintRepository } from '../../infrastracture/repository/sprint-overview-repository';
import { SprintOverviewEntity } from '../../domain/entities/sprint-overview-entity';

@Injectable()
export class GetSprintOverviewByIdUseCase {
  constructor(
    @Inject(SPRINT_OVERVIEW_REPO)
    private readonly sprintRepository: SprintRepository,
  ) {}

  async execute(id: string): Promise<SprintOverviewEntity> {
    const entity = await this.sprintRepository.findById(id);
    if (!entity) {
      throw new NotFoundException(`Sprint overview with ID ${id} not found`);
    }
    return entity;
  }
}
