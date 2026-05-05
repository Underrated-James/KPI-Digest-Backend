
import { PaginatedResult } from "src/common/interfaces/paginated-result.interface";
import { SprintOverviewEntity } from "src/features/sprint-review/domain/entities/sprint-overview-entity";

export class SprintOverviewResponseDto {
  constructor(
    public readonly id: string,
    public readonly projectId: string,
    public readonly projectName: string,
    public readonly sprintId: string,
    public readonly sprintName: string,
    public readonly sprintStatus: string,
    public readonly planningStatus: string,
    public readonly planningStart: Date,
    public readonly planningEnd: Date,
    public readonly workingDays: number,
    public readonly actualStart: Date | null,
    public readonly actualEnd: Date | null,
    public readonly teamRhythm: number,
    public readonly holidays: any[],
    public readonly teamId: string,
    public readonly finalizedAt: Date,
    public readonly finalizedBy: string,
    public readonly summary: any,
    public readonly memberMetrics: any[],
    public readonly sprintTickets: any[],
    public readonly isDeleted: boolean,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
  ) {}

  static fromEntity(entity: SprintOverviewEntity): SprintOverviewResponseDto {
    return new SprintOverviewResponseDto(
      entity.id,
      entity.projectId,
      entity.projectName,
      entity.sprintId,
      entity.sprintName,
      entity.sprintStatus,
      entity.planningStatus,
      entity.planningStart,
      entity.planningEnd,
      entity.workingDays,
      entity.actualStart,
      entity.actualEnd,
      entity.teamRhythm,
      entity.holidays,
      entity.teamId,
      entity.finalizedAt,
      entity.finalizedBy,
      entity.summary,
      entity.memberMetrics,
      entity.sprintTickets,
      entity.isDeleted,
      entity.createdAt,
      entity.updatedAt,
    );
  }

  static fromEntities(entities: SprintOverviewEntity[]): SprintOverviewResponseDto[] {
    return entities.map(entity => SprintOverviewResponseDto.fromEntity(entity));
  }

  static fromPaginatedResult(result: PaginatedResult<SprintOverviewEntity>): PaginatedResult<SprintOverviewResponseDto> {
    return {
      content: SprintOverviewResponseDto.fromEntities(result.content),
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
