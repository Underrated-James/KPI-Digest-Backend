import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { type TeamRepository } from '../../infrastracture/repository/team-repository';
import { TEAM_REPOSITORY } from '../../domain/constants/team.constants';
import { Team as TeamEntity } from '../../domain/entities/team.entity';

@Injectable()
export class GetTeamByIdUseCase {
  constructor(
    @Inject(TEAM_REPOSITORY)
    private readonly teamRepository: TeamRepository,
  ) {}

  async execute(id: string): Promise<TeamEntity> {
    const team = await this.teamRepository.findById(id);
    if (!team) {
      throw new NotFoundException(`Team with id '${id}' not found`);
    }
    return team;
  }
}
