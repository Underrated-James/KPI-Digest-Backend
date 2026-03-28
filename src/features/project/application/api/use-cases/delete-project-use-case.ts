import { Injectable, Inject } from '@nestjs/common';
import { type ProjectRepository } from '../../../infrastracture/repositories/project.repository';
import { PROJECT_REPOSITORY } from '../../../domain/constants/project.constants';
import { ProjectNotFoundError } from '../../../presentation/errors/project-not-found';

@Injectable()
export class DeleteProjectUseCase {
  constructor(
    @Inject(PROJECT_REPOSITORY)
    private readonly projectRepository: ProjectRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const project = await this.projectRepository.findById(id);
    if (!project) {
      throw new ProjectNotFoundError(id);
    }

    await this.projectRepository.delete(id);
  }
}
