import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { isValidObjectId } from 'mongoose';
import { type UserRepository } from '../../infrastracture/repositories/user.repository';
import { UserNotFoundError } from '../../presentation/errors/user-not-found.error';

@Injectable()
export class DeleteUserUseCase {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
  ) {}

  async execute(id: string): Promise<void> {
    if (!isValidObjectId(id)) {
     throw new NotFoundException(`User not found with ID: ${id}`);
    }

    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new UserNotFoundError(id);
    }

    await this.userRepository.delete(id);
  }
}
