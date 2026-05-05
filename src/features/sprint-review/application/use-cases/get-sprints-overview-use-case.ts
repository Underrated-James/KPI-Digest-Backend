import { Injectable, Inject } from '@nestjs/common';
import { SPRINT_OVERVIEW_REPO } from '../../domain/constants/sprint-overview-constants';
import type { SprintRepository } from '../../infrastracture/repository/sprint-overview-repository';
import { SprintOverviewEntity } from '../../domain/entities/sprint-overview-entity';
import { PaginatedResult } from 'src/common/interfaces/paginated-result.interface';
import { GetSprintOverviewQueryDto } from '../api/dto/request/get-sprint-overview-dto';

@Injectable()
export class GetSprintOverviewsUseCase {
  constructor(
    @Inject(SPRINT_OVERVIEW_REPO)
    private readonly sprintRepository: SprintRepository,
  ) {}

  async execute(query: GetSprintOverviewQueryDto): Promise<PaginatedResult<SprintOverviewEntity>> {
    const { page = 1, size = 10, projectId, sprintId, search } = query;
    return this.sprintRepository.findAllPaginated(page, size, projectId, sprintId, search);
  }
}
