import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { TICKET_REPOSITORY } from '../../domain/constants/ticket.constants';
import { type TicketRepository } from '../../infrastracture/repositories/tickets-repository';
import { TEAM_REPOSITORY } from 'src/features/teams/domain/constants/team.constants';
import { type TeamRepository } from 'src/features/teams/infrastracture/repository/team-repository';

@Injectable()
export class GetAvailableMembersUseCase {
  constructor(
    @Inject(TICKET_REPOSITORY)
    private readonly ticketRepository: TicketRepository,
    @Inject(TEAM_REPOSITORY)
    private readonly teamRepository: TeamRepository,
  ) { }

  async execute(ticketId: string) {
    const ticket = await this.ticketRepository.findById(ticketId);
    if (!ticket) {
      throw new NotFoundException(`Ticket with ID ${ticketId} not found`);
    }

    if (!ticket.teamId) {
        // If ticket doesn't have a teamId, try to find it by sprintId
        const team = await this.teamRepository.findBySprintId(ticket.sprintId);
        if (!team) {
            return { devs: [], qas: [] };
        }
        return this.filterMembers(team.users);
    }

    const team = await this.teamRepository.findById(ticket.teamId);
    if (!team) {
      return { devs: [], qas: [] };
    }

    return this.filterMembers(team.users);
  }

  private filterMembers(users: any[]) {
    const devs = users
      .filter(u => u.role === 'DEVS')
      .map(u => ({ userId: u.userId, name: u.name }));
    const qas = users
      .filter(u => u.role === 'QA')
      .map(u => ({ userId: u.userId, name: u.name }));

    return { devs, qas };
  }
}
