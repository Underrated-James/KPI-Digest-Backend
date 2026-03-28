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
import { CreateUserDto } from '../api/dtos/request/create-user-dto';
import { PatchUserDto } from '../api/dtos/request/patch-user-dto';
import { PutUserDto } from '../api/dtos/request/put-user-dto';
import { UserResponseDto } from '../api/dtos/response/user-response-dto';
import { ResponseMessage } from '../../../../common/decorators/response-message.decorator';
import { ParseMongoIdPipe } from '../../../../common/pipes/parse-mongo-id.pipe';
import { GetUserQueryDto } from '../api/dtos/request/get-users-dto';
import { USER_RESPONSE_MESSAGES, USER_MODEL } from '../../domain/constants/user.constants';

@Controller('users')
export class UsersController {
  constructor(
    private readonly getUsersUseCase: GetUsersUseCase,
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly getUserByIdUseCase: GetUserByIdUseCase,
    private readonly patchUserUseCase: PatchUserUseCase,
    private readonly putUserUseCase: PutUserUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
  ) { }

  @Get() // Get all users (paginated)
  @ResponseMessage(USER_RESPONSE_MESSAGES.RETRIEVED_ALL)
  async findAll(
    @Query() getUserQueryDto: GetUserQueryDto,
  ) {
    const result = await this.getUsersUseCase.execute(
      getUserQueryDto.page,
      getUserQueryDto.size,
      getUserQueryDto.role,
    );
    return UserResponseDto.fromPaginatedResult(result);
  }

  @Get(':id') // Get a user by ID
  @ResponseMessage(USER_RESPONSE_MESSAGES.RETRIEVED_ONE)
  async findOne(@Param('id', new ParseMongoIdPipe(USER_MODEL)) id: string) {
    const user = await this.getUserByIdUseCase.execute(id);
    return UserResponseDto.fromEntity(user);
  }

  @Post()
  @ResponseMessage(USER_RESPONSE_MESSAGES.CREATED)
  async create(@Body() newUser: CreateUserDto) {
    const user = await this.createUserUseCase.execute(newUser);
    return UserResponseDto.fromEntity(user);
  }

  @Patch(':id')
  @ResponseMessage(USER_RESPONSE_MESSAGES.UPDATED)
  async patch(
    @Param('id', new ParseMongoIdPipe(USER_MODEL)) id: string,
    @Body() userUpdate: PatchUserDto,
  ) {
    const user = await this.patchUserUseCase.execute(id, userUpdate);
    return UserResponseDto.fromEntity(user);
  }

  @Put(':id')
  @ResponseMessage(USER_RESPONSE_MESSAGES.UPDATED)
  async put(
    @Param('id', new ParseMongoIdPipe(USER_MODEL)) id: string,
    @Body() userUpdate: PutUserDto,
  ) {
    const user = await this.putUserUseCase.execute(id, userUpdate);
    return UserResponseDto.fromEntity(user);
  }

  @Delete(':id') // Delete a user by ID
  @ResponseMessage(USER_RESPONSE_MESSAGES.DELETED)
  async delete(@Param('id', new ParseMongoIdPipe(USER_MODEL)) id: string) {
    await this.deleteUserUseCase.execute(id);
    return { id };
  }
}
