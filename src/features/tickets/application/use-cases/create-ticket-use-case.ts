import { Injectable, Inject, ConflictException, BadRequestException, UnprocessableEntityException } from '@nestjs/common';
import { TICKET_REPOSITORY } from '../../domain/constants/ticket.constants';
import { type TicketRepository } from '../../infrastracture/repositories/tickets-repository';
import { CreateTicketDto } from '../api/dto/request/create-ticket-dto';
import { Ticket as TicketEntity } from '../../domain/entities/ticket.entity';
import { SPRINT_REPOSITORY } from 'src/features/sprints/domain/constants/sprint.constants';
import { type SprintRepository } from 'src/features/sprints/infrastracture/repository/sprint-repository';
import { TEAM_REPOSITORY } from 'src/features/teams/domain/constants/team.constants';
import { type TeamRepository } from 'src/features/teams/infrastracture/repository/team-repository';
import { USER_REPOSITORY } from 'src/features/users/domain/constants/user.constants';
import { type UserRepository } from 'src/features/users/infrastracture/repositories/user.repository';
import { TicketStatus } from '../../domain/enums/ticket-status';

@Injectable()
export class CreateTicketUseCase {
  constructor(
    @Inject(TICKET_REPOSITORY)
    private readonly ticketRepository: TicketRepository,
    @Inject(SPRINT_REPOSITORY)
    private readonly sprintRepository: SprintRepository,
    @Inject(TEAM_REPOSITORY)
    private readonly teamRepository: TeamRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) { }

  async execute(dto: CreateTicketDto | CreateTicketDto[]): Promise<TicketEntity | TicketEntity[]> {
    if (Array.isArray(dto)) {
      return this.executeBulk(dto);
    }

    return this.executeSingle(dto);
  }

  private async executeSingle(dto: CreateTicketDto): Promise<TicketEntity> {
    const [existingTicket, sprint, team] = await Promise.all([
      this.ticketRepository.findTicketNumber(dto.ticketNumber),
      this.sprintRepository.findById(dto.sprintId),
      this.teamRepository.findBySprintId(dto.sprintId),
    ]);

    await this.validateTicket(dto, existingTicket, sprint, team);

    const ticketEntity = this.mapToEntity(dto, team);
    return this.ticketRepository.create(ticketEntity);
  }

  private async executeBulk(dtos: CreateTicketDto[]): Promise<TicketEntity[]> {
    // Group by sprintId to avoid redundant lookups
    const sprintIds = [...new Set(dtos.map(d => d.sprintId))];
    const ticketNumbers = dtos.map(d => d.ticketNumber);

    const [existingTickets, sprints, teams] = await Promise.all([
      this.ticketRepository.findAll().then(ts => ts.filter(t => ticketNumbers.includes(t.ticketNumber))),
      Promise.all(sprintIds.map(id => this.sprintRepository.findById(id))),
      Promise.all(sprintIds.map(id => this.teamRepository.findBySprintId(id))),
    ]);

    const sprintMap = new Map(sprints.filter(s => s !== null).map(s => [s!.id, s!]));
    const teamMap = new Map(teams.filter(t => t !== null).map(t => [t!.sprintId, t!]));
    const existingTicketNumbers = new Set(existingTickets.map(t => t.ticketNumber));

    const ticketEntities = await Promise.all(dtos.map(async (dto) => {
      const sprint = sprintMap.get(dto.sprintId);
      const team = teamMap.get(dto.sprintId);
      const existingTicket = existingTicketNumbers.has(dto.ticketNumber) ? { ticketNumber: dto.ticketNumber } : null;

      await this.validateTicket(dto, existingTicket as any, sprint || null, team || null);
      return this.mapToEntity(dto, team || null);
    }));

    return this.ticketRepository.createMany(ticketEntities);
  }

  private async validateTicket(dto: CreateTicketDto, existingTicket: TicketEntity | null, sprint: any | null, team: any | null): Promise<void> {
    if (existingTicket) {
      throw new ConflictException(`Ticket ${dto.ticketNumber} already exists`);
    }

    if (!sprint) {
      throw new BadRequestException(`Sprint with ID ${dto.sprintId} not found`);
    }

    if (dto.projectId !== sprint.projectId) {
      throw new BadRequestException(`Project ID ${dto.projectId} does not match the sprint's project ID ${sprint.projectId}`);
    }

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
        const isMember = team.users.some((u: any) => u.userId === assignedDevId);
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
        const isMember = team.users.some((u: any) => u.userId === assignedQaId);
        if (!isMember) {
          throw new UnprocessableEntityException(`User ${user.name} is not a member of the team for Sprint: ${dto.sprintId}`);
        }
      }
    }
  }

  private mapToEntity(dto: CreateTicketDto, team: any | null): TicketEntity {
    return new TicketEntity(
      '', // ID will be generated by DB
      dto.projectId,
      dto.sprintId,
      team ? team.id : null,
      dto.assignedDevId || null,
      dto.assignedQaId || null,
      dto.ticketNumber,
      TicketStatus.Open,
      dto.ticketTitle,
      dto.descriptionLink,
      dto.estimationTesting,
      dto.developmentEstimation,
    );
  }
}
