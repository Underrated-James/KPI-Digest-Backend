import { Injectable, Inject } from '@nestjs/common';
import { type ProjectRepository } from '../../../infrastracture/repositories/project.repository';
import { Project as ProjectEntity } from '../../../domain/entities/project.entity';
import { ProjectStatus } from '../../../domain/enums/project-status-enums';

@Injectable()
export class GetProjectsUseCase {
    constructor(
        @Inject('ProjectRepository')
        private readonly projectRepository: ProjectRepository,
    ) { }

    async execute(status?: ProjectStatus): Promise<ProjectEntity[]> {
        return this.projectRepository.findAll(status);
    }
}
