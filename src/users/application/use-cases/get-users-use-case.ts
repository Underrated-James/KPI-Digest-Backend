import { Injectable, Inject } from '@nestjs/common';
import { type UserRepository } from '../../infrastracture/repositories/user.repository';
import { User as UserEntity } from '../../domain/persistence/entities/user.entity';
import { UserRole } from '../../domain/persistence/enums/user-role.enum';

@Injectable()
export class GetUsersUseCase {
    constructor(
        @Inject('UserRepository')
        private readonly userRepository: UserRepository,
    ) { }

    async execute(role?: UserRole): Promise<UserEntity[]> {
        return this.userRepository.findAll(role);
    }
}
