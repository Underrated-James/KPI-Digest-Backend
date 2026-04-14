import { Injectable, Inject } from '@nestjs/common';
import { TICKET_REPOSITORY } from '../../../domain/constants/ticket.constants';
import { type TicketRepository } from '../../../infrastracture/repositories/tickets-repository';
import { PatchTicketDto } from '../../api/dto/request/patch-ticket.dto';
import { TicketNotFoundError } from '../../../presentation/errors/tickets-not-found';
import { Ticket as TicketsEntity } from '../../../domain/entities/ticket.entity';
import { TEAM_REPOSITORY } from 'src/features/teams/domain/constants/team.constants';
import { SPRINT_REPOSITORY } from 'src/features/sprints/domain/constants/sprint.constants';
import { type TeamRepository } from 'src/features/teams/infrastracture/repository/team-repository';
import { type SprintRepository } from 'src/features/sprints/infrastracture/repository/sprint-repository';
import { TicketAssignmentValidatorService } from '../../services/ticket-assignment-validator.service';

@Injectable()
export class PatchTicketUseCase {
  constructor(
    @Inject(TICKET_REPOSITORY)
    private readonly ticketRepository: TicketRepository,
    @Inject(TEAM_REPOSITORY)
    private readonly teamRepository: TeamRepository,
    @Inject(SPRINT_REPOSITORY)
    private readonly sprintRepository: SprintRepository,
    private readonly ticketAssignmentValidator: TicketAssignmentValidatorService,
  ) { }

  async execute(id: string, dto: PatchTicketDto): Promise<TicketsEntity> {
    const ticket = await this.ticketRepository.findById(id);
    if (!ticket) {
      throw new TicketNotFoundError(id);
    }

    // If sprintId, assignedDevId or assignedQaId is changing, we need to validate
    const sprintId = dto.sprintId || ticket.sprintId;
    const projectId = dto.projectId || ticket.projectId;
    const assignedDevId = dto.assignedDevId !== undefined ? dto.assignedDevId : ticket.assignedDevId;
    const assignedQaId = dto.assignedQaId !== undefined ? dto.assignedQaId : ticket.assignedQaId;

    if (dto.sprintId || dto.projectId || dto.assignedDevId !== undefined || dto.assignedQaId !== undefined) {
      const [sprint, team] = await Promise.all([
        sprintId ? this.sprintRepository.findById(sprintId) : Promise.resolve(null),
        sprintId ? this.teamRepository.findBySprintId(sprintId) : Promise.resolve(null),
      ]);

      await this.ticketAssignmentValidator.assertProjectExists(projectId);
      this.ticketAssignmentValidator.validateSprint(sprintId, sprint, projectId);
      await this.ticketAssignmentValidator.validateAssignments({
        projectId,
        assignedDevId,
        assignedQaId,
        team,
      });
    }

    const effectiveTeam =
      sprintId ? await this.teamRepository.findBySprintId(sprintId) : null;

    const updatedTicket = await this.ticketRepository.patch(id, {
      ...dto,
      ...(dto.projectId !== undefined ? { projectId } : {}),
      ...(dto.sprintId !== undefined ? { sprintId: dto.sprintId } : {}),
      ...(dto.sprintId !== undefined ? { teamId: effectiveTeam?.id || null } : {}),
    });
    if (!updatedTicket) {
      throw new TicketNotFoundError(id);
    }

    return updatedTicket;
  }
}
