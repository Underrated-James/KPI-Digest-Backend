import { SprintStatus } from 'src/features/sprints/domain/enums/sprint-status-enums';
import { Sprint as SprintEntity, DayOff } from '../../../../domain/entities/sprint.entity';

export class SprintResponseDto {
  constructor(
    public readonly id: string,
    public readonly projectId: string,
    public readonly name: string,
    public readonly sprintDuration: number,
    public readonly status: SprintStatus,
    public readonly startDate: Date,
    public readonly endDate: Date,
    public readonly workingHoursDay: number,
    public readonly dayOff: DayOff[],
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
  ) {}

  static fromEntity(sprint: SprintEntity): SprintResponseDto {
    return new SprintResponseDto(
      sprint.id,
      sprint.projectId,
      sprint.name,
      sprint.sprintDuration,
      sprint.status,
      sprint.startDate,
      sprint.endDate,
      sprint.workingHoursDay,
      sprint.dayOff,
      sprint.createdAt,
      sprint.updatedAt,
    );
  }

  static fromEntities(sprints: SprintEntity[]): SprintResponseDto[] {
    return sprints.map((sprint) => SprintResponseDto.fromEntity(sprint));
  }
}
