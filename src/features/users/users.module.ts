import { Module } from '@nestjs/common';
import { UsersController } from './application/controllers/users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserMongooseRepository } from './application/service/user-impl-repository';
import { GetUsersUseCase } from './application/use-cases/get-users-use-case';
import { CreateUserUseCase } from './application/use-cases/create-user-use-case';
import { GetUserByIdUseCase } from './application/use-cases/get-user-by-id-use-case';
import { PatchUserUseCase } from './application/use-cases/patch-user-use-case';
import { PutUserUseCase } from './application/use-cases/put-user-use-case';
import { DeleteUserUseCase } from './application/use-cases/delete-user-use-case';
import { User } from './domain/persistence/entities/user.entity';
import { UserSchema } from './domain/persistence/schema/user-schema';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])
    ],
    controllers: [UsersController],
    providers: [
        GetUsersUseCase,
        CreateUserUseCase,
        GetUserByIdUseCase,
        PatchUserUseCase,
        PutUserUseCase,
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
        PatchUserUseCase,
        PutUserUseCase,
        DeleteUserUseCase
    ]
})
export class UsersModule { }
