import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { isValidObjectId } from 'mongoose';
import { type UserRepository } from '../../infrastracture/repositories/user.repository';
import { User as UserEntity } from '../../domain/persistence/entities/user.entity';
import { UserNotFoundError } from '../../presentation/errors/user-not-found.error';
import { PatchUserDto } from 'src/users/application/api/dtos/request/patch-user-dto';

@Injectable()
export class PatchUserUseCase {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
  ) {}

  async execute(id: string, dto: PatchUserDto): Promise<UserEntity> {
    if (!isValidObjectId(id)) {
      throw new NotFoundException(`User not found with ID: ${id}`);
    }

    const updatedUser = await this.userRepository.patch(id, dto);

    if (!updatedUser) {
      throw new UserNotFoundError(id);
    }
    
    return updatedUser;
  }
}
