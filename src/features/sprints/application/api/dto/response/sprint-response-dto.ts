import { SprintStatus } from 'src/features/sprints/domain/enums/sprint-status-enums';
import { Sprint as SprintEntity, DayOff } from '../../../../domain/entities/sprint-entity';
import { PaginatedResult } from 'src/common/interfaces/paginated-result.interface';
import { Sprint } from 'src/features/sprints/domain/schema/sprint-schema';

export class SprintResponseDto {
  constructor(
    public readonly id: string,
    public readonly projectId: string,
    public readonly name: string,
    public readonly status: SprintStatus,
    public readonly startDate: Date,
    public readonly officialStartDate: Date | null,
    public readonly endDate: Date,
    public readonly officialEndDate: Date | null,
    public readonly workingHoursDay: number,
    public readonly sprintDuration: number,
    public readonly dayOff: DayOff[],
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
  ) { }

  static fromEntity(sprint: SprintEntity): SprintResponseDto {
    return new SprintResponseDto(
      sprint.id,
      sprint.projectId,
      sprint.name,
      sprint.status,
      sprint.startDate,
      sprint.officialStartDate,
      sprint.endDate,
      sprint.officialEndDate,
      sprint.workingHoursDay,
      sprint.sprintDuration,
      sprint.dayOff,
      sprint.createdAt,
      sprint.updatedAt,
    );
  }

  static fromEntities(sprints: SprintEntity[]): SprintResponseDto[] {
    return sprints.map((sprint) => SprintResponseDto.fromEntity(sprint));
  }

  static fromPaginatedResult(result: PaginatedResult<SprintEntity>): PaginatedResult<SprintResponseDto> {
    return {
      content: SprintResponseDto.fromEntities(result.content),
      page: result.page,
      size: result.size,
      totalElements: result.totalElements,
      totalPages: result.totalPages,
      numberOfElements: result.numberOfElements,
      firstPage: result.firstPage,
      lastPage: result.lastPage,
    };
  }
}
