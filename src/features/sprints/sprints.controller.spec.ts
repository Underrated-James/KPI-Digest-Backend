import { Test, TestingModule } from '@nestjs/testing';
import { SprintController } from './application/controllers/sprint.controller';
import { CreateSprintUseCase } from './application/use-cases/create-sprint-use-case';
import { GetSprintUseCase } from './application/use-cases/get-sprints-use-case';
import { GetSprintByIdUseCase } from './application/use-cases/get-sprint-by-id-use-case';
import { PatchSprintUseCase } from './application/use-cases/patch-sprint-use-case';
import { PutSprintUseCase } from './application/use-cases/put-sprint-use-case';
import { DeleteSprintUseCase } from './application/use-cases/delete-sprint-use-case';
import { RestoreSprintUseCase } from './application/use-cases/restore-sprint-use-case';
import { HardDeleteSprintUseCase } from './application/use-cases/hard-delete-sprint-use-case';

describe('SprintsController', () => {
  let controller: SprintController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SprintController],
      providers: [
        { provide: CreateSprintUseCase, useValue: {} },
        { provide: GetSprintUseCase, useValue: {} },
        { provide: GetSprintByIdUseCase, useValue: {} },
        { provide: PatchSprintUseCase, useValue: {} },
        { provide: PutSprintUseCase, useValue: {} },
        { provide: DeleteSprintUseCase, useValue: {} },
        { provide: RestoreSprintUseCase, useValue: {} },
        { provide: HardDeleteSprintUseCase, useValue: {} },
      ],
    }).compile();

    controller = module.get<SprintController>(SprintController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
