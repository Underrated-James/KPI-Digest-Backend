import { Injectable, Inject} from '@nestjs/common';
import { type TeamRepository } from '../../infrastracture/repository/team-repository';
import { TEAM_REPOSITORY } from '../../domain/constants/team.constants';
import { TeamNotFoundError } from '../../presentation/errors/team-not-found';

@Injectable()
export class DeleteTeamUseCase {
  constructor(
    @Inject(TEAM_REPOSITORY)
    private readonly teamRepository: TeamRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const team = await this.teamRepository.findById(id);
    if (!team) {
      throw new TeamNotFoundError(id);
    }

    await this.teamRepository.delete(id);
  }
}
