import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { TICKET_REPOSITORY } from '../../../domain/constants/ticket.constants';
import { type TicketRepository } from '../../../infrastracture/repositories/tickets-repository';
import { TEAM_REPOSITORY } from 'src/features/teams/domain/constants/team.constants';
import { type TeamRepository } from 'src/features/teams/infrastracture/repository/team-repository';
import { PROJECT_REPOSITORY } from 'src/features/project/domain/constants/project.constants';
import { type ProjectRepository } from 'src/features/project/infrastracture/repositories/project.repository';

@Injectable()
export class GetAvailableMembersUseCase {
  constructor(
    @Inject(TICKET_REPOSITORY)
    private readonly ticketRepository: TicketRepository,
    @Inject(TEAM_REPOSITORY)
    private readonly teamRepository: TeamRepository,
    @Inject(PROJECT_REPOSITORY)
    private readonly projectRepository: ProjectRepository,
  ) { }

  async execute(ticketId: string) {
    const ticket = await this.ticketRepository.findById(ticketId);
    if (!ticket) {
      throw new NotFoundException(`Ticket with ID ${ticketId} not found`);
    }

    const [devs, qas] = await Promise.all([
      this.projectRepository.getMembersByRole(ticket.projectId, 'DEVS'),
      this.projectRepository.getMembersByRole(ticket.projectId, 'QA'),
    ]);

    if (devs.length || qas.length) {
      return {
        devs: devs.map((user) => ({ userId: user.id, name: user.name })),
        qas: qas.map((user) => ({ userId: user.id, name: user.name })),
      };
    }

    const team = ticket.teamId
      ? await this.teamRepository.findById(ticket.teamId)
      : ticket.sprintId
        ? await this.teamRepository.findBySprintId(ticket.sprintId)
        : null;

    if (!team) {
      return { devs: [], qas: [] };
    }

    await Promise.all(
      [...new Set(team.users.map((user) => user.userId))].map((userId) =>
        this.projectRepository.addMember(ticket.projectId, userId),
      ),
    );

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
