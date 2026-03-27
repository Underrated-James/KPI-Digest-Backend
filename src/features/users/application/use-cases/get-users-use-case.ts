import { Injectable, Inject } from '@nestjs/common';
import { type UserRepository } from '../../infrastracture/repositories/user.repository';
import { User as UserEntity } from '../../domain/persistence/entities/user.entity';
import { UserRole } from '../../domain/persistence/enums/user-role.enum';
import { PaginatedResult } from '../../../../common/interfaces/paginated-result.interface';

@Injectable()
export class GetUsersUseCase {
    constructor(
        @Inject('UserRepository')
        private readonly userRepository: UserRepository,
    ) { }

    async execute(page: number, size: number, role?: UserRole): Promise<PaginatedResult<UserEntity>> {
        return this.userRepository.findAllPaginated(page, size, role);
    }
}
