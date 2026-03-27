import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { GetUsersUseCase } from '../use-cases/get-users-use-case';
import { CreateUserUseCase } from '../use-cases/create-user-use-case';
import { GetUserByIdUseCase } from '../use-cases/get-user-by-id-use-case';
import { PatchUserUseCase } from '../use-cases/patch-user-use-case';
import { PutUserUseCase } from '../use-cases/put-user-use-case';
import { DeleteUserUseCase } from '../use-cases/delete-user-use-case';
import { UserRole } from '../../domain/persistence/enums/user-role.enum';
import { CreateUserDto } from '../api/dtos/request/create-user-dto';
import { PatchUserDto } from '../api/dtos/request/patch-user-dto';
import { PutUserDto } from '../api/dtos/request/put-user-dto';
import { UserResponseDto } from '../api/dtos/response/user-response-dto';
import { ResponseMessage } from '../../../../common/decorators/response-message.decorator';
import { ParseMongoIdPipe } from '../../../../common/pipes/parse-mongo-id.pipe';
import { PaginationQueryDto } from '../../../../common/dtos/pagination-query.dto';

@Controller('users')
export class UsersController {
  constructor(
    private readonly getUsersUseCase: GetUsersUseCase,
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly getUserByIdUseCase: GetUserByIdUseCase,
    private readonly patchUserUseCase: PatchUserUseCase,
    private readonly putUserUseCase: PutUserUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
  ) {}

  @Get() // Get all users (paginated)
  @ResponseMessage('Users retrieved successfully')
  async findAll(
    @Query() paginationQuery: PaginationQueryDto,
    @Query('role') role?: UserRole,
  ) {
    const result = await this.getUsersUseCase.execute(
      paginationQuery.page,
      paginationQuery.size,
      role,
    );
    return UserResponseDto.fromPaginatedResult(result);
  }

  @Get(':id') // Get a user by ID
  @ResponseMessage('User retrieved successfully')
  async findOne(@Param('id', new ParseMongoIdPipe('User')) id: string) {
    const user = await this.getUserByIdUseCase.execute(id);
    return UserResponseDto.fromEntity(user);
  }

  @Post()
  @ResponseMessage('User created successfully')
  async create(@Body() newUser: CreateUserDto) {
    const user = await this.createUserUseCase.execute(newUser);
    return UserResponseDto.fromEntity(user);
  }

  @Patch(':id')
  @ResponseMessage('User updated successfully')
  async patch(
    @Param('id', new ParseMongoIdPipe('User')) id: string,
    @Body() userUpdate: PatchUserDto,
  ) {
    const user = await this.patchUserUseCase.execute(id, userUpdate);
    return UserResponseDto.fromEntity(user);
  }

  @Put(':id')
  @ResponseMessage('User updated successfully')
  async put(
    @Param('id', new ParseMongoIdPipe('User')) id: string,
    @Body() userUpdate: PutUserDto,
  ) {
    const user = await this.putUserUseCase.execute(id, userUpdate);
    return UserResponseDto.fromEntity(user);
  }

  @Delete(':id') // Delete a user by ID
  @ResponseMessage('User deleted successfully')
  async delete(@Param('id', new ParseMongoIdPipe('User')) id: string) {
    await this.deleteUserUseCase.execute(id);
    return { id };
  }
}
