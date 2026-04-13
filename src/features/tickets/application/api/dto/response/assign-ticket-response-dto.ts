import { PaginatedResult } from '../../../../../../common/interfaces/paginated-result.interface';
import { Ticket as AssignTicketEntity } from '../../../../domain/entities/ticket.entity';
import { TicketStatus } from '../../../../domain/enums/ticket-status';
import { ProjectStatus } from '../../../../../project/domain/enums/project-status-enums';
import { SprintStatus } from '../../../../../sprints/domain/enums/sprint-status-enums';

export class AssignTicketResponseDto {
  constructor(
    public readonly id: string,
    public readonly projectId: string,
    public readonly sprintId: string | null,
    public readonly teamId: string | null,
    public readonly assignedDevId: string | null,
    public readonly assignedQaId: string | null,
    public readonly ticketNumber: string,
    public readonly ticketTitle: string,
    public readonly status: TicketStatus,
    public readonly descriptionLink: string,
    public readonly developmentEstimation: number | null,
    public readonly estimationTesting: number | null,
    public readonly sprintCapacity: number,
    public readonly commitedCapacity: number,
    public readonly availableCapacity: number,
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

  static fromEntity(ticket: AssignTicketEntity): AssignTicketResponseDto {
    return new AssignTicketResponseDto(
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
      ticket.sprintCapacity || 0,
      ticket.commitedCapacity || 0,
      ticket.availableCapacity || 0,
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

  static fromEntities(tickets: AssignTicketEntity[]): AssignTicketResponseDto[] {
    return tickets.map((ticket) => AssignTicketResponseDto.fromEntity(ticket));
  }

  static fromPaginatedResult(result: PaginatedResult<AssignTicketEntity>): PaginatedResult<AssignTicketResponseDto> {
    return {
      content: AssignTicketResponseDto.fromEntities(result.content),
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
