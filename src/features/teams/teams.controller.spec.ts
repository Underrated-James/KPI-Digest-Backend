import { Test, TestingModule } from '@nestjs/testing';
import { TeamsController } from './application/controllers/teams.controller';
import { CreateTeamUseCase } from './application/use-cases/create-team-use-case';
import { GetTeamsUseCase } from './application/use-cases/get-teams-use-case';
import { GetTeamByIdUseCase } from './application/use-cases/get-team-by-id-use-case';
import { PatchTeamUseCase } from './application/use-cases/patch-team-use-case';
import { PutTeamUseCase } from './application/use-cases/put-team-use-case';
import { DeleteTeamUseCase } from './application/use-cases/delete-team-use-case';

describe('TeamsController', () => {
  let controller: TeamsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TeamsController],
      providers: [
        { provide: CreateTeamUseCase, useValue: {} },
        { provide: GetTeamsUseCase, useValue: {} },
        { provide: GetTeamByIdUseCase, useValue: {} },
        { provide: PatchTeamUseCase, useValue: {} },
        { provide: PutTeamUseCase, useValue: {} },
        { provide: DeleteTeamUseCase, useValue: {} },
      ],
    }).compile();

    controller = module.get<TeamsController>(TeamsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
