import { PaginatedResult } from 'src/common/interfaces/paginated-result.interface';
import { Project } from '../../domain/entities/project.entity';
import { ProjectStatus } from '../../domain/enums/project-status-enums';

export interface ProjectRepository {
    create(project: Project): Promise<Project>;
    findAll(status?: ProjectStatus, search?: string): Promise<Project[]>;
    findAllPaginated(page: number, size: number, status?: ProjectStatus, search?: string): Promise<PaginatedResult<Project>>;
    findById(id: string): Promise<Project | null>;
    findByName(name: string): Promise<Project | null>;
    patch(id: string, project: Partial<Project>): Promise<Project | null>;
    put(id: string, project: Partial<Project>): Promise<Project | null>;
    delete(id: string): Promise<void>;
    restore(id: string): Promise<void>;
    hardDelete(id: string): Promise<void>;
}   