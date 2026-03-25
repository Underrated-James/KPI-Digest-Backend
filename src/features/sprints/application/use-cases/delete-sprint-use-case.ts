import { Injectable, Inject } from '@nestjs/common';
import { type SprintRepository } from '../../infrastracture/repository/sprint-repository';
import { SprintNotFoundError } from './../../presentation/errors/sprint-not-found';

@Injectable()
export class DeleteSprintUseCase {
  constructor(
    @Inject('SprintRepository')
    private readonly SprintRepository: SprintRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const Sprint = await this.SprintRepository.findById(id);
    if (!Sprint) {
      throw new SprintNotFoundError(id);
    }

    await this.SprintRepository.delete(id);
  }
}
