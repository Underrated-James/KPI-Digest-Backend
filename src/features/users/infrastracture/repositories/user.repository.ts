import { User } from '../../domain/entities/user.entity';
import { UserRole } from '../../domain/enums/user-role.enum';
import { PaginatedResult } from '../../../../common/interfaces/paginated-result.interface';

export interface UserRepository {
    create(user: User): Promise<User>;
    findAll(role?: UserRole): Promise<User[]>;
    findAllPaginated(page: number, size: number, role?: UserRole): Promise<PaginatedResult<User>>;
    findById(id: string): Promise<User | null>;
    findByIds(ids: string[]): Promise<User[]>;
    findByEmail(email: string): Promise<User | null>;
    patch(id: string, user: Partial<User>): Promise<User | null>;
    put(id: string, user: Partial<User>): Promise<User | null>;
    delete(id: string): Promise<void>;
}   