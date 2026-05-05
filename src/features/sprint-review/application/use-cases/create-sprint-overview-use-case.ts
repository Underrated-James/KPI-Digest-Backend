import { Injectable, Inject } from '@nestjs/common';
import { SPRINT_OVERVIEW_REPO } from '../../domain/constants/sprint-overview-constants';
import type { SprintRepository } from '../../infrastracture/repository/sprint-overview-repository';
import { SprintOverviewEntity } from '../../domain/entities/sprint-overview-entity';
import { CreateSprintOverviewDto } from '../api/dto/request/create-sprint-overview-dto';

@Injectable()
export class CreateSprintOverviewUseCase {
  constructor(
    @Inject(SPRINT_OVERVIEW_REPO)
    private readonly sprintRepository: SprintRepository,
  ) {}

  async execute(dto: CreateSprintOverviewDto): Promise<SprintOverviewEntity> {
    const entity = new SprintOverviewEntity(
      '', // ID will be generated
      dto.projectId,
      dto.projectName,
      dto.sprintId,
      dto.sprintName,
      dto.sprintStatus,
      dto.planningStatus,
      new Date(dto.planningStart),
      new Date(dto.planningEnd),
      dto.workingDays,
      dto.actualStart ? new Date(dto.actualStart) : null,
      dto.actualEnd ? new Date(dto.actualEnd) : null,
      dto.teamRhythm,
      dto.holidays.map(h => ({ name: h.name, date: new Date(h.date) })),
      dto.teamId,
      new Date(dto.finalizedAt),
      dto.finalizedBy,
      dto.summary,
      dto.memberMetrics.map(m => ({
        ...m,
        leaveTimeline: m.leaveTimeline.map(lt => ({ ...lt, date: new Date(lt.date) }))
      })),
      dto.sprintTickets,
    );

    return this.sprintRepository.create(entity);
  }
}
