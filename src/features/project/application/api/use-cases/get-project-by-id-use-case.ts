import { Injectable, Inject } from '@nestjs/common';
import { type ProjectRepository } from '../../../infrastracture/repositories/project.repository';
import { PROJECT_REPOSITORY } from '../../../domain/constants/project.constants';
import { Project as ProjectEntity } from '../../../domain/entities/project.entity';
import { ProjectNotFoundError } from '../../../presentation/errors/project-not-found';

@Injectable()
export class GetProjectByIdUseCase {
    constructor(
        @Inject(PROJECT_REPOSITORY)
        private readonly projectRepository: ProjectRepository,
    ) { }

    async execute(id: string): Promise<ProjectEntity> {
        const project = await this.projectRepository.findById(id);

        if (!project) {
            throw new ProjectNotFoundError(id);
        }

        return project;
    }
}
