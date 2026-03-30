import { Injectable, Inject } from '@nestjs/common';
import { TICKET_REPOSITORY } from '../../domain/constants/ticket.constants';
import { type TicketRepository } from '../../infrastracture/repositories/tickets-repository';
import { PutTicketDto } from '../api/dto/request/put-ticket-dto';
import { Ticket as TicketsEntity } from '../../domain/entities/ticket.entity';
import { TicketNotFoundError } from '../../presentation/errors/tickets-not-found';

@Injectable()
export class PutTicketUseCase {
  constructor(
    @Inject(TICKET_REPOSITORY)
    private readonly ticketRepository: TicketRepository,
  ) {}

  async execute(id: string, dto: PutTicketDto): Promise<TicketsEntity> {
    const ticketExist = await this.ticketRepository.findById(id);

    if (!ticketExist) {
      throw new TicketNotFoundError(id);
    }

    const updatedTicket = await this.ticketRepository.put(id, dto);

    if (!updatedTicket) {
      throw new TicketNotFoundError(id);
    }

    return updatedTicket;
  }
}
