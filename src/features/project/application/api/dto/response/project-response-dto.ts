import { Project as ProjectEntity } from 'src/features/project/domain/entities/project.entity';

export class ProjectResponseDto {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly status: boolean,
    public readonly finishDate: Date,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
  ) {}

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
}
