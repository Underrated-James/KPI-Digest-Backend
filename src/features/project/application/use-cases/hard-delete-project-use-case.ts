import { Injectable, Inject } from '@nestjs/common';
import { type ProjectRepository } from '../../infrastracture/repositories/project.repository';
import { PROJECT_REPOSITORY } from '../../domain/constants/project.constants';

@Injectable()
export class HardDeleteProjectUseCase {
  constructor(
    @Inject(PROJECT_REPOSITORY)
    private readonly projectRepository: ProjectRepository,
  ) {}

  async execute(id: string): Promise<void> {
    await this.projectRepository.hardDelete(id);
  }
}
