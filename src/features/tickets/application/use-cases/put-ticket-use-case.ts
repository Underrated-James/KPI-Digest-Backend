import { Injectable, Inject, BadRequestException, UnprocessableEntityException } from '@nestjs/common';
import { TICKET_REPOSITORY } from '../../domain/constants/ticket.constants';
import { type TicketRepository } from '../../infrastracture/repositories/tickets-repository';
import { PutTicketDto } from '../api/dto/request/put-ticket-dto';
import { Ticket as TicketsEntity } from '../../domain/entities/ticket.entity';
import { TicketNotFoundError } from '../../presentation/errors/tickets-not-found';
import { TEAM_REPOSITORY } from 'src/features/teams/domain/constants/team.constants';
import { SPRINT_REPOSITORY } from 'src/features/sprints/domain/constants/sprint.constants';
import { type TeamRepository } from 'src/features/teams/infrastracture/repository/team-repository';
import { type SprintRepository } from 'src/features/sprints/infrastracture/repository/sprint-repository';
import { USER_REPOSITORY } from 'src/features/users/domain/constants/user.constants';
import { type UserRepository } from 'src/features/users/infrastracture/repositories/user.repository';

@Injectable()
export class PutTicketUseCase {
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

  async execute(id: string, dto: PutTicketDto): Promise<TicketsEntity> {
    const ticketExist = await this.ticketRepository.findById(id);

    if (!ticketExist) {
      throw new TicketNotFoundError(id);
    }

    // Integrity checks for PUT
    const [sprint, team] = await Promise.all([
      this.sprintRepository.findById(dto.sprintId),
      this.teamRepository.findBySprintId(dto.sprintId),
    ]);

    if (!sprint) {
      throw new BadRequestException(`Sprint with ID ${dto.sprintId} not found`);
    }

    if (dto.projectId !== sprint.projectId) {
      throw new BadRequestException(`Project ID ${dto.projectId} does not match the sprint's project ID ${sprint.projectId}`);
    }

    // Team Membership Guard Check
    const assignedDevId = dto.assignedDevId || null;
    const assignedQaId = dto.assignedQaId || null;

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
          throw new UnprocessableEntityException(`User ${user.name} is not a member of the team for Sprint: ${dto.sprintId}`);
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
          throw new UnprocessableEntityException(`User ${user.name} is not a member of the team for Sprint: ${dto.sprintId}`);
        }
      }
    }

    // Create full entity for repository put
    const ticketToPut = new TicketsEntity(
      id,
      dto.projectId,
      dto.sprintId,
      team?.id || null,
      assignedDevId,
      assignedQaId,
      dto.ticketNumber,
      dto.status,
      dto.ticketTitle,
      dto.descriptionLink,
      dto.estimationTesting,
      dto.developmentEstimation,
    );

    const updatedTicket = await this.ticketRepository.put(id, ticketToPut);

    if (!updatedTicket) {
      throw new TicketNotFoundError(id);
    }

    return updatedTicket;
  }
}
