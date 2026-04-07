import { Injectable, Inject } from '@nestjs/common';
import { SPRINT_REPOSITORY } from '../../domain/constants/sprint.constants';
import { type SprintRepository } from '../../infrastracture/repository/sprint-repository';

@Injectable()
export class RestoreSprintUseCase {
  constructor(
    @Inject(SPRINT_REPOSITORY)
    private readonly sprintRepository: SprintRepository,
  ) {}

  async execute(id: string): Promise<void> {
    await this.sprintRepository.restore(id);
  }
}
