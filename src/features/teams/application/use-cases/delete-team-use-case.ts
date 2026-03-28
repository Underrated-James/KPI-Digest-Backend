import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { type TeamRepository } from '../../infrastracture/repository/team-repository';
import { TEAM_REPOSITORY } from '../../domain/constants/team.constants';

@Injectable()
export class DeleteTeamUseCase {
  constructor(
    @Inject(TEAM_REPOSITORY)
    private readonly teamRepository: TeamRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const team = await this.teamRepository.findById(id);
    if (!team) {
      throw new NotFoundException(`Team with id '${id}' not found`);
    }

    await this.teamRepository.delete(id);
  }
}
