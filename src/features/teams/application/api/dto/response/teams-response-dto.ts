import { SprintStatus } from 'src/features/sprints/domain/enums/sprint-status-enums';
import { Team as TeamEntity, TeamUser } from '../../../../domain/entities/team.entity';
import { ProjectStatus } from 'src/features/project/domain/enums/project-status-enums';
import { PaginatedResult } from 'src/common/interfaces/paginated-result.interface';

export class TeamResponseDto {
  constructor(
    public readonly id: string,
    public readonly projectId: string,
    public readonly projectName: string | undefined,
    public readonly projectStatus: ProjectStatus | undefined,
    public readonly sprintId: string,
    public readonly sprintName: string | undefined,
    public readonly sprintStatus: SprintStatus | undefined,
    public readonly hoursDay: number | undefined,
    public readonly users: TeamUser[],
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
  ) { }

  static fromEntity(team: TeamEntity): TeamResponseDto {
    return new TeamResponseDto(
      team.id,
      team.projectId,
      team.projectName,
      team.projectStatus,
      team.sprintId,
      team.sprintName,
      team.sprintStatus,
      team.hoursDay,
      team.users,
      team.createdAt,
      team.updatedAt,
    );
  }

  static fromEntities(teams: TeamEntity[]): TeamResponseDto[] {
    return teams.map((team) => TeamResponseDto.fromEntity(team));
  }

  static fromPaginatedResult(paginatedResult: PaginatedResult<TeamEntity>): PaginatedResult<TeamResponseDto> {
    return {
      content: TeamResponseDto.fromEntities(paginatedResult.content),
      page: paginatedResult.page,
      size: paginatedResult.size,
      totalElements: paginatedResult.totalElements,
      totalPages: paginatedResult.totalPages,
      numberOfElements: paginatedResult.numberOfElements,
      firstPage: paginatedResult.firstPage,
      lastPage: paginatedResult.lastPage,
    };
  }
}
