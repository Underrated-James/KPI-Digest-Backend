import { PaginatedResult } from 'src/common/interfaces/paginated-result.interface';
import { Ticket as TicketEntity } from 'src/features/tickets/domain/entities/ticket.entity';
import { TicketStatus } from '../../../../domain/enums/ticket-status';

export class TicketResponseDto {
  constructor(
    public readonly id: string,
    public readonly ticketNumber: string,
    public readonly ticketTitle: string,
    public readonly status: TicketStatus,
    public readonly descriptionLink: string,
    public readonly developmentEstimation: number,
    public readonly estimationTesting: number,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
  ) { }

  static fromEntity(ticket: TicketEntity): TicketResponseDto {
    return new TicketResponseDto(
      ticket.id,
      ticket.ticketNumber,
      ticket.ticketTitle,
      ticket.status as TicketStatus,
      ticket.descriptionLink,
      ticket.developmentEstimation,
      ticket.estimationTesting,
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
