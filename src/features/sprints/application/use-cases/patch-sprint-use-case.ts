import { Injectable, Inject } from '@nestjs/common';
import { type SprintRepository } from '../../infrastracture/repository/sprint-repository';
import { Sprint as SprintEntity } from '../../domain/entities/sprint.entity';
import { SprintNotFoundError } from './../../presentation/errors/sprint-not-found';
import { PatchSprintDto } from '../api/dto/request/patch-sprint-dto';

@Injectable()
export class PatchSprintUseCase {
  constructor(
    @Inject('SprintRepository')
    private readonly SprintRepository: SprintRepository,
  ) {}

  async execute(id: string, dto: PatchSprintDto): Promise<SprintEntity> {
    const updatedSprint = await this.SprintRepository.patch(id, dto);

    if (!updatedSprint) {
      throw new SprintNotFoundError(id);
    }

    return updatedSprint;
  }
}
