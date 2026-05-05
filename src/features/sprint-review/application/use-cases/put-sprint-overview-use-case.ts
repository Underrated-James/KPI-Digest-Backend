import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { SPRINT_OVERVIEW_REPO } from '../../domain/constants/sprint-overview-constants';
import type { SprintRepository } from '../../infrastracture/repository/sprint-overview-repository';
import { SprintOverviewEntity } from '../../domain/entities/sprint-overview-entity';
import { PutSprintOverviewDto } from '../api/dto/request/put-sprint-overview-dto';

@Injectable()
export class PutSprintOverviewUseCase {
  constructor(
    @Inject(SPRINT_OVERVIEW_REPO)
    private readonly sprintRepository: SprintRepository,
  ) {}

  async execute(id: string, dto: PutSprintOverviewDto): Promise<SprintOverviewEntity> {
    const existing = await this.sprintRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(`Sprint overview with ID ${id} not found`);
    }

    const entity = new SprintOverviewEntity(
      id,
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

    const updated = await this.sprintRepository.put(id, entity);
    return updated!;
  }
}
