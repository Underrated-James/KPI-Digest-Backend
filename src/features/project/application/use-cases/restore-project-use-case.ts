import { Injectable, Inject } from '@nestjs/common';
import { type ProjectRepository } from '../../infrastracture/repositories/project.repository';
import { PROJECT_REPOSITORY } from '../../domain/constants/project.constants';

@Injectable()
export class RestoreProjectUseCase {
  constructor(
    @Inject(PROJECT_REPOSITORY)
    private readonly projectRepository: ProjectRepository,
  ) {}

  async execute(id: string): Promise<void> {
    // Note: We don't use findById here because findById filters out soft-deleted users
    await this.projectRepository.restore(id);
  }
}
