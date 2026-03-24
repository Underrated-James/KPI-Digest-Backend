import { Project } from '../../domain/entities/project.entity';
import { ProjectStatus } from '../../domain/enums/project-status-enums';

export interface ProjectRepository {
    create(project: Project): Promise<Project>;
    findAll(status?: ProjectStatus): Promise<Project[]>;
    findById(id: string): Promise<Project | null>;
    findByName(name: string): Promise<Project | null>;
    patch(id: string, project: Partial<Project>): Promise<Project | null>;
    put(id: string, project: Partial<Project>): Promise<Project | null>;
    delete(id: string): Promise<void>;
}   