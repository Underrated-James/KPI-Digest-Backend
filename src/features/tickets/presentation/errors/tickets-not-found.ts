import { NotFoundException } from '@nestjs/common';

export class TicketNotFoundError extends NotFoundException {
    constructor(ticketNumber: string) {
        super(`Ticket with id '${ticketNumber}' not found`);
    }
}