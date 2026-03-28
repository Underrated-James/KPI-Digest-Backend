import { Injectable, Inject } from '@nestjs/common';
import { type UserRepository } from '../../infrastracture/repositories/user.repository';
import { USER_REPOSITORY } from '../../domain/constants/user.constants';
import { User as UserEntity } from '../../domain/entities/user.entity';
import { UserNotFoundError } from '../../presentation/errors/user-not-found.error';
import { PatchUserDto } from 'src/features/users/application/api/dtos/request/patch-user-dto';

@Injectable()
export class PatchUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) { }

  async execute(id: string, dto: PatchUserDto): Promise<UserEntity> {
    const updatedUser = await this.userRepository.patch(id, dto);

    if (!updatedUser) {
      throw new UserNotFoundError(id);
    }

    return updatedUser;
  }
}
