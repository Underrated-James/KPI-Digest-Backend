import { Injectable, Inject } from '@nestjs/common';
import { PaginatedResult } from 'src/common/interfaces/paginated-result.interface';
import { TICKET_REPOSITORY } from '../../domain/constants/ticket.constants';
import { type TicketRepository } from '../../infrastracture/repositories/tickets-repository';
import { TicketStatus } from '../../domain/enums/ticket-status';
import { Ticket as TicketsEntity } from '../../domain/entities/ticket.entity';

@Injectable()
export class GetTicketsUseCase {
    constructor(
        @Inject(TICKET_REPOSITORY)
        private readonly ticketRepository: TicketRepository,
    ) { }
    
    async execute(page: number, size: number, status?: TicketStatus, projectId?: string, sprintId?: string, teamId?: string ): Promise<PaginatedResult<TicketsEntity>> {
        return this.ticketRepository.findAllPaginated(page, size, status, projectId, sprintId, teamId);
    }
}
