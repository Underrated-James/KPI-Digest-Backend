import { Injectable, Inject } from '@nestjs/common';
import { type UserRepository } from '../../infrastracture/repositories/user.repository';
import { User as UserEntity } from '../../domain/entities/user.entity';
import { UserNotFoundError } from '../../presentation/errors/user-not-found.error';
import { PutUserDto } from 'src/features/users/application/api/dtos/request/put-user-dto';

@Injectable()
export class PutUserUseCase {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
  ) { }

  async execute(id: string, dto: PutUserDto): Promise<UserEntity> {
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
