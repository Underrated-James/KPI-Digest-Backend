import { Injectable, Inject } from '@nestjs/common';
import { type UserRepository } from '../../infrastracture/repositories/user.repository';
import { USER_REPOSITORY } from '../../domain/constants/user.constants';

@Injectable()
export class RestoreUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(id: string): Promise<void> {
    // Note: We don't use findById here because findById filters out soft-deleted users
    await this.userRepository.restore(id);
  }
}
