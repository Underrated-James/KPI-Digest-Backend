import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SprintReviewController } from './application/controllers/sprint.controller';
import { SprintMongooseRepository } from './application/services/sprint-impl-repository';
import { CreateSprintOverviewUseCase } from './application/use-cases/create-sprint-overview-use-case';
import { GetSprintOverviewsUseCase } from './application/use-cases/get-sprints-overview-use-case';
import { GetSprintOverviewByIdUseCase } from './application/use-cases/get-sprint-overview-by-id-use-case';
import { GetSprintCanvasUseCase } from './application/use-cases/get-sprint-overview-canvas-use-case';
import { PatchSprintOverviewUseCase } from './application/use-cases/patch-sprint-overview-use-case';
import { PutSprintOverviewUseCase } from './application/use-cases/put-sprint-overview-use-case';
import { DeleteSprintOverviewUseCase } from './application/use-cases/delete-sprint-overview-use-case';
import { HardDeleteSprintOverviewUseCase } from './application/use-cases/hard-delete-sprint-overview-use-case';
import { RestoreSprintOverviewUseCase } from './application/use-cases/restore-sprint-overview-use-case';
import { SprintCapacityService } from './application/use-cases/sprint-capacity/sprint-capacity.service';
import { SprintOverviewSchema} from './infrastracture/models/sprint-overview.model';
import { SPRINT_OVERVIEW_MODEL, SPRINT_OVERVIEW_REPO } from './domain/constants/sprint-overview-constants';
import { SprintsModule } from '../sprints/sprints.module';
import { TicketsModule } from '../tickets/tickets.module';
import { TeamsModule } from '../teams/teams.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SPRINT_OVERVIEW_MODEL, schema: SprintOverviewSchema },
    ]),
    SprintsModule,
    TicketsModule,
    TeamsModule,
  ],
  controllers: [SprintReviewController],
  providers: [
    {
      provide: SPRINT_OVERVIEW_REPO,
      useClass: SprintMongooseRepository,
    },
    CreateSprintOverviewUseCase,
    GetSprintOverviewsUseCase,
    GetSprintOverviewByIdUseCase,
    GetSprintCanvasUseCase,
    PatchSprintOverviewUseCase,
    PutSprintOverviewUseCase,
    DeleteSprintOverviewUseCase,
    HardDeleteSprintOverviewUseCase,
    RestoreSprintOverviewUseCase,
    SprintCapacityService,
  ],
})
export class SprintReviewModule {
  constructor() {
    console.log('SprintReviewModule initialized');
  }
}
