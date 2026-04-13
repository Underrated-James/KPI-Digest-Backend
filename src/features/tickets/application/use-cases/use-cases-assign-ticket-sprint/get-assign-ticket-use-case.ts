import { Injectable, Inject } from '@nestjs/common';
import { TICKET_REPOSITORY } from '../../../domain/constants/ticket.constants';
import { type TicketRepository } from '../../../infrastracture/repositories/tickets-repository';
import { Ticket as TicketEntity } from '../../../domain/entities/ticket.entity';
import { TicketStatus } from '../../../domain/enums/ticket-status';

@Injectable()
export class GetAssignTicketsUseCase {
  constructor(
    @Inject(TICKET_REPOSITORY)
    private readonly ticketRepository: TicketRepository,
  ) {}

  async execute(
    status?: TicketStatus,
    projectId?: string,
    sprintId?: string,
    teamId?: string,
  ): Promise<TicketEntity[]> {
    // We can use the same findAll or a specialized one if needed
    // For now, let's filter tickets that have capacity info if needed, or just all tickets
    return this.ticketRepository.findAll(status, projectId, sprintId, teamId);
  }
}
