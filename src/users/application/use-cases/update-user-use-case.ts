import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { isValidObjectId } from 'mongoose';
import { type UserRepository } from '../../domain/repositories/user.repository';
import { User as UserEntity } from '../../domain/entities/user.entity';
import { UpdateUserDto } from '../../dtos/request/update-user-dto';
import { UserNotFoundError } from '../../domain/errors/user-not-found.error';

@Injectable()
export class UpdateUserUseCase {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
  ) {}

  async execute(id: string, dto: UpdateUserDto): Promise<UserEntity> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException(`Invalid MongoDB ObjectId: ${id}`);
    }

    const updatedUser = await this.userRepository.update(id, dto);

    if (!updatedUser) {
      throw new UserNotFoundError(id);
    }
    
    return updatedUser;
  }
}
