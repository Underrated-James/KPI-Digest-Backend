import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './application/controllers/users.controller';
import { GetUsersUseCase } from './application/use-cases/get-users-use-case';
import { CreateUserUseCase } from './application/use-cases/create-user-use-case';
import { GetUserByIdUseCase } from './application/use-cases/get-user-by-id-use-case';
import { PatchUserUseCase } from './application/use-cases/patch-user-use-case';
import { PutUserUseCase } from './application/use-cases/put-user-use-case';
import { DeleteUserUseCase } from './application/use-cases/delete-user-use-case';
import { RestoreUserUseCase } from './application/use-cases/restore-user-use-case';
import { HardDeleteUserUseCase } from './application/use-cases/hard-delete-user-use-case';

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: GetUsersUseCase, useValue: {} },
        { provide: CreateUserUseCase, useValue: {} },
        { provide: GetUserByIdUseCase, useValue: {} },
        { provide: PatchUserUseCase, useValue: {} },
        { provide: PutUserUseCase, useValue: {} },
        { provide: DeleteUserUseCase, useValue: {} },
        { provide: RestoreUserUseCase, useValue: {} },
        { provide: HardDeleteUserUseCase, useValue: {} },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
