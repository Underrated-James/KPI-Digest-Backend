import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
    ValidationPipe,
} from '@nestjs/common';
import { GetUsersUseCase } from '../../application/use-cases/get-users-use-case';
import { CreateUserUseCase } from '../../application/use-cases/create-user-use-case';
import { GetUserByIdUseCase } from '../../application/use-cases/get-user-by-id-use-case';
import { UpdateUserUseCase } from '../../application/use-cases/update-user-use-case';
import { DeleteUserUseCase } from '../../application/use-cases/delete-user-use-case';
import { CreateUserDto } from '../../dtos/request/create-user-dto';
import { UpdateUserDto } from '../../dtos/request/update-user-dto';
import { UserRole } from '../../domain/entities/user-role.enum';


@Controller('users')
export class UsersController {

    constructor(
        private readonly getUsersUseCase: GetUsersUseCase,
        private readonly createUserUseCase: CreateUserUseCase,
        private readonly getUserByIdUseCase: GetUserByIdUseCase,
        private readonly updateUserUseCase: UpdateUserUseCase,
        private readonly deleteUserUseCase: DeleteUserUseCase,
    ) { }

    @Get() // Get all users
    findAll(@Query('role') role?: UserRole) {
        return this.getUsersUseCase.execute(role);
    }

    @Get(':id') // Get a user by ID
    findOne(@Param('id') id: string) {
        return this.getUserByIdUseCase.execute(id);
    }

    @Post()
    create(@Body() newUser: CreateUserDto) {
        return this.createUserUseCase.execute(newUser);
    }

    @Patch(':id')
    patch(@Param('id') id: string, @Body() userUpdate: UpdateUserDto) {
        return this.updateUserUseCase.execute(id, userUpdate);
    }

    @Delete(':id') // Delete a user by ID
    async delete(@Param('id') id: string) {
        await this.deleteUserUseCase.execute(id);
        return { message: 'User deleted successfully' };
    }




}
