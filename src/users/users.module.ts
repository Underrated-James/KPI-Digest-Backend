import { Module } from '@nestjs/common';
import { UsersController } from './presentation/http/users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './infrastracture/persistence/schema/user-schema';
import { UserMongooseRepository } from './infrastracture/persistence/user-mongoose-repositories';
import { GetUsersUseCase } from './application/use-cases/get-users-use-case';
import { CreateUserUseCase } from './application/use-cases/create-user-use-case';
import { GetUserByIdUseCase } from './application/use-cases/get-user-by-id-use-case';
import { UpdateUserUseCase } from './application/use-cases/update-user-use-case';
import { DeleteUserUseCase } from './application/use-cases/delete-user-use-case';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])
    ],
    controllers: [UsersController],
    providers: [
        GetUsersUseCase,
        CreateUserUseCase,
        GetUserByIdUseCase,
        UpdateUserUseCase,
        DeleteUserUseCase,
        {
            provide: 'UserRepository',
            useClass: UserMongooseRepository
        }
    ],
    exports: [
        'UserRepository',
        GetUsersUseCase,
        CreateUserUseCase,
        GetUserByIdUseCase,
        UpdateUserUseCase,
        DeleteUserUseCase
    ]
})
export class UsersModule { }
