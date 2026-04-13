import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { TICKET_REPOSITORY } from '../../../domain/constants/ticket.constants';
import { type TicketRepository } from '../../../infrastracture/repositories/tickets-repository';
import { SPRINT_REPOSITORY } from 'src/features/sprints/domain/constants/sprint.constants';
import { type SprintRepository } from 'src/features/sprints/infrastracture/repository/sprint-repository';
import { TEAM_REPOSITORY } from 'src/features/teams/domain/constants/team.constants';
import { type TeamRepository } from 'src/features/teams/infrastracture/repository/team-repository';
import { DateUtils } from 'src/shared/date-utils';

export interface UserCapacity {
  userId: string;
  userName: string;
  role: string;
  sprintCapacity: number;
  committedCapacity: number;
  availableCapacity: number;
  workingDays: number;
}

export interface SprintCapacityResponse {
  sprintId: string;
  sprintName: string;
  teamId: string;
  workingHoursDay: number;
  users: UserCapacity[];
}

@Injectable()
export class GetSprintCapacityUseCase {
  constructor(
    @Inject(TICKET_REPOSITORY)
    private readonly ticketRepository: TicketRepository,
    @Inject(SPRINT_REPOSITORY)
    private readonly sprintRepository: SprintRepository,
    @Inject(TEAM_REPOSITORY)
    private readonly teamRepository: TeamRepository,
  ) { }

  async execute(sprintId: string): Promise<SprintCapacityResponse> {
    const [sprint, team] = await Promise.all([
      this.sprintRepository.findById(sprintId),
      this.teamRepository.findBySprintId(sprintId),
    ]);

    if (!sprint) {
      throw new NotFoundException(`Sprint with ID ${sprintId} not found`);
    }

    if (!team) {
      throw new NotFoundException(`No team defined for Sprint ${sprintId}`);
    }

    // Get all tickets for this sprint
    const ticketsResult = await this.ticketRepository.findAllPaginated(1, 1000, undefined, undefined, sprintId);
    const tickets = ticketsResult.content;

    const workingHoursDay = sprint.workingHoursDay;
    const sprintHolidays = sprint.dayOff || [];

    const userCapacities: UserCapacity[] = team.users.map(user => {
      // 1. Calculate Sprint Capacity
      // Combine sprint holidays with user-specific leaves
      const userLeaves = (user.leave || []).map((l: any) => ({
        date: new Date(l.leaveDate).toISOString().split('T')[0]
      }));
      
      const allDayOffs = [...sprintHolidays, ...userLeaves];
      const workingDays = DateUtils.calculateWorkingDays(sprint.startDate, sprint.endDate, allDayOffs);
      
      const sprintCapacity = workingDays * workingHoursDay;

      // 2. Calculate Committed Capacity
      // Sum estimations for tickets where this user is assigned as Dev or QA
      const committedCapacity = tickets.reduce((sum, ticket) => {
        if (ticket.assignedDevId === user.userId) {
          return sum + (ticket.developmentEstimation || 0);
        }
        if (ticket.assignedQaId === user.userId) {
          return sum + (ticket.estimationTesting || 0);
        }
        return sum;
      }, 0);

      // 3. Calculate Available Capacity
      const availableCapacity = sprintCapacity - committedCapacity;

      return {
        userId: user.userId,
        userName: user.name || 'Unknown',
        role: user.role,
        sprintCapacity,
        committedCapacity,
        availableCapacity,
        workingDays
      };
    });

    return {
      sprintId: sprint.id,
      sprintName: sprint.name,
      teamId: team.id,
      workingHoursDay,
      users: userCapacities
    };
  }
}
