import { Injectable, Inject} from '@nestjs/common';
import { SPRINT_OVERVIEW_REPO } from '../../domain/constants/sprint-overview-constants';
import type { SprintRepository } from '../../infrastracture/repository/sprint-overview-repository';

@Injectable()
export class RestoreSprintOverviewUseCase {
  constructor(
    @Inject(SPRINT_OVERVIEW_REPO)
    private readonly sprintRepository: SprintRepository,
  ) {}

  async execute(id: string): Promise<void> {
    await this.sprintRepository.restore(id);
  }
}
