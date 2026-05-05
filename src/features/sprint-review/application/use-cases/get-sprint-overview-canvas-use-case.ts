import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { SPRINT_REPOSITORY } from 'src/features/sprints/domain/constants/sprint.constants';
import { type SprintRepository } from 'src/features/sprints/infrastracture/repository/sprint-repository';
import { TEAM_REPOSITORY } from 'src/features/teams/domain/constants/team.constants';
import { type TeamRepository } from 'src/features/teams/infrastracture/repository/team-repository';
import { TICKET_REPOSITORY } from 'src/features/tickets/domain/constants/ticket.constants';
import { type TicketRepository } from 'src/features/tickets/infrastracture/repositories/tickets-repository';
import { SprintCanvasResponseDto } from '../api/dto/response/sprint-canvas-response-dto';

@Injectable()
export class GetSprintCanvasUseCase {
  constructor(
    @Inject(SPRINT_REPOSITORY)
    private readonly sprintRepository: SprintRepository,
    @Inject(TEAM_REPOSITORY)
    private readonly teamRepository: TeamRepository,
    @Inject(TICKET_REPOSITORY)
    private readonly ticketRepository: TicketRepository,
  ) {}

  async execute(sprintId: string, page: number = 1, size: number = 50): Promise<SprintCanvasResponseDto> {
    const [sprint, team, ticketsResult] = await Promise.all([
      this.sprintRepository.findById(sprintId),
      this.teamRepository.findBySprintId(sprintId),
      this.ticketRepository.findAllPaginated(page, size, undefined, undefined, sprintId),
    ]);

    if (!sprint) {
      throw new NotFoundException(`Sprint with ID ${sprintId} not found`);
    }

    return SprintCanvasResponseDto.fromPaginatedData(sprint, team, ticketsResult);
  }
}
