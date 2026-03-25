import { Inject, Injectable } from '@nestjs/common';
import { type SprintRepository } from '../../infrastracture/repository/sprint-repository';
import { PutSprintDto } from '../api/dto/request/put-sprint-dto';
import { Sprint as SprintEntity } from '../../domain/entities/sprint.entity';
import { SprintNotFoundError } from './../../presentation/errors/sprint-not-found';

@Injectable()
export class PutSprintUseCase {
  constructor(
    @Inject('SprintRepository')
    private readonly sprintRepository: SprintRepository,
  ) {}

  async execute(id: string, dto: PutSprintDto): Promise<SprintEntity> {
    const sprintExist = await this.sprintRepository.findById(id);

    if (!sprintExist) {
      throw new SprintNotFoundError(id);
    }

    const sprintToUpdate = new SprintEntity(
      id,
      dto.name,
      dto.status,
      dto.startDate,
      dto.endDate,
      dto.workingHoursDay,
    );

    const updatedSprint = await this.sprintRepository.put(id, sprintToUpdate);

    if (!updatedSprint) {
      throw new SprintNotFoundError(id);
    }

    return updatedSprint;
  }
}
