import { Injectable } from '@nestjs/common';
import { CreateTicketDto } from '../api/dto/request/create-ticket-dto';
import { PatchTicketDto } from '../api/dto/request/patch-ticket.dto';

@Injectable()
export class TicketsService {
  create(_createTicketDto: CreateTicketDto) {
    return 'This action adds a new ticket';
  }

  findAll() {
    return `This action returns all tickets`;
  }

  findOne(id: number) {
    return `This action returns a #${id} ticket`;
  }

  update(id: number, _updateTicketDto: PatchTicketDto) {
    return `This action updates a #${id} ticket`;
  }

  remove(id: number) {
    return `This action removes a #${id} ticket`;
  }
}
