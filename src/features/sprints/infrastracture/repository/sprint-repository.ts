import { Sprint } from '../../domain/entities/sprint-entity';
import { SprintStatus } from '../../domain/enums/sprint-status-enums';
import { PaginatedResult } from '../../../../common/interfaces/paginated-result.interface';
export interface SprintRepository {
  create(Sprint: Sprint): Promise<Sprint>;
  findAll(status?: SprintStatus, projectId?: string): Promise<Sprint[]>;
  findAllPaginated(page: number, size: number, status?: SprintStatus, projectId?: string): Promise<PaginatedResult<Sprint>>;
  findById(id: string): Promise<Sprint | null>;
  findByName(name: string): Promise<Sprint | null>;
  patch(id: string, Sprint: Partial<Sprint>): Promise<Sprint | null>;
  put(id: string, Sprint: Partial<Sprint>): Promise<Sprint | null>;
  delete(id: string): Promise<void>;
}
