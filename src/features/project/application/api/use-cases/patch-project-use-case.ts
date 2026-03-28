import { Injectable, Inject} from '@nestjs/common';
import { type ProjectRepository } from '../../../infrastracture/repositories/project.repository';
import { PROJECT_REPOSITORY } from '../../../domain/constants/project.constants';
import { Project as ProjectEntity } from '../../../domain/entities/project.entity';
import { ProjectNotFoundError } from '../../../presentation/errors/project-not-found';
import { PatchProjectDto } from '../dto/request/patch-project-dto';

@Injectable()
export class PatchProjectUseCase {
  constructor(
    @Inject(PROJECT_REPOSITORY)
    private readonly projectRepository: ProjectRepository,
  ) {}

  async execute(id: string, dto: PatchProjectDto): Promise<ProjectEntity> {
    const updatedProject = await this.projectRepository.patch(id, dto);

    if (!updatedProject) {
      throw new ProjectNotFoundError(id);
    }
    
    return updatedProject;
  }
}
