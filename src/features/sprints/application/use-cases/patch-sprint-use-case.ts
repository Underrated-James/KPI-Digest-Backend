import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { type SprintRepository } from '../../infrastracture/repository/sprint-repository';
import { SPRINT_REPOSITORY } from '../../domain/constants/sprint.constants';
import { Sprint as SprintEntity } from '../../domain/entities/sprint-entity';
import { SprintNotFoundError } from './../../presentation/errors/sprint-not-found';
import { PatchSprintDto } from '../api/dto/request/patch-sprint-dto';
import { DateUtils } from '../../../../shared/date-utils';
import { SprintStatus } from '../../domain/enums/sprint-status-enums';

@Injectable()
export class PatchSprintUseCase {
  constructor(
    @Inject(SPRINT_REPOSITORY)
    private readonly SprintRepository: SprintRepository,
  ) { }

  async execute(id: string, dto: PatchSprintDto): Promise<SprintEntity> {
    const sprintExist = await this.SprintRepository.findById(id);
    if (!sprintExist) {
      throw new SprintNotFoundError(id);
    }

    if (sprintExist.status === SprintStatus.Completed) {
      throw new BadRequestException('Cannot modify a completed sprint');
    }

    if (sprintExist.status === SprintStatus.Active) {
      const providedKeys = Object.entries(dto)
        .filter(([, value]) => value !== undefined)
        .map(([key]) => key);
      const allowedWhenRunning = new Set(['status', 'officialEndDate']);
      const forbidden = providedKeys.filter((key) => !allowedWhenRunning.has(key));
      if (forbidden.length > 0) {
        throw new BadRequestException(
          'This sprint is running. Pause it from Controls to edit details, or complete it.',
        );
      }
      if (dto.status === SprintStatus.Completed && !dto.officialEndDate) {
        throw new BadRequestException('officialEndDate is required when completing a sprint');
      }
    }

    if (dto.status === SprintStatus.Completed && dto.officialEndDate) {
      if (!sprintExist.officialStartDate) {
        throw new BadRequestException('Cannot complete a sprint that has no official start date');
      }
      const endAt = new Date(dto.officialEndDate).getTime();
      const startAt = sprintExist.officialStartDate.getTime();
      if (endAt < startAt) {
        throw new BadRequestException('officialEndDate must be on or after officialStartDate');
      }
    }

    // If any date-related field is updated, we need to re-validate the duration
    if (dto.startDate || dto.endDate || dto.dayOff) {
      const startDate = dto.startDate ? new Date(dto.startDate) : sprintExist.startDate;
      const endDate = dto.endDate ? new Date(dto.endDate) : sprintExist.endDate;
      const dayOff = dto.dayOff || sprintExist.dayOff;

      // Ensure end date is strictly after start date (different days)
      const startNorm = new Date(startDate);
      startNorm.setUTCHours(0, 0, 0, 0);
      const endNorm = new Date(endDate);
      endNorm.setUTCHours(0, 0, 0, 0);

      if (endNorm.getTime() <= startNorm.getTime()) {
        throw new BadRequestException('End date must be at least 1 day after the start date');
      }

      const calculatedDuration = DateUtils.calculateWorkingDays(startDate, endDate, dayOff);
      if (calculatedDuration < 2) {
        throw new BadRequestException('Day off date is invalid');
      }
    }

    const updatedSprint = await this.SprintRepository.patch(id, {
      ...dto,
      startDate: dto.startDate ? new Date(dto.startDate) : undefined,
      endDate: dto.endDate ? new Date(dto.endDate) : undefined,
      officialStartDate: dto.officialStartDate ? new Date(dto.officialStartDate) : undefined,
      officialEndDate: dto.officialEndDate ? new Date(dto.officialEndDate) : undefined,
    } as any); // Cast as any to avoid complex Partial<SprintEntity> mismatch with string fields from DTO

    if (!updatedSprint) {
      throw new SprintNotFoundError(id);
    }

    return updatedSprint;
  }
}
