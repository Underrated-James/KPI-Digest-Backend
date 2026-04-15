import { Injectable, Inject, BadRequestException, NotFoundException } from '@nestjs/common';
import { TICKET_REPOSITORY } from '../../../tickets/domain/constants/ticket.constants';
import { type TicketRepository } from '../../../tickets/infrastracture/repositories/tickets-repository';
import { TicketStatus } from '../../../tickets/domain/enums/ticket-status';
import { Ticket as TicketEntity } from '../../../tickets/domain/entities/ticket.entity';
import { SPRINT_REPOSITORY } from '../../domain/constants/sprint.constants';
import { type SprintRepository } from '../../infrastracture/repository/sprint-repository';
import { PROJECT_REPOSITORY } from 'src/features/project/domain/constants/project.constants';
import { type ProjectRepository } from 'src/features/project/infrastracture/repositories/project.repository';

@Injectable()
export class GetAvailableTicketsForSprintUseCase {
    constructor(
        @Inject(TICKET_REPOSITORY)
        private readonly ticketRepository: TicketRepository,
        @Inject(SPRINT_REPOSITORY)
        private readonly sprintRepository: SprintRepository,
        @Inject(PROJECT_REPOSITORY)
        private readonly projectRepository: ProjectRepository,
    ) { }

    async execute(sprintId: string): Promise<{ available: TicketEntity[]; assigned: TicketEntity[] }> {
        const sprint = await this.sprintRepository.findById(sprintId);
        if (!sprint) {
            throw new NotFoundException(`Sprint with ID ${sprintId} not found`);
        }

        const project = await this.projectRepository.findById(sprint.projectId);
        if (!project) {
            throw new BadRequestException(`Project with ID ${sprint.projectId} not found`);
        }

        const allowedStatuses: TicketStatus[] = [
            TicketStatus.Open,
            TicketStatus.InProgress,
        ];

        const allProjectTickets = await this.ticketRepository.findAvailableForSprint(
            sprint.projectId,
            undefined,
            allowedStatuses,
        );

        const available = allProjectTickets.filter(
            ticket => ticket.sprintId === null || ticket.sprintId === sprintId,
        );

        const assigned = allProjectTickets.filter(
            ticket => ticket.sprintId !== null && ticket.sprintId !== sprintId,
        );

        return { available, assigned };
    }
}