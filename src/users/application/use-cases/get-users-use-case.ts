import { Injectable, Inject } from '@nestjs/common';
import { type UserRepository } from '../../domain/repositories/user.repository';
import { User as UserEntity } from '../../domain/entities/user.entity';
import { UserRole } from '../../domain/entities/user-role.enum';

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
