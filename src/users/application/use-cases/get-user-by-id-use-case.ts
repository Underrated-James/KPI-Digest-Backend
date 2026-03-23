import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { isValidObjectId } from 'mongoose';
import { type UserRepository } from '../../domain/repositories/user.repository';
import { User as UserEntity } from '../../domain/entities/user.entity';
import { UserNotFoundError } from '../../domain/errors/user-not-found.error';

@Injectable()
export class GetUserByIdUseCase {
    constructor(
        @Inject('UserRepository')
        private readonly userRepository: UserRepository,
    ) { }

    async execute(id: string): Promise<UserEntity> {
        if (!isValidObjectId(id)) {
            throw new BadRequestException(`Invalid MongoDB ObjectId: ${id}`);
        }

        const user = await this.userRepository.findById(id);

        if (!user) {
            throw new UserNotFoundError(id);
        }

        return user;
    }
}
