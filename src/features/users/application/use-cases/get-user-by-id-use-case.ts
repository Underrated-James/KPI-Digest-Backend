import { Injectable, Inject} from '@nestjs/common';
import { type UserRepository } from '../../infrastracture/repositories/user.repository';
import { User as UserEntity } from '../../domain/persistence/entities/user.entity';
import { UserNotFoundError } from '../../presentation/errors/user-not-found.error';

@Injectable()
export class GetUserByIdUseCase {
    constructor(
        @Inject('UserRepository')
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
