import { Injectable, Inject } from '@nestjs/common';
import { TICKET_REPOSITORY } from '../../../domain/constants/ticket.constants';
import { type TicketRepository } from '../../../infrastracture/repositories/tickets-repository';
import { Ticket as TicketEntity } from '../../../domain/entities/ticket.entity';
import { TicketNotFoundError } from '../../../presentation/errors/tickets-not-found';

@Injectable()
export class GetAssignTicketByIdUseCase {
  constructor(
    @Inject(TICKET_REPOSITORY)
    private readonly ticketRepository: TicketRepository,
  ) {}

  async execute(id: string): Promise<TicketEntity> {
    const ticket = await this.ticketRepository.findById(id);
    if (!ticket) {
      throw new TicketNotFoundError(id);
    }
    return ticket;
  }
}
