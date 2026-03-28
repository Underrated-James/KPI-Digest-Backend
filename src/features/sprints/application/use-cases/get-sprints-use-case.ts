import { Injectable, Inject } from '@nestjs/common';
import { type SprintRepository } from '../../infrastracture/repository/sprint-repository';
import { Sprint as SprintEntity } from '../../domain/entities/sprint-entity';
import { SprintStatus } from '../../domain/enums/sprint-status-enums';
import { PaginatedResult } from 'src/common/interfaces/paginated-result.interface';

@Injectable()
export class GetSprintUseCase {
  constructor(
    @Inject('SprintRepository')
    private readonly SprintRepository: SprintRepository,
  ) { }

  async execute(page: number, size: number, status?: SprintStatus, projectId?: string): Promise<PaginatedResult<SprintEntity>> {
    return this.SprintRepository.findAllPaginated(page, size, status, projectId);
  }
}
