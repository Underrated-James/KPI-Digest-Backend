import { Injectable, Inject } from '@nestjs/common';
import { type TeamRepository } from '../../infrastracture/repository/team-repository';
import { Team as TeamEntity } from '../../domain/entities/team.entity';
import { PaginatedResult } from 'src/common/interfaces/paginated-result.interface';

@Injectable()
export class GetTeamsUseCase {
  constructor(
    @Inject('TeamRepository')
    private readonly teamRepository: TeamRepository,
  ) { }

  async execute(page: number, size: number, sprintId?: string, projectId?: string): Promise<PaginatedResult<TeamEntity>> {
    return this.teamRepository.findAllPaginated(page, size, sprintId, projectId);
  }
}
