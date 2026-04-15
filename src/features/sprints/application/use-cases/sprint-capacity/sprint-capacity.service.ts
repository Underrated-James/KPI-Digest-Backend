import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { TICKET_REPOSITORY } from '../../../../tickets/domain/constants/ticket.constants';
import { type TicketRepository } from '../../../../tickets/infrastracture/repositories/tickets-repository';
import { SPRINT_REPOSITORY } from '../../../domain/constants/sprint.constants';
import { type SprintRepository } from '../../../infrastracture/repository/sprint-repository';

export interface SprintCapacityResult {
    sprintId: string;
    sprintName: string;
    totalCapacityHours: number;
    daysOffHours: number;
    availableCapacityHours: number;
    plannedLoadHours: number;
    remainingCapacityHours: number;
    ticketCount: number;
    tickets: {
        id: string;
        ticketNumber: string;
        ticketTitle: string;
        developmentEstimation: number | null;
        estimationTesting: number | null;
        totalEstimate: number;
    }[];
}

@Injectable()
export class SprintCapacityService {
    constructor(
        @Inject(TICKET_REPOSITORY)
        private readonly ticketRepository: TicketRepository,
        @Inject(SPRINT_REPOSITORY)
        private readonly sprintRepository: SprintRepository,
    ) {}

    async calculateCapacity(sprintId: string): Promise<SprintCapacityResult> {
        const sprint = await this.sprintRepository.findById(sprintId);
        if (!sprint) {
            throw new NotFoundException(`Sprint with ID ${sprintId} not found`);
        }

        const tickets = await this.ticketRepository.findAvailableForSprint(
            sprint.projectId,
            sprintId,
            undefined,
        );

        const totalCapacityHours = sprint.sprintDuration * sprint.workingHoursDay;

        const daysOffHours = sprint.dayOff.reduce((total) => {
            return total + sprint.workingHoursDay;
        }, 0);

        const availableCapacityHours = totalCapacityHours - daysOffHours;

        const ticketsWithEstimates = tickets.map(ticket => ({
            id: ticket.id,
            ticketNumber: ticket.ticketNumber,
            ticketTitle: ticket.ticketTitle,
            developmentEstimation: ticket.developmentEstimation ?? null,
            estimationTesting: ticket.estimationTesting ?? null,
            totalEstimate: (ticket.developmentEstimation ?? 0) + (ticket.estimationTesting ?? 0),
        }));

        const plannedLoadHours = ticketsWithEstimates.reduce(
            (sum, ticket) => sum + ticket.totalEstimate,
            0,
        );

        const remainingCapacityHours = availableCapacityHours - plannedLoadHours;

        return {
            sprintId: sprint.id,
            sprintName: sprint.name,
            totalCapacityHours,
            daysOffHours,
            availableCapacityHours,
            plannedLoadHours,
            remainingCapacityHours,
            ticketCount: tickets.length,
            tickets: ticketsWithEstimates,
        };
    }
}