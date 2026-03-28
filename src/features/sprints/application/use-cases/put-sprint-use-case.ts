import { Inject, Injectable, BadRequestException } from '@nestjs/common';
import { type SprintRepository } from '../../infrastracture/repository/sprint-repository';
import { SPRINT_REPOSITORY } from '../../domain/constants/sprint.constants';
import { PutSprintDto } from '../api/dto/request/put-sprint-dto';
import { Sprint as SprintEntity } from '../../domain/entities/sprint-entity';
import { SprintNotFoundError } from './../../presentation/errors/sprint-not-found';
import { DateUtils } from '../../../../shared/date-utils';

@Injectable()
export class PutSprintUseCase {
  constructor(
    @Inject(SPRINT_REPOSITORY)
    private readonly sprintRepository: SprintRepository,
  ) { }

  async execute(id: string, dto: PutSprintDto): Promise<SprintEntity> {
    const sprintExist = await this.sprintRepository.findById(id);

    if (!sprintExist) {
      throw new SprintNotFoundError(id);
    }

    // Normalize dates to start of day in UTC for strict calendar day comparison
    const start = new Date(dto.startDate);
    start.setUTCHours(0, 0, 0, 0);
    const end = new Date(dto.endDate);
    end.setUTCHours(0, 0, 0, 0);

    // Ensure end date is strictly after start date (different days)
    if (end.getTime() <= start.getTime()) {
      throw new BadRequestException('End date must be at least 1 day after the start date');
    }

    // Re-normalize end to end-of-day for range validation of day-offs
    const endRange = new Date(dto.endDate);
    endRange.setUTCHours(23, 59, 59, 999);

    if (dto.dayOff && dto.dayOff.length > 0) {
      for (const off of dto.dayOff) {
        const offDate = new Date(off.date);
        offDate.setUTCHours(0, 0, 0, 0);

        // Check if the day off is outside the range
        if (offDate.getTime() < start.getTime() || offDate.getTime() > endRange.getTime()) {
          throw new BadRequestException(
            `Invalid Day Off: "${off.label}" (${off.date}) is outside the sprint range (${dto.startDate} to ${dto.endDate})`
          );
        }
      }
    }

    // Validate minimum working days after day-offs
    const calculatedDuration = DateUtils.calculateWorkingDays(dto.startDate, dto.endDate, dto.dayOff);
    if (calculatedDuration < 2) {
      throw new BadRequestException('Day off date is invalid.');
    }

    const sprintToUpdate = new SprintEntity(
      id,
      dto.projectId,
      dto.name,
      dto.status,
      new Date(dto.startDate),
      new Date(dto.endDate),
      dto.workingHoursDay,
      dto.sprintDuration,
      dto.dayOff,
      dto.officialStartDate ? new Date(dto.officialStartDate) : null,
      dto.officialEndDate ? new Date(dto.officialEndDate) : null,
    );

    const updatedSprint = await this.sprintRepository.put(id, sprintToUpdate);

    if (!updatedSprint) {
      throw new SprintNotFoundError(id);
    }

    return updatedSprint;
  }
}
