import { PaginatedResult } from 'src/common/interfaces/paginated-result.interface';
import { Ticket } from '../../domain/entities/ticket.entity';
import { TicketStatus } from '../../domain/enums/ticket-status';


export interface TicketRepository {
    create(ticket: Ticket): Promise<Ticket>;
    createMany(tickets: Ticket[]): Promise<Ticket[]>;
    findAll(status?: TicketStatus): Promise<Ticket[]>;
    findAllPaginated(page: number, size: number, status?: TicketStatus, projectId?: string, sprintId?: string, teamId?: string ): Promise<PaginatedResult<Ticket>>;
    findById(id: string): Promise<Ticket | null>;
    findTicketNumber(ticketNumber: string): Promise<Ticket | null>;
    patch(id: string, ticket: Partial<Ticket>): Promise<Ticket | null>;
    put(id: string, ticket: Partial<Ticket>): Promise<Ticket | null>;
    delete(id: string): Promise<void>;
}   