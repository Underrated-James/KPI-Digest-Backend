import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { TICKET_REPOSITORY } from '../../../domain/constants/ticket.constants';
import { type TicketRepository } from '../../../infrastracture/repositories/tickets-repository';
import { BulkPatchTicketDto } from '../../api/dto/request/bulk-patch-ticket-dto';
import { Ticket as TicketEntity } from '../../../domain/entities/ticket.entity';
import { SPRINT_REPOSITORY } from 'src/features/sprints/domain/constants/sprint.constants';
import { type SprintRepository } from 'src/features/sprints/infrastracture/repository/sprint-repository';
import { TEAM_REPOSITORY } from 'src/features/teams/domain/constants/team.constants';
import { type TeamRepository } from 'src/features/teams/infrastracture/repository/team-repository';
import { TicketAssignmentValidatorService } from '../../services/ticket-assignment-validator.service';

@Injectable()
export class BulkPatchTicketUseCase {
  constructor(
    @Inject(TICKET_REPOSITORY)
    private readonly ticketRepository: TicketRepository,
    @Inject(SPRINT_REPOSITORY)
    private readonly sprintRepository: SprintRepository,
    @Inject(TEAM_REPOSITORY)
    private readonly teamRepository: TeamRepository,
    private readonly ticketAssignmentValidator: TicketAssignmentValidatorService,
  ) { }

  async execute(dto: BulkPatchTicketDto): Promise<TicketEntity[]> {
    const { tickets: patchItems } = dto;
    
    if (!patchItems || patchItems.length === 0) {
      return [];
    }

    const ticketIds = patchItems.map(t => t.id);
    const existingTickets = await Promise.all(ticketIds.map(id => this.ticketRepository.findById(id)));
    
    const ticketMap = new Map<string, TicketEntity>();
    existingTickets.forEach(t => {
      if (t) ticketMap.set(t.id, t);
    });

    // Validate existence
    for (const id of ticketIds) {
      if (!ticketMap.has(id)) {
        throw new NotFoundException(`Ticket with ID ${id} not found`);
      }
    }

    // Pre-fetch all necessary data (Sprints and Teams)
    const sprintIds = [...new Set(patchItems.map(item => {
        const ticket = ticketMap.get(item.id)!;
        return item.sprintId || ticket.sprintId;
    }).filter(id => !!id))] as string[];

    const [sprints, teams] = await Promise.all([
      Promise.all(sprintIds.map(id => this.sprintRepository.findById(id))),
      Promise.all(sprintIds.map(id => this.teamRepository.findBySprintId(id))),
    ]);

    const sprintMap = new Map(sprints.filter(s => s !== null).map(s => [s!.id, s!]));
    const teamMap = new Map(teams.filter(t => t !== null).map(t => [t!.sprintId, t!]));

    // Perform validations
    for (const item of patchItems) {
      const ticket = ticketMap.get(item.id)!;
      const sprintId = item.sprintId || ticket.sprintId;
      const projectId = item.projectId || ticket.projectId;
      const sprint = sprintId ? sprintMap.get(sprintId) : null;
      const team = sprintId ? teamMap.get(sprintId) : null;

      // Validate assignments
      const assignedDevId = item.assignedDevId !== undefined ? item.assignedDevId : ticket.assignedDevId;
      const assignedQaId = item.assignedQaId !== undefined ? item.assignedQaId : ticket.assignedQaId;

      await this.ticketAssignmentValidator.assertProjectExists(projectId);
      this.ticketAssignmentValidator.validateSprint(sprintId, sprint || null, projectId);
      await this.ticketAssignmentValidator.validateAssignments({
        projectId,
        assignedDevId,
        assignedQaId,
        team,
      });
    }

    // Execute bulk update
    const updates = patchItems.map(item => ({
        id: item.id,
        data: {
          ...(item as Partial<TicketEntity>),
          ...(item.sprintId !== undefined
            ? { teamId: item.sprintId ? teamMap.get(item.sprintId)?.id || null : null }
            : {}),
        } as Partial<TicketEntity>,
    }));

    return this.ticketRepository.patchMany(updates);
  }
}
