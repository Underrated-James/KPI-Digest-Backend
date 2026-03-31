import { Injectable, Inject, BadRequestException, UnprocessableEntityException } from '@nestjs/common';
import { TICKET_REPOSITORY } from '../../domain/constants/ticket.constants';
import { type TicketRepository } from '../../infrastracture/repositories/tickets-repository';
import { PatchTicketDto } from '../api/dto/request/patch-ticket.dto';
import { TicketNotFoundError } from '../../presentation/errors/tickets-not-found';
import { Ticket as TicketsEntity } from '../../domain/entities/ticket.entity';
import { TEAM_REPOSITORY } from 'src/features/teams/domain/constants/team.constants';
import { SPRINT_REPOSITORY } from 'src/features/sprints/domain/constants/sprint.constants';
import { type TeamRepository } from 'src/features/teams/infrastracture/repository/team-repository';
import { type SprintRepository } from 'src/features/sprints/infrastracture/repository/sprint-repository';

@Injectable()
export class PatchTicketUseCase {
  constructor(
    @Inject(TICKET_REPOSITORY)
    private readonly ticketRepository: TicketRepository,
    @Inject(TEAM_REPOSITORY)
    private readonly teamRepository: TeamRepository,
    @Inject(SPRINT_REPOSITORY)
    private readonly sprintRepository: SprintRepository,
  ) { }

  async execute(id: string, dto: PatchTicketDto): Promise<TicketsEntity> {
    const ticket = await this.ticketRepository.findById(id);
    if (!ticket) {
      throw new TicketNotFoundError(id);
    }

    // If sprintId or assignedUserId is changing, we need to validate
    const sprintId = dto.sprintId || ticket.sprintId;
    const assignedUserId = dto.assignedUserId !== undefined ? dto.assignedUserId : ticket.assignedUserId;

    if (dto.sprintId || dto.assignedUserId !== undefined) {
      const [sprint, team] = await Promise.all([
        this.sprintRepository.findById(sprintId),
        this.teamRepository.findBySprintId(sprintId),
      ]);

      if (!sprint) {
        throw new BadRequestException(`Sprint with ID ${sprintId} not found`);
      }

      if (assignedUserId) {
        if (!team) {
          throw new BadRequestException('No team has been defined for this sprint yet. Cannot assign a user.');
        }
        const isUserInTeam = team.userIds.some(u => u.userId === assignedUserId);
        if (!isUserInTeam) {
          throw new UnprocessableEntityException(
            `User ${assignedUserId} is not a member of the team for Sprint: ${sprintId}`
          );
        }
      }
    }

    const updatedTicket = await this.ticketRepository.patch(id, dto);
    if (!updatedTicket) {
      throw new TicketNotFoundError(id);
    }

    return updatedTicket;
  }
}
