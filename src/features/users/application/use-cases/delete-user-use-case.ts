import { Injectable, Inject} from '@nestjs/common';
import { type UserRepository } from '../../infrastracture/repositories/user.repository';
import { USER_REPOSITORY } from '../../domain/constants/user.constants';
import { UserNotFoundError } from '../../presentation/errors/user-not-found.error';

@Injectable()
export class DeleteUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new UserNotFoundError(id);
    }

    await this.userRepository.delete(id);
  }
}
