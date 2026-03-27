import { UserRole } from '../../../../domain/persistence/enums/user-role.enum';
import { User as UserEntity } from '../../../../domain/persistence/entities/user.entity';
import { PaginatedResult } from '../../../../../../common/interfaces/paginated-result.interface';

export class UserResponseDto {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly email: string,
    public readonly role: UserRole,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
  ) {}

  static fromEntity(user: UserEntity): UserResponseDto {
    return new UserResponseDto(
      user.id,
      user.name,
      user.email,
      user.role,
      user.createdAt,
      user.updatedAt,
    );
  }

  static fromEntities(users: UserEntity[]): UserResponseDto[] {
    return users.map((user) => UserResponseDto.fromEntity(user));
  }

  static fromPaginatedResult(result: PaginatedResult<UserEntity>): PaginatedResult<UserResponseDto> {
    return {
      content: UserResponseDto.fromEntities(result.content),
      page: result.page,
      size: result.size,
      totalElements: result.totalElements,
      totalPages: result.totalPages,
      numberOfElements: result.numberOfElements,
      firstPage: result.firstPage,
      lastPage: result.lastPage,
    };
  }
}
