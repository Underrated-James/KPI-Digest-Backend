import { Sprint } from '../../domain/entities/sprint.entity';
import { SprintStatus } from '../../domain/enums/sprint-status-enums';
export interface SprintRepository {
  create(Sprint: Sprint): Promise<Sprint>;
  findAll(status?: SprintStatus): Promise<Sprint[]>;
  findById(id: string): Promise<Sprint | null>;
  findByName(name: string): Promise<Sprint | null>;
  patch(id: string, Sprint: Partial<Sprint>): Promise<Sprint | null>;
  put(id: string, Sprint: Partial<Sprint>): Promise<Sprint | null>;
  delete(id: string): Promise<void>;
}
