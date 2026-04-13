import { Injectable, Inject, NotFoundException, BadRequestException, UnprocessableEntityException } from '@nestjs/common';
import { TICKET_REPOSITORY } from '../../../domain/constants/ticket.constants';
import { type TicketRepository } from '../../../infrastracture/repositories/tickets-repository';
import { BulkPatchTicketDto } from '../../api/dto/request/bulk-patch-ticket-dto';
import { Ticket as TicketEntity } from '../../../domain/entities/ticket.entity';
import { SPRINT_REPOSITORY } from 'src/features/sprints/domain/constants/sprint.constants';
import { type SprintRepository } from 'src/features/sprints/infrastracture/repository/sprint-repository';
import { TEAM_REPOSITORY } from 'src/features/teams/domain/constants/team.constants';
import { type TeamRepository } from 'src/features/teams/infrastracture/repository/team-repository';
import { USER_REPOSITORY } from 'src/features/users/domain/constants/user.constants';
import { type UserRepository } from 'src/features/users/infrastracture/repositories/user.repository';

@Injectable()
export class BulkPatchTicketUseCase {
  constructor(
    @Inject(TICKET_REPOSITORY)
    private readonly ticketRepository: TicketRepository,
    @Inject(SPRINT_REPOSITORY)
    private readonly sprintRepository: SprintRepository,
    @Inject(TEAM_REPOSITORY)
    private readonly teamRepository: TeamRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
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

    // Pre-fetch all necessary data (Sprints, Teams, Users)
    const sprintIds = [...new Set(patchItems.map(item => {
        const ticket = ticketMap.get(item.id)!;
        return item.sprintId || ticket.sprintId;
    }).filter(id => !!id))] as string[];

    const userIds = [...new Set([
        ...patchItems.map(item => item.assignedDevId).filter(id => !!id),
        ...patchItems.map(item => item.assignedQaId).filter(id => !!id),
        ...existingTickets.map(t => t?.assignedDevId).filter(id => !!id),
        ...existingTickets.map(t => t?.assignedQaId).filter(id => !!id),
    ])] as string[];

    const [sprints, teams, users] = await Promise.all([
      Promise.all(sprintIds.map(id => this.sprintRepository.findById(id))),
      Promise.all(sprintIds.map(id => this.teamRepository.findBySprintId(id))),
      Promise.all(userIds.map(id => this.userRepository.findById(id))),
    ]);

    const sprintMap = new Map(sprints.filter(s => s !== null).map(s => [s!.id, s!]));
    const teamMap = new Map(teams.filter(t => t !== null).map(t => [t!.sprintId, t!]));
    const userMap = new Map(users.filter(u => u !== null).map(u => [u!.id, u!]));

    // Perform validations
    for (const item of patchItems) {
      const ticket = ticketMap.get(item.id)!;
      const sprintId = item.sprintId || ticket.sprintId;
      const sprint = sprintId ? sprintMap.get(sprintId) : null;
      const team = sprintId ? teamMap.get(sprintId) : null;

      // Validate sprint and project consistency if sprint is changing
      if (item.sprintId && sprint) {
        const projectId = item.projectId || ticket.projectId;
        if (projectId !== sprint.projectId) {
          throw new BadRequestException(`Project ID ${projectId} does not match the sprint's project ID ${sprint.projectId} for ticket ${ticket.ticketNumber}`);
        }
      }

      // Validate assignments
      const assignedDevId = item.assignedDevId !== undefined ? item.assignedDevId : ticket.assignedDevId;
      const assignedQaId = item.assignedQaId !== undefined ? item.assignedQaId : ticket.assignedQaId;

      if (assignedDevId) {
        const user = userMap.get(assignedDevId);
        if (!user) throw new UnprocessableEntityException(`Assigned Developer with ID ${assignedDevId} not found`);
        if (user.role !== 'DEVS') throw new UnprocessableEntityException(`User ${user.name} is not a Developer`);
        if (team) {
          const isMember = team.users.some((u: any) => u.userId === assignedDevId);
          if (!isMember) throw new UnprocessableEntityException(`User ${user.name} is not a member of the team for Sprint: ${sprintId}`);
        }
      }

      if (assignedQaId) {
        const user = userMap.get(assignedQaId);
        if (!user) throw new UnprocessableEntityException(`Assigned QA with ID ${assignedQaId} not found`);
        if (user.role !== 'QA') throw new UnprocessableEntityException(`User ${user.name} is not a QA`);
        if (team) {
          const isMember = team.users.some((u: any) => u.userId === assignedQaId);
          if (!isMember) throw new UnprocessableEntityException(`User ${user.name} is not a member of the team for Sprint: ${sprintId}`);
        }
      }
    }

    // Execute bulk update
    const updates = patchItems.map(item => ({
        id: item.id,
        data: item as Partial<TicketEntity>,
    }));

    return this.ticketRepository.patchMany(updates);
  }
}
