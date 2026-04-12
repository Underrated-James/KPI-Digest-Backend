import { Injectable, Inject, BadRequestException, UnprocessableEntityException } from '@nestjs/common';
import { TICKET_REPOSITORY } from '../../domain/constants/ticket.constants';
import { type TicketRepository } from '../../infrastracture/repositories/tickets-repository';
import { PatchTicketDto } from '../api/dto/request/patch-ticket.dto';
import { TicketNotFoundError } from '../../presentation/errors/tickets-not-found';
import { Ticket as TicketsEntity } from '../../domain/entities/ticket.entity';
import { TEAM_REPOSITORY } from 'src/features/teams/domain/constants/team.constants';
import { SPRINT_REPOSITORY } from 'src/features/sprints/domain/constants/sprint.constants';
import { type TeamRepository } from 'src/features/teams/infrastracture/repository/team-repository';
import { type SprintRepository } from 'src/features/sprints/infrastracture/repository/sprint-repository';
import { USER_REPOSITORY } from 'src/features/users/domain/constants/user.constants';
import { type UserRepository } from 'src/features/users/infrastracture/repositories/user.repository';

@Injectable()
export class PatchTicketUseCase {
  constructor(
    @Inject(TICKET_REPOSITORY)
    private readonly ticketRepository: TicketRepository,
    @Inject(TEAM_REPOSITORY)
    private readonly teamRepository: TeamRepository,
    @Inject(SPRINT_REPOSITORY)
    private readonly sprintRepository: SprintRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) { }

  async execute(id: string, dto: PatchTicketDto): Promise<TicketsEntity> {
    const ticket = await this.ticketRepository.findById(id);
    if (!ticket) {
      throw new TicketNotFoundError(id);
    }

    // If sprintId, assignedDevId or assignedQaId is changing, we need to validate
    const sprintId = dto.sprintId || ticket.sprintId;
    const assignedDevId = dto.assignedDevId !== undefined ? dto.assignedDevId : ticket.assignedDevId;
    const assignedQaId = dto.assignedQaId !== undefined ? dto.assignedQaId : ticket.assignedQaId;

    if (dto.sprintId || dto.assignedDevId !== undefined || dto.assignedQaId !== undefined) {
      const [sprint, team] = await Promise.all([
        this.sprintRepository.findById(sprintId),
        this.teamRepository.findBySprintId(sprintId),
      ]);

      if (!sprint) {
        throw new BadRequestException(`Sprint with ID ${sprintId} not found`);
      }

      if (assignedDevId) {
        const user = await this.userRepository.findById(assignedDevId);
        if (!user) {
          throw new UnprocessableEntityException(`Assigned Developer with ID ${assignedDevId} not found`);
        }
        if (user.role !== 'DEVS') {
          throw new UnprocessableEntityException(`User ${user.name} is not a Developer (Role: ${user.role})`);
        }
        if (team) {
          const isMember = team.users.some(u => u.userId === assignedDevId);
          if (!isMember) {
            throw new UnprocessableEntityException(`User ${user.name} is not a member of the team for Sprint: ${sprintId}`);
          }
        }
      }

      if (assignedQaId) {
        const user = await this.userRepository.findById(assignedQaId);
        if (!user) {
          throw new UnprocessableEntityException(`Assigned QA with ID ${assignedQaId} not found`);
        }
        if (user.role !== 'QA') {
          throw new UnprocessableEntityException(`User ${user.name} is not a QA (Role: ${user.role})`);
        }
        if (team) {
          const isMember = team.users.some(u => u.userId === assignedQaId);
          if (!isMember) {
            throw new UnprocessableEntityException(`User ${user.name} is not a member of the team for Sprint: ${sprintId}`);
          }
        }
      }
    }

    const updatedTicket = await this.ticketRepository.patch(id, dto);
    if (!updatedTicket) {
      throw new TicketNotFoundError(id);
    }

    return updatedTicket;
  }
}
