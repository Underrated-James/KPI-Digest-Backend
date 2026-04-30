import { Injectable, Inject, ConflictException, BadRequestException } from '@nestjs/common';
import { PROJECT_REPOSITORY } from '../../../../project/domain/constants/project.constants';
import { type ProjectRepository } from '../../../../project/infrastracture/repositories/project.repository';
import { TICKET_REPOSITORY } from '../../../domain/constants/ticket.constants';
import { type TicketRepository } from '../../../infrastracture/repositories/tickets-repository';
import { CreateTicketDto } from '../../api/dto/request/create-ticket-dto';
import { Ticket as TicketEntity } from '../../../domain/entities/ticket.entity';
import { SPRINT_REPOSITORY } from 'src/features/sprints/domain/constants/sprint.constants';
import { type SprintRepository } from 'src/features/sprints/infrastracture/repository/sprint-repository';
import { TEAM_REPOSITORY } from 'src/features/teams/domain/constants/team.constants';
import { type TeamRepository } from 'src/features/teams/infrastracture/repository/team-repository';
import { TicketStatus } from '../../../domain/enums/ticket-status';
import { TicketAssignmentValidatorService } from '../../services/ticket-assignment-validator.service';

@Injectable()
export class CreateTicketUseCase {
  constructor(
    @Inject(PROJECT_REPOSITORY)
    private readonly projectRepository: ProjectRepository,
    @Inject(TICKET_REPOSITORY)
    private readonly ticketRepository: TicketRepository,
    @Inject(SPRINT_REPOSITORY)
    private readonly sprintRepository: SprintRepository,
    @Inject(TEAM_REPOSITORY)
    private readonly teamRepository: TeamRepository,
    private readonly ticketAssignmentValidator: TicketAssignmentValidatorService,
  ) { }

  async execute(dto: CreateTicketDto | CreateTicketDto[]): Promise<TicketEntity | TicketEntity[]> {
    if (Array.isArray(dto)) {
      return this.executeBulk(dto);
    }

    return this.executeSingle(dto);
  }

  private async executeSingle(dto: CreateTicketDto): Promise<TicketEntity> {

    const [sprint, team, existingProject] = await Promise.all([
      dto.sprintId
        ? this.sprintRepository.findById(dto.sprintId)
        : Promise.resolve(null),

      dto.sprintId
        ? this.teamRepository.findBySprintId(dto.sprintId)
        : Promise.resolve(null),

      this.projectRepository.findById(dto.projectId),
    ]);

    await this.validateTicket(dto, null, sprint, team);

    if (!existingProject) {
      throw new BadRequestException('Project not found');
    }

    if (!existingProject.projectCode?.trim()) {
      throw new BadRequestException(
        'Selected project has no project code'
      );
    }
    console.log("existingProject.projectCode:", existingProject.projectCode);
    console.log("typeof existingProject.projectCode:", typeof existingProject.projectCode);

    const project =
      await this.projectRepository.incrementTicketSequence(dto.projectId);

    if (!project) {
      throw new BadRequestException('Project not found');
    }

    const next = String(project.ticketSequence).padStart(3, '0');

    const generatedTicketNumber =
      `${project.projectCode}-${next}`;

    const ticketEntity = this.mapToEntity(
      dto,
      team,
      generatedTicketNumber
    );

    return this.ticketRepository.create(ticketEntity);
  }

  private async executeBulk(dtos: CreateTicketDto[]): Promise<TicketEntity[]> {
    // Group by sprintId to avoid redundant lookups
    const sprintIds = [...new Set(dtos.map(d => d.sprintId).filter(id => !!id))];
    const ticketNumbers = dtos.map(d => d.ticketNumber);

    const [existingTickets, sprints, teams] = await Promise.all([
      this.ticketRepository.findAll().then(ts => ts.filter(t => ticketNumbers.includes(t.ticketNumber))),
      Promise.all(sprintIds.map(id => this.sprintRepository.findById(id!))),
      Promise.all(sprintIds.map(id => this.teamRepository.findBySprintId(id!))),
    ]);

    const sprintMap = new Map(sprints.filter(s => s !== null).map(s => [s!.id, s!]));
    const teamMap = new Map(teams.filter(t => t !== null).map(t => [t!.sprintId, t!]));
    const existingTicketNumbers = new Set(existingTickets.map(t => t.ticketNumber));

    const ticketEntities = await Promise.all(dtos.map(async (dto) => {
      const sprint = dto.sprintId ? sprintMap.get(dto.sprintId) : null;
      const team = dto.sprintId ? teamMap.get(dto.sprintId) : null;
      const existingTicket = existingTicketNumbers.has(dto.ticketNumber) ? { ticketNumber: dto.ticketNumber } : null;

      await this.validateTicket(dto, existingTicket as any, sprint || null, team || null);
      return this.mapToEntity(dto, team || null, dto.ticketNumber);
    }));

    return this.ticketRepository.createMany(ticketEntities);
  }

  private async validateTicket(dto: CreateTicketDto, existingTicket: TicketEntity | null, sprint: any | null, team: any | null): Promise<void> {
    if (!dto.ticketTitle) {
      throw new BadRequestException('Ticket title is required');
    }

    if (!dto.projectId) {
      throw new BadRequestException('Project ID is required');
    }

    if (!dto.descriptionLink) {
      throw new BadRequestException('Description link is required');
    }

    if (existingTicket) {
      throw new ConflictException(`Ticket ${dto.ticketNumber} already exists`);
    }

    await this.ticketAssignmentValidator.assertProjectExists(dto.projectId);
    this.ticketAssignmentValidator.validateSprint(dto.sprintId, sprint, dto.projectId);
    await this.ticketAssignmentValidator.validateAssignments({
      projectId: dto.projectId,
      assignedDevId: dto.assignedDevId || null,
      assignedQaId: dto.assignedQaId || null,
      team,
    });
  }



  private mapToEntity(dto: CreateTicketDto, team: any | null, ticketNumber: string): TicketEntity {
    return new TicketEntity(
      '', // ID will be generated by DB
      dto.projectId,
      dto.sprintId || null,
      team ? team.id : null,
      dto.assignedDevId || null,
      dto.assignedQaId || null,
      ticketNumber,
      TicketStatus.Open,
      dto.ticketTitle,
      dto.descriptionLink,
      dto.description || null,
      dto.estimationTesting || null,
      dto.developmentEstimation || null,
      dto.devTimeSpent || null,
      dto.testingTimeSpent || null,
    );
  }
}
