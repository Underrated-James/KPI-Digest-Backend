import { PaginatedResult } from 'src/common/interfaces/paginated-result.interface';
import { Project } from '../../domain/entities/project.entity';
import { ProjectStatus } from '../../domain/enums/project-status-enums';
import { User } from 'src/features/users/domain/entities/user.entity';
import { ProjectMemberRole } from '../../domain/enums/project-member-role.enum';

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
    getMembers(projectId: string): Promise<User[]>;
    getMembersByRole(projectId: string, role: string): Promise<User[]>;
    addMember(projectId: string, userId: string, role?: ProjectMemberRole): Promise<void>;
    removeMember(projectId: string, userId: string): Promise<void>;
    replaceMembers(projectId: string, userIds: string[], role?: ProjectMemberRole): Promise<void>;
    isMember(projectId: string, userId: string): Promise<boolean>;
    incrementTicketSequence(projectId: string): Promise<Project | null>;
}   
