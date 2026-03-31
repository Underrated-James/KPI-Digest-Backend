import { PaginatedResult } from 'src/common/interfaces/paginated-result.interface';
import { Team } from '../../domain/entities/team.entity';
export interface TeamRepository {
  create(team: Team): Promise<Team>;
  findAll(sprintId?: string, projectId?: string): Promise<Team[]>;
  findAllPaginated(page: number, size: number, sprintId?: string, projectId?: string): Promise<PaginatedResult<Team>>;
  findById(id: string): Promise<Team | null>;
  findBySprintId(sprintId: string): Promise<Team | null>;
  findByName(name: string): Promise<Team | null>;
  patch(id: string, team: Partial<Team>): Promise<Team | null>;
  put(id: string, team: Partial<Team>): Promise<Team | null>;
  delete(id: string): Promise<void>;
}
