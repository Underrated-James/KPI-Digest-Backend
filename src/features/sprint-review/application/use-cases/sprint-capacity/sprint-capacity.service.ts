import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { SPRINT_REPOSITORY } from 'src/features/sprints/domain/constants/sprint.constants';
import type { SprintRepository } from 'src/features/sprints/infrastracture/repository/sprint-repository';
import { TICKET_REPOSITORY } from 'src/features/tickets/domain/constants/ticket.constants';
import type { TicketRepository } from 'src/features/tickets/infrastracture/repositories/tickets-repository';


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

        const workingHoursDay = sprint.workingHoursDay;
        const totalCapacityHours = sprint.sprintDuration * workingHoursDay;
        const daysOffHours = (sprint.dayOff?.length || 0) * workingHoursDay;
        const availableCapacityHours = totalCapacityHours - daysOffHours;

        const ticketsWithEstimates = tickets.map(ticket => {
            const devEst = ticket.developmentEstimation ?? 0;
            const qaEst = ticket.estimationTesting ?? 0;
            return {
                id: ticket.id,
                ticketNumber: ticket.ticketNumber,
                ticketTitle: ticket.ticketTitle,
                developmentEstimation: ticket.developmentEstimation,
                estimationTesting: ticket.estimationTesting,
                totalEstimate: devEst + qaEst,
            };
        });

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
