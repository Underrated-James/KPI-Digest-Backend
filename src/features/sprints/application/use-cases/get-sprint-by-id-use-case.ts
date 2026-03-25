import { Injectable, Inject } from '@nestjs/common';
import { type SprintRepository } from '../../infrastracture/repository/sprint-repository';
import { Sprint as SprintEntity } from '../../domain/entities/sprint.entity';
import { SprintNotFoundError } from './../../presentation/errors/sprint-not-found';
@Injectable()
export class GetSprintByIdUseCase {
  constructor(
    @Inject('SprintRepository')
    private readonly SprintRepository: SprintRepository,
  ) {}

  async execute(id: string): Promise<SprintEntity> {
    const Sprint = await this.SprintRepository.findById(id);

    if (!Sprint) {
      throw new SprintNotFoundError(id);
    }

    return Sprint;
  }
}
