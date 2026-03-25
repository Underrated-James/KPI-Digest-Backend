import { Injectable, Inject } from '@nestjs/common';
import { type SprintRepository } from '../../infrastracture/repository/sprint-repository';
import { Sprint as SprintEntity } from '../../domain/entities/sprint.entity';
import { SprintStatus } from '../../domain/enums/sprint-status-enums';

@Injectable()
export class GetSprintUseCase {
  constructor(
    @Inject('SprintRepository')
    private readonly SprintRepository: SprintRepository,
  ) {}

  async execute(status?: SprintStatus): Promise<SprintEntity[]> {
    return this.SprintRepository.findAll(status);
  }
}
