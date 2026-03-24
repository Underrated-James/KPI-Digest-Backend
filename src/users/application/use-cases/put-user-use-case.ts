import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { isValidObjectId } from 'mongoose';
import { type UserRepository } from '../../infrastracture/repositories/user.repository';
import { User as UserEntity } from '../../domain/persistence/entities/user.entity';
import { UserNotFoundError } from '../../presentation/errors/user-not-found.error';
import { PutUserDto } from 'src/users/application/api/dtos/request/put-user-dto';

@Injectable()
export class PutUserUseCase {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
  ) {}

  async execute(id: string, dto: PutUserDto): Promise<UserEntity> {
    if (!isValidObjectId(id)) {
      throw new NotFoundException(`User not found with ID: ${id}`);
    }

    const userExist = await this.userRepository.findById(id);

    if (!userExist) {
      throw new UserNotFoundError(id);
    }

    const updatedUser = await this.userRepository.put(id, dto);

    if (!updatedUser) {
      throw new UserNotFoundError(id);
    }

    return updatedUser;
  }
}
