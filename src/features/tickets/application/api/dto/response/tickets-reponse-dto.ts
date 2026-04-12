import { PaginatedResult } from 'src/common/interfaces/paginated-result.interface';
import { Ticket as TicketEntity } from 'src/features/tickets/domain/entities/ticket.entity';
import { TicketStatus } from '../../../../domain/enums/ticket-status';
import { ProjectStatus } from 'src/features/project/domain/enums/project-status-enums';
import { SprintStatus } from 'src/features/sprints/domain/enums/sprint-status-enums';

export class TicketResponseDto {
  constructor(
    public readonly id: string,
    public readonly projectId: string,
    public readonly sprintId: string,
    public readonly teamId: string | null,
    public readonly assignedDevId: string | null,
    public readonly assignedQaId: string | null,
    public readonly ticketNumber: string,
    public readonly ticketTitle: string,
    public readonly status: TicketStatus,
    public readonly descriptionLink: string,
    public readonly developmentEstimation: number,
    public readonly estimationTesting: number,
    public readonly projectName?: string,
    public readonly projectStatus?: ProjectStatus,
    public readonly sprintName?: string,
    public readonly sprintStatus?: SprintStatus,
    public readonly assignedDevName?: string,
    public readonly assignedDevRole?: string,
    public readonly assignedQaName?: string,
    public readonly assignedQaRole?: string,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
  ) { }

  static fromEntity(ticket: TicketEntity): TicketResponseDto {
    return new TicketResponseDto(
      ticket.id,
      ticket.projectId,
      ticket.sprintId,
      ticket.teamId,
      ticket.assignedDevId,
      ticket.assignedQaId,
      ticket.ticketNumber,
      ticket.ticketTitle,
      ticket.status as TicketStatus,
      ticket.descriptionLink,
      ticket.developmentEstimation,
      ticket.estimationTesting,
      ticket.projectName,
      ticket.projectStatus,
      ticket.sprintName,
      ticket.sprintStatus,
      ticket.assignedDevName,
      ticket.assignedDevRole,
      ticket.assignedQaName,
      ticket.assignedQaRole,
      ticket.createdAt,
      ticket.updatedAt,
    );
  }

  static fromEntities(users: TicketEntity[]): TicketResponseDto[] {
    return users.map((user) => TicketResponseDto.fromEntity(user));
  }

  static fromPaginatedResult(result: PaginatedResult<TicketEntity>): PaginatedResult<TicketResponseDto> {
    return {
      content: TicketResponseDto.fromEntities(result.content),
      page: result.page,
      size: result.size,
      totalElements: result.totalElements,
      totalPages: result.totalPages,
      numberOfElements: result.numberOfElements,
      firstPage: result.firstPage,
      lastPage: result.lastPage,
    };
  }
}
