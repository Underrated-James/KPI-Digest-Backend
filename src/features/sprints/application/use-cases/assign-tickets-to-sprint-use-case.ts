import { Injectable, Inject, BadRequestException, NotFoundException } from '@nestjs/common';
import { TICKET_REPOSITORY } from '../../../tickets/domain/constants/ticket.constants';
import { type TicketRepository } from '../../../tickets/infrastracture/repositories/tickets-repository';
import { SPRINT_REPOSITORY } from '../../domain/constants/sprint.constants';
import { type SprintRepository } from '../../infrastracture/repository/sprint-repository';
import { AssignTicketsToSprintDto } from '../api/dto/request/assign-tickets-to-sprint-dto';
import { Ticket as TicketEntity } from '../../../tickets/domain/entities/ticket.entity';

@Injectable()
export class AssignTicketsToSprintUseCase {
    constructor(
        @Inject(TICKET_REPOSITORY)
        private readonly ticketRepository: TicketRepository,
        @Inject(SPRINT_REPOSITORY)
        private readonly sprintRepository: SprintRepository,
    ) { }

    async execute(sprintId: string, dto: AssignTicketsToSprintDto): Promise<TicketEntity[]> {
        const sprint = await this.sprintRepository.findById(sprintId);
        if (!sprint) {
            throw new NotFoundException(`Sprint with ID ${sprintId} not found`);
        }

        const { ticketIds } = dto;

        if (!ticketIds || ticketIds.length === 0) {
            throw new BadRequestException('At least one ticket ID is required');
        }

        const tickets = await Promise.all(
            ticketIds.map(id => this.ticketRepository.findById(id)),
        );

        for (let i = 0; i < tickets.length; i++) {
            const ticket = tickets[i];
            if (!ticket) {
                throw new NotFoundException(`Ticket with ID ${ticketIds[i]} not found`);
            }

            if (ticket.projectId !== sprint.projectId) {
                throw new BadRequestException(
                    `Ticket ${ticket.ticketNumber} (projectId: ${ticket.projectId}) does not belong to the same project as the sprint (projectId: ${sprint.projectId})`,
                );
            }
        }

        const updates = ticketIds.map(ticketId => ({
            id: ticketId,
            data: { sprintId } as Partial<TicketEntity>,
        }));

        return this.ticketRepository.patchMany(updates);
    }
}