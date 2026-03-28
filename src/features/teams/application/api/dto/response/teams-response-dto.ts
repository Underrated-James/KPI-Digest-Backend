import { SprintStatus } from 'src/features/sprints/domain/enums/sprint-status-enums';
import { Team as TeamEntity } from '../../../../domain/entities/team.entity';
import { ProjectStatus } from 'src/features/project/domain/enums/project-status-enums';
import { ListOfUsers } from '../../dto/request/create-team.dto';
import { PaginatedResult } from 'src/common/interfaces/paginated-result.interface';

export class TeamResponseDto {
  constructor(
    public readonly id: string,
    public readonly projectId: string,
    public readonly projectName: string,
    public readonly projectStatus: ProjectStatus,
    public readonly sprintId: string,
    public readonly sprintName: string,
    public readonly sprintStatus: SprintStatus,
    public readonly HoursDay: number,
    public readonly userIds: ListOfUsers[],
    public readonly allocationPercentage: number,
    public readonly calculatedHoursPerDay: number,
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
      team._HoursDay,
      team.userIds,
      team.allocationPercentage,
      team.calculatedHoursPerDay,
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
