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
import { UserSchema } from './infrastracture/models/user.model';
import { USER_REPOSITORY, USER_MODEL } from './domain/constants/user.constants';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: USER_MODEL, schema: UserSchema }])
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
            provide: USER_REPOSITORY,
            useClass: UserMongooseRepository
        }
    ],
    exports: [
        USER_REPOSITORY,
        GetUsersUseCase,
        CreateUserUseCase,
        GetUserByIdUseCase,
        PatchUserUseCase,
        PutUserUseCase,
        DeleteUserUseCase
    ]
})
export class UsersModule { }
