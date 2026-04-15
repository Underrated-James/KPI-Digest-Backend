import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { SprintController } from './application/controllers/sprint.controller';
import { SprintSchema } from './infrastracture/models/sprint.model';
import { SprintMongooseRepository } from './application/services/sprint-impl-repository';
import { CreateSprintUseCase } from './application/use-cases/create-sprint-use-case';
import { DeleteSprintUseCase } from './application/use-cases/delete-sprint-use-case';
import { GetSprintByIdUseCase } from './application/use-cases/get-sprint-by-id-use-case';
import { GetSprintUseCase } from './application/use-cases/get-sprints-use-case';
import { PatchSprintUseCase } from './application/use-cases/patch-sprint-use-case';
import { PutSprintUseCase } from './application/use-cases/put-sprint-use-case';
import { RestoreSprintUseCase } from './application/use-cases/restore-sprint-use-case';
import { HardDeleteSprintUseCase } from './application/use-cases/hard-delete-sprint-use-case';
import { SPRINT_REPOSITORY, SPRINT_MODEL } from './domain/constants/sprint.constants';
import { ProjectModule } from '../project/project.module';
import { TicketsModule } from '../tickets/tickets.module';
import { GetProjectTicketsUseCase } from './application/use-cases/get-project-tickets-use-case';
import { GetAvailableTicketsForSprintUseCase } from './application/use-cases/get-available-tickets-for-sprint-use-case';
import { AssignTicketsToSprintUseCase } from './application/use-cases/assign-tickets-to-sprint-use-case';
import { SprintCapacityService } from './application/use-cases/sprint-capacity/sprint-capacity.service';


@Module({
    imports: [
        MongooseModule.forFeature([{ name: SPRINT_MODEL, schema: SprintSchema }]),
        ProjectModule,
        forwardRef(() => TicketsModule),
    ],
    controllers: [SprintController],
    providers: [
        GetSprintUseCase,
        CreateSprintUseCase,
        GetSprintByIdUseCase,
        PatchSprintUseCase,
        PutSprintUseCase,
        DeleteSprintUseCase,
        RestoreSprintUseCase,
        HardDeleteSprintUseCase,
        GetProjectTicketsUseCase,
        GetAvailableTicketsForSprintUseCase,
        AssignTicketsToSprintUseCase,
        SprintCapacityService,
        {
            provide: SPRINT_REPOSITORY,
            useClass: SprintMongooseRepository
        }
    ],
    exports: [
        SPRINT_REPOSITORY,
        GetSprintUseCase,
        CreateSprintUseCase,
        GetSprintByIdUseCase,
        PatchSprintUseCase,
        PutSprintUseCase,
        DeleteSprintUseCase,
        RestoreSprintUseCase,
        HardDeleteSprintUseCase
    ]
})
export class SprintsModule { }
