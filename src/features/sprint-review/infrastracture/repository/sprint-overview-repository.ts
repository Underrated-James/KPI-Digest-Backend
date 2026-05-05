import { SprintOverviewEntity } from '../../domain/entities/sprint-overview-entity';
import { PaginatedResult } from '../../../../common/interfaces/paginated-result.interface';

export interface SprintRepository {
  create(entity: SprintOverviewEntity): Promise<SprintOverviewEntity>;
  findAll(projectId?: string, sprintId?: string, search?: string): Promise<SprintOverviewEntity[]>;
  findAllPaginated(page: number, size: number, projectId?: string, sprintId?: string, search?: string): Promise<PaginatedResult<SprintOverviewEntity>>;
  findById(id: string): Promise<SprintOverviewEntity | null>;
  patch(id: string, entity: Partial<SprintOverviewEntity>): Promise<SprintOverviewEntity | null>;
  put(id: string, entity: SprintOverviewEntity): Promise<SprintOverviewEntity | null>;
  delete(id: string): Promise<void>;
  restore(id: string): Promise<void>;
  hardDelete(id: string): Promise<void>;
}
