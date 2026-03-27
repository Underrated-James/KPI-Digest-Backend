import { User } from '../../domain/persistence/entities/user.entity';
import { UserRole } from '../../domain/persistence/enums/user-role.enum';

export interface UserRepository {
    create(user: User): Promise<User>;
    findAll(role?: UserRole): Promise<User[]>;
    findById(id: string): Promise<User | null>;
    findByIds(ids: string[]): Promise<User[]>;
    findByEmail(email: string): Promise<User | null>;
    patch(id: string, user: Partial<User>): Promise<User | null>;
    put(id: string, user: Partial<User>): Promise<User | null>;
    delete(id: string): Promise<void>;
}   