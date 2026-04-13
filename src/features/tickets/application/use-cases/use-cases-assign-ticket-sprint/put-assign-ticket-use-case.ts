import { Injectable, Inject, BadRequestException, UnprocessableEntityException } from '@nestjs/common';
import { TICKET_REPOSITORY } from '../../../domain/constants/ticket.constants';
import { type TicketRepository } from '../../../infrastracture/repositories/tickets-repository';
import { PutAssignTicketDto } from '../../api/dto/request/put-assign-ticket-dto';
import { Ticket as TicketEntity } from '../../../domain/entities/ticket.entity';
import { TicketNotFoundError } from '../../../presentation/errors/tickets-not-found';
import { TEAM_REPOSITORY } from '../../../../teams/domain/constants/team.constants';
import { SPRINT_REPOSITORY } from '../../../../sprints/domain/constants/sprint.constants';
import { type TeamRepository } from '../../../../teams/infrastracture/repository/team-repository';
import { type SprintRepository } from '../../../../sprints/infrastracture/repository/sprint-repository';
import { USER_REPOSITORY } from '../../../../users/domain/constants/user.constants';
import { type UserRepository } from '../../../../users/infrastracture/repositories/user.repository';

@Injectable()
export class PutAssignTicketUseCase {
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

  async execute(id: string, dto: PutAssignTicketDto): Promise<TicketEntity> {
    const ticketExist = await this.ticketRepository.findById(id);

    if (!ticketExist) {
      throw new TicketNotFoundError(id);
    }

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

    const assignedDevId = dto.assignedDevId;
    const assignedQaId = dto.assignedQaId;

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

    const ticketToPut = new TicketEntity(
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
      dto.sprintCapacity,
      dto.commitedCapacity,
      dto.availableCapacity,
    );

    const updatedTicket = await this.ticketRepository.put(id, ticketToPut);

    if (!updatedTicket) {
      throw new TicketNotFoundError(id);
    }

    return updatedTicket;
  }
}
