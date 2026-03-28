import { Injectable, Inject } from '@nestjs/common';
import { type UserRepository } from '../../infrastracture/repositories/user.repository';
import { USER_REPOSITORY } from '../../domain/constants/user.constants';
import { User as UserEntity } from '../../domain/entities/user.entity';
import { UserNotFoundError } from '../../presentation/errors/user-not-found.error';

@Injectable()
export class GetUserByIdUseCase {
    constructor(
        @Inject(USER_REPOSITORY)
        private readonly userRepository: UserRepository,
    ) { }

    async execute(id: string): Promise<UserEntity> {
        const user = await this.userRepository.findById(id);

        if (!user) {
            throw new UserNotFoundError(id);
        }

        return user;
    }
}
