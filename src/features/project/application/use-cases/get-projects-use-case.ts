import { Injectable, Inject } from '@nestjs/common';
import { type ProjectRepository } from '../../infrastracture/repositories/project.repository';
import { PROJECT_REPOSITORY } from '../../domain/constants/project.constants';
import { Project as ProjectEntity } from '../../domain/entities/project.entity';
import { ProjectStatus } from '../../domain/enums/project-status-enums';
import { PaginatedResult } from 'src/common/interfaces/paginated-result.interface';

@Injectable()
export class GetProjectsUseCase {
    constructor(
        @Inject(PROJECT_REPOSITORY)
        private readonly projectRepository: ProjectRepository,
    ) { }

    async execute(page: number, size: number, status?: ProjectStatus, search?: string): Promise<PaginatedResult<ProjectEntity>> {
        return this.projectRepository.findAllPaginated(page, size, status, search);
    }
}
