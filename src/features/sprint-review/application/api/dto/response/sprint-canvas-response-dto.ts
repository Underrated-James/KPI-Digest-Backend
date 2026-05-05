import { Sprint } from "src/features/sprints/domain/entities/sprint-entity";
import { Team } from "src/features/teams/domain/entities/team.entity";
import { Ticket } from "src/features/tickets/domain/entities/ticket.entity";
import { PaginatedResult } from "src/common/interfaces/paginated-result.interface";

export class SprintCanvasResponseDto {
  constructor(
    public readonly sprint: any,
    public readonly team: any,
    public readonly tickets: any, // This will now hold paginated data
  ) {}

  static fromPaginatedData(sprint: Sprint, team: Team | null, ticketsResult: PaginatedResult<Ticket>): SprintCanvasResponseDto {
    return new SprintCanvasResponseDto(
      {
        id: sprint.id,
        name: sprint.name,
        projectId: sprint.projectId,
        projectName: sprint.projectName,
        status: sprint.status,
        startDate: sprint.startDate,
        endDate: sprint.endDate,
        workingHoursDay: sprint.workingHoursDay,
        sprintDuration: sprint.sprintDuration,
        dayOff: sprint.dayOff,
        officialStartDate: sprint.officialStartDate,
        officialEndDate: sprint.officialEndDate,
      },
      team ? {
        id: team.id,
        projectId: team.projectId,
        sprintId: team.sprintId,
        projectName: team.projectName,
        sprintName: team.sprintName,
        users: team.users,
      } : null,
      {
        ...ticketsResult,
        content: ticketsResult.content.map(ticket => ({
          id: ticket.id,
          ticketNumber: ticket.ticketNumber,
          title: ticket.ticketTitle,
          status: ticket.status,
          assignedDevId: ticket.assignedDevId,
          assignedDevName: (ticket as any)._assignedDevName,
          assignedQaId: ticket.assignedQaId,
          assignedQaName: (ticket as any)._assignedQaName,
          developmentEstimation: ticket.developmentEstimation,
          estimationTesting: ticket.estimationTesting,
          devTimeSpent: ticket.devTimeSpent,
          testingTimeSpent: ticket.testingTimeSpent,
        })),
      },
    );
  }
}
