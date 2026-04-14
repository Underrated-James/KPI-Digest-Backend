import { Test, TestingModule } from '@nestjs/testing';
import { ProjectController } from './application/controllers/project.controller';
import { CreateProjectUseCase } from './application/use-cases/create-project-use-case';
import { GetProjectsUseCase } from './application/use-cases/get-projects-use-case';
import { GetProjectByIdUseCase } from './application/use-cases/get-project-by-id-use-case';
import { PatchProjectUseCase } from './application/use-cases/patch-project-use-case';
import { PutProjectUseCase } from './application/use-cases/put-project-use-case';
import { DeleteProjectUseCase } from './application/use-cases/delete-project-use-case';
import { RestoreProjectUseCase } from './application/use-cases/restore-project-use-case';
import { HardDeleteProjectUseCase } from './application/use-cases/hard-delete-project-use-case';
import { PROJECT_REPOSITORY } from './domain/constants/project.constants';

describe('ProjectController', () => {
  let controller: ProjectController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectController],
      providers: [
        { provide: CreateProjectUseCase, useValue: {} },
        { provide: GetProjectsUseCase, useValue: {} },
        { provide: GetProjectByIdUseCase, useValue: {} },
        { provide: PatchProjectUseCase, useValue: {} },
        { provide: PutProjectUseCase, useValue: {} },
        { provide: DeleteProjectUseCase, useValue: {} },
        { provide: RestoreProjectUseCase, useValue: {} },
        { provide: HardDeleteProjectUseCase, useValue: {} },
        { provide: PROJECT_REPOSITORY, useValue: {} },
      ],
    }).compile();

    controller = module.get<ProjectController>(ProjectController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
