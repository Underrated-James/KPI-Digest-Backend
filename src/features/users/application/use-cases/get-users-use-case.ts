import { Injectable, Inject } from '@nestjs/common';
import { type UserRepository } from '../../infrastracture/repositories/user.repository';
import { USER_REPOSITORY } from '../../domain/constants/user.constants';
import { User as UserEntity } from '../../domain/entities/user.entity';
import { UserRole } from '../../domain/enums/user-role.enum';
import { PaginatedResult } from '../../../../common/interfaces/paginated-result.interface';

@Injectable()
export class GetUsersUseCase {
    constructor(
        @Inject(USER_REPOSITORY)
        private readonly userRepository: UserRepository,
    ) { }

    async execute(
        page: number,
        size: number,
        role?: UserRole,
        search?: string,
    ): Promise<PaginatedResult<UserEntity>> {
        return this.userRepository.findAllPaginated(page, size, role, search);
    }
}
