import { PaginatedResult } from 'src/common/interfaces/paginated-result.interface';
import { Project as ProjectEntity } from 'src/features/project/domain/entities/project.entity';
import { ProjectStatus } from 'src/features/project/domain/enums/project-status-enums';
export class ProjectResponseDto {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly status: ProjectStatus,
    public readonly finishDate: Date,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
  ) { }

  static fromEntity(project: ProjectEntity): ProjectResponseDto {
    return new ProjectResponseDto(
      project.id,
      project.name,
      project.status,
      project._finishDate,
      project._createdAt,
      project._updatedAt,
    );
  }

  static fromEntities(users: ProjectEntity[]): ProjectResponseDto[] {
    return users.map((user) => ProjectResponseDto.fromEntity(user));
  }

  static fromPaginatedResult(result: PaginatedResult<ProjectEntity>): PaginatedResult<ProjectResponseDto> {
    return {
      content: ProjectResponseDto.fromEntities(result.content),
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
