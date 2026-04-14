import { Injectable, Inject } from '@nestjs/common';
import { TICKET_REPOSITORY } from '../../../domain/constants/ticket.constants';
import { type TicketRepository } from '../../../infrastracture/repositories/tickets-repository';
import { PutTicketDto } from '../../api/dto/request/put-ticket-dto';
import { Ticket as TicketsEntity } from '../../../domain/entities/ticket.entity';
import { TicketNotFoundError } from '../../../presentation/errors/tickets-not-found';
import { TEAM_REPOSITORY } from 'src/features/teams/domain/constants/team.constants';
import { SPRINT_REPOSITORY } from 'src/features/sprints/domain/constants/sprint.constants';
import { type TeamRepository } from 'src/features/teams/infrastracture/repository/team-repository';
import { type SprintRepository } from 'src/features/sprints/infrastracture/repository/sprint-repository';
import { TicketAssignmentValidatorService } from '../../services/ticket-assignment-validator.service';

@Injectable()
export class PutTicketUseCase {
  constructor(
    @Inject(TICKET_REPOSITORY)
    private readonly ticketRepository: TicketRepository,
    @Inject(TEAM_REPOSITORY)
    private readonly teamRepository: TeamRepository,
    @Inject(SPRINT_REPOSITORY)
    private readonly sprintRepository: SprintRepository,
    private readonly ticketAssignmentValidator: TicketAssignmentValidatorService,
  ) { }

  async execute(id: string, dto: PutTicketDto): Promise<TicketsEntity> {
    const ticketExist = await this.ticketRepository.findById(id);

    if (!ticketExist) {
      throw new TicketNotFoundError(id);
    }

    // Integrity checks for PUT
    const [sprint, team] = await Promise.all([
      dto.sprintId
        ? this.sprintRepository.findById(dto.sprintId)
        : Promise.resolve(null),
      dto.sprintId
        ? this.teamRepository.findBySprintId(dto.sprintId)
        : Promise.resolve(null),
    ]);

    const assignedDevId = dto.assignedDevId || null;
    const assignedQaId = dto.assignedQaId || null;

    await this.ticketAssignmentValidator.assertProjectExists(dto.projectId);
    this.ticketAssignmentValidator.validateSprint(dto.sprintId, sprint, dto.projectId);
    await this.ticketAssignmentValidator.validateAssignments({
      projectId: dto.projectId,
      assignedDevId,
      assignedQaId,
      team,
    });

    // Create full entity for repository put
    const ticketToPut = new TicketsEntity(
      id,
      dto.projectId,
      dto.sprintId || null,
      team?.id || null,
      assignedDevId,
      assignedQaId,
      dto.ticketNumber,
      dto.status,
      dto.ticketTitle,
      dto.descriptionLink,
      dto.estimationTesting || null,
      dto.developmentEstimation || null,
    );

    const updatedTicket = await this.ticketRepository.put(id, ticketToPut);

    if (!updatedTicket) {
      throw new TicketNotFoundError(id);
    }

    return updatedTicket;
  }
}
