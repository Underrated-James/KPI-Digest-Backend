import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TeamsController } from './application/controllers/teams.controller';
import { TeamsService } from './application/services/teams.service';
import { CreateTeamUseCase } from './application/use-cases/create-team-use-case';
import { GetTeamsUseCase } from './application/use-cases/get-teams-use-case';
import { GetTeamByIdUseCase } from './application/use-cases/get-team-by-id-use-case';
import { PatchTeamUseCase } from './application/use-cases/patch-team-use-case';
import { PutTeamUseCase } from './application/use-cases/put-team-use-case';
import { DeleteTeamUseCase } from './application/use-cases/delete-team-use-case';
import { TeamMongooseRepository } from './application/services/team-impl-repository';
import { TeamSchema } from './infrastracture/models/team.model';
import { TEAM_REPOSITORY, TEAM_MODEL } from './domain/constants/team.constants';
import { ProjectModule } from '../project/project.module';
import { SprintsModule } from '../sprints/sprints.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: TEAM_MODEL, schema: TeamSchema }]),
    ProjectModule,
    SprintsModule,
    UsersModule,
  ],
  controllers: [TeamsController],
  providers: [
    TeamsService,
    CreateTeamUseCase,
    GetTeamsUseCase,
    GetTeamByIdUseCase,
    PatchTeamUseCase,
    PutTeamUseCase,
    DeleteTeamUseCase,
    {
      provide: TEAM_REPOSITORY,
      useClass: TeamMongooseRepository,
    },
  ],
  exports: [
    TEAM_REPOSITORY,
    CreateTeamUseCase,
    GetTeamsUseCase,
    GetTeamByIdUseCase,
    PatchTeamUseCase,
    PutTeamUseCase,
    DeleteTeamUseCase,
  ],
})
export class TeamsModule {}
