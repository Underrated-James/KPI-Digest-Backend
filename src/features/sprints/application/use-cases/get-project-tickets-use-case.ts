import { Injectable, Inject } from '@nestjs/common';
import { PaginatedResult } from 'src/common/interfaces/paginated-result.interface';
import { TICKET_REPOSITORY } from '../../../tickets/domain/constants/ticket.constants';
import { type TicketRepository } from '../../../tickets/infrastracture/repositories/tickets-repository';
import { TicketStatus } from '../../../tickets/domain/enums/ticket-status';
import { Ticket as TicketEntity } from '../../../tickets/domain/entities/ticket.entity';

@Injectable()
export class GetProjectTicketsUseCase {
    constructor(
        @Inject(TICKET_REPOSITORY)
        private readonly ticketRepository: TicketRepository,
    ) { }

    async execute(
        projectId: string,
        page?: number,
        size?: number,
        status?: TicketStatus,
        sprintId?: string,
        search?: string,
    ): Promise<PaginatedResult<TicketEntity> | TicketEntity[]> {
        if (page !== undefined && size !== undefined) {
            return this.ticketRepository.findAllPaginated(
                page,
                size,
                status,
                projectId,
                sprintId,
                undefined,
                search,
            );
        }
        return this.ticketRepository.findAll(status, projectId, sprintId, undefined);
    }
}