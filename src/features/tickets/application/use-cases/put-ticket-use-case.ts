import { Injectable, Inject, BadRequestException, UnprocessableEntityException } from '@nestjs/common';
import { TICKET_REPOSITORY } from '../../domain/constants/ticket.constants';
import { type TicketRepository } from '../../infrastracture/repositories/tickets-repository';
import { PutTicketDto } from '../api/dto/request/put-ticket-dto';
import { Ticket as TicketsEntity } from '../../domain/entities/ticket.entity';
import { TicketNotFoundError } from '../../presentation/errors/tickets-not-found';
import { TEAM_REPOSITORY } from 'src/features/teams/domain/constants/team.constants';
import { SPRINT_REPOSITORY } from 'src/features/sprints/domain/constants/sprint.constants';
import { type TeamRepository } from 'src/features/teams/infrastracture/repository/team-repository';
import { type SprintRepository } from 'src/features/sprints/infrastracture/repository/sprint-repository';

@Injectable()
export class PutTicketUseCase {
  constructor(
    @Inject(TICKET_REPOSITORY)
    private readonly ticketRepository: TicketRepository,
    @Inject(TEAM_REPOSITORY)
    private readonly teamRepository: TeamRepository,
    @Inject(SPRINT_REPOSITORY)
    private readonly sprintRepository: SprintRepository,
  ) { }

  async execute(id: string, dto: PutTicketDto): Promise<TicketsEntity> {
    const ticketExist = await this.ticketRepository.findById(id);

    if (!ticketExist) {
      throw new TicketNotFoundError(id);
    }

    // Integrity checks for PUT
    const [sprint, team] = await Promise.all([
      this.sprintRepository.findById(dto.sprintId),
      this.teamRepository.findBySprintId(dto.sprintId),
    ]);

    if (!sprint) {
      throw new BadRequestException(`Sprint with ID ${dto.sprintId} not found`);
    }

    if (dto.projectId !== sprint.projectId) {
      throw new BadRequestException(`Project ID ${dto.projectId} does not match the sprint's project ID ${sprint.projectId}`);
    }

    // Team Membership Guard Check
    const assignedUserId = dto.assignedUserId || null;
    if (assignedUserId) {
      if (!team) {
        throw new BadRequestException('No team has been defined for this sprint yet. Cannot assign a user.');
      }
      const isUserInTeam = team.users.some(u => u.userId === assignedUserId);
      if (!isUserInTeam) {
        throw new UnprocessableEntityException(
          `User ${assignedUserId} is not a member of the team for Sprint: ${dto.sprintId}`
        );
      }
    }

    // Create full entity for repository put
    const ticketToPut = new TicketsEntity(
      id,
      dto.projectId,
      dto.sprintId,
      team?.id || null,
      assignedUserId,
      dto.ticketNumber,
      dto.status,
      dto.ticketTitle,
      dto.descriptionLink,
      dto.estimationTesting,
      dto.developmentEstimation,
    );

    const updatedTicket = await this.ticketRepository.put(id, ticketToPut);

    if (!updatedTicket) {
      throw new TicketNotFoundError(id);
    }

    return updatedTicket;
  }
}
