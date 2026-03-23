import { User } from '../entities/user.entity';
import { UserRole } from '../entities/user-role.enum';

export interface UserRepository {
    create(user: User): Promise<User>;
    findAll(role?: UserRole): Promise<User[]>;
    findById(id: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    update(id: string, user: Partial<User>): Promise<User | null>;
    delete(id: string): Promise<void>;
}   