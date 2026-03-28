import { Injectable, Inject } from '@nestjs/common';
import { type ProjectRepository } from '../../../infrastracture/repositories/project.repository';
import { PROJECT_REPOSITORY } from '../../../domain/constants/project.constants';
import { Project as ProjectEntity } from '../../../domain/entities/project.entity';
import { ProjectNotFoundError } from '../../../presentation/errors/project-not-found';
import { PutProjectDto } from '../dto/request/put-project-dto';

@Injectable()
export class PutProjectUseCase {
  constructor(
    @Inject(PROJECT_REPOSITORY)
    private readonly projectRepository: ProjectRepository,
  ) {}

  async execute(id: string, dto: PutProjectDto): Promise<ProjectEntity> {
    const projectExist = await this.projectRepository.findById(id);

    if (!projectExist) {
      throw new ProjectNotFoundError(id);
    }

    const updatedProject = await this.projectRepository.put(id, dto);

    if (!updatedProject) {
      throw new ProjectNotFoundError(id);
    }

    return updatedProject;
  }
}
