import { Injectable, Inject, BadRequestException, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { TICKET_REPOSITORY } from '../../../domain/constants/ticket.constants';
import { type TicketRepository } from '../../../infrastracture/repositories/tickets-repository';
import { BulkAssignTicketsDto } from '../../api/dto/request/bulk-assign-tickets-dto';
import { Ticket as TicketEntity } from '../../../domain/entities/ticket.entity';
import { SPRINT_REPOSITORY } from '../../../../sprints/domain/constants/sprint.constants';
import { type SprintRepository } from '../../../../sprints/infrastracture/repository/sprint-repository';
import { TEAM_REPOSITORY } from '../../../../teams/domain/constants/team.constants';
import { type TeamRepository } from '../../../../teams/infrastracture/repository/team-repository';
import { USER_REPOSITORY } from '../../../../users/domain/constants/user.constants';
import { type UserRepository } from '../../../../users/infrastracture/repositories/user.repository';

@Injectable()
export class BulkAssignTicketsUseCase {
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

  async execute(dto: BulkAssignTicketsDto): Promise<TicketEntity[]> {
    const { projectId, sprintId, teamId, allUsersOfTeam, tickets } = dto;

    // 1. Validate Sprint and Team
    const sprint = await this.sprintRepository.findById(sprintId);
    if (!sprint) {
      throw new BadRequestException(`Sprint with ID ${sprintId} not found`);
    }

    if (projectId !== sprint.projectId) {
      throw new BadRequestException(`Project ID ${projectId} does not match the sprint's project ID ${sprint.projectId}`);
    }

    const team = await this.teamRepository.findById(teamId);
    if (!team) {
      throw new BadRequestException(`Team with ID ${teamId} not found`);
    }

    if (team.sprintId !== sprintId) {
      throw new BadRequestException(`Team ID ${teamId} does not belong to Sprint ID ${sprintId}`);
    }

    // 2. Validate all users in the payload
    const userIds = [
      ...new Set([
        ...allUsersOfTeam.map(u => u.userIdOfTeam),
        ...tickets.map(t => t.assignedDevId).filter(id => id),
        ...tickets.map(t => t.assignedQaId).filter(id => id),
      ])
    ];

    const users = await Promise.all(userIds.map(id => this.userRepository.findById(id as string)));
    const userMap = new Map(users.filter(u => u !== null).map(u => [u!.id, u!]));

    for (const userId of userIds) {
      if (!userMap.has(userId as string)) {
        throw new UnprocessableEntityException(`User with ID ${userId} not found`);
      }
    }

    // 3. Process and update tickets
    const updatedTickets: TicketEntity[] = [];

    for (const ticketInfo of tickets) {
      const existingTicket = await this.ticketRepository.findById(ticketInfo.ticketId);
      if (!existingTicket) {
        throw new NotFoundException(`Ticket with ID ${ticketInfo.ticketId} not found`);
      }

      // Find user capacity info if available (usually we'd expect the frontend to send this, 
      // but if not we might default to 0 or calculate it).
      const devCapacity = allUsersOfTeam.find(u => u.userIdOfTeam === ticketInfo.assignedDevId);

      // In the original design, capacity is attached to the ticket. 
      // We'll use the assigned dev's capacity as the primary capacity tracked on the ticket.
      const sprintCapacity = devCapacity?.userSprintCapacity ?? existingTicket.sprintCapacity;
      const commitedCapacity = devCapacity?.userCommitedCapacity ?? existingTicket.commitedCapacity;
      const availableCapacity = devCapacity?.userAvailableCapacity ?? existingTicket.availableCapacity;

      // Update the ticket entity
      const updatedEntity = new TicketEntity(
        existingTicket.id,
        projectId,
        sprintId,
        teamId,
        ticketInfo.assignedDevId || existingTicket.assignedDevId,
        ticketInfo.assignedQaId || existingTicket.assignedQaId,
        ticketInfo.ticketNumber || existingTicket.ticketNumber,
        existingTicket.status,
        ticketInfo.ticketTitle || existingTicket.ticketTitle,
        existingTicket.descriptionLink,
        ticketInfo.estimationTesting,
        ticketInfo.developmentEstimation,
        sprintCapacity,
        commitedCapacity,
        availableCapacity
      );

      const savedTicket = await this.ticketRepository.patch(existingTicket.id, updatedEntity);
      if (savedTicket) {
        updatedTickets.push(savedTicket);
      }
    }

    return updatedTickets;
  }
}
