import { Injectable, Inject } from '@nestjs/common';
import { type TeamRepository } from '../../infrastracture/repository/team-repository';
import { Team as TeamEntity } from '../../domain/entities/team.entity';

@Injectable()
export class GetTeamsUseCase {
  constructor(
    @Inject('TeamRepository')
    private readonly teamRepository: TeamRepository,
  ) {}

  async execute(sprintId?: string, projectId?: string): Promise<TeamEntity[]> {
    return this.teamRepository.findAll(sprintId, projectId);
  }
}
