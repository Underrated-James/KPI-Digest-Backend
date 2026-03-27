import { Injectable, Inject } from '@nestjs/common';
import { type ProjectRepository } from '../../../infrastracture/repositories/project.repository';
import { Project as ProjectEntity } from '../../../domain/entities/project.entity';
import { ProjectStatus } from '../../../domain/enums/project-status-enums';
import { PaginatedResult } from 'src/common/interfaces/paginated-result.interface';

@Injectable()
export class GetProjectsUseCase {
    constructor(
        @Inject('ProjectRepository')
        private readonly projectRepository: ProjectRepository,
    ) { }

    async execute(page: number, size: number, status?: ProjectStatus): Promise<PaginatedResult<ProjectEntity>> {
        return this.projectRepository.findAllPaginated(page, size, status);
    }
}
