import { Injectable, Inject} from '@nestjs/common';
import { TICKET_REPOSITORY } from '../../domain/constants/ticket.constants';
import { type TicketRepository } from '../../infrastracture/repositories/tickets-repository';
import { PatchTicketDto } from '../api/dto/request/patch-ticket.dto';
import { TicketNotFoundError } from '../../presentation/errors/tickets-not-found';
import { Ticket as TicketsEntity } from '../../domain/entities/ticket.entity';

@Injectable()
export class PatchTicketUseCase {
  constructor(
    @Inject(TICKET_REPOSITORY)
    private readonly ticketRepository: TicketRepository,
  ) {}

  async execute(id: string, dto: PatchTicketDto): Promise<TicketsEntity> {
    const updatedTicket = await this.ticketRepository.patch(id, dto);

    if (!updatedTicket) {
      throw new TicketNotFoundError(id);
    }
    
    return updatedTicket;
  }
}
