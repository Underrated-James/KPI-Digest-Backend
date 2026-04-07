import { Injectable, Inject } from '@nestjs/common';
import { type UserRepository } from '../../infrastracture/repositories/user.repository';
import { USER_REPOSITORY } from '../../domain/constants/user.constants';

@Injectable()
export class HardDeleteUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(id: string): Promise<void> {
    await this.userRepository.hardDelete(id);
  }
}
