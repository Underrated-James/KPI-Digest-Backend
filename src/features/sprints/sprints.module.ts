import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { SprintController } from './application/controllers/sprint.controller';
import { SprintSchema } from './domain/schema/sprint-schema';
import { SprintMongooseRepository } from './application/services/sprint-impl-repository';
import { CreateSprintUseCase } from './application/use-cases/create-sprint-use-case';
import { DeleteSprintUseCase } from './application/use-cases/delete-sprint-use-case';
import { GetSprintByIdUseCase } from './application/use-cases/get-sprint-by-id-use-case';
import { GetSprintUseCase } from './application/use-cases/get-sprints-use-case';
import { PatchSprintUseCase } from './application/use-cases/patch-sprint-use-case';
import { PutSprintUseCase } from './application/use-cases/put-sprint-use-case';
import { Sprint } from './domain/entities/sprint.entity';


@Module({
    imports: [
        MongooseModule.forFeature([{ name: Sprint.name, schema: SprintSchema }])
    ],
    controllers: [SprintController],
    providers: [
        GetSprintUseCase,
        CreateSprintUseCase,
        GetSprintByIdUseCase,
        PatchSprintUseCase,
        PutSprintUseCase,
        DeleteSprintUseCase,
        {
            provide: 'SprintRepository',
            useClass: SprintMongooseRepository
        }
    ],
    exports: [
        'SprintRepository',
        GetSprintUseCase,
        CreateSprintUseCase,
        GetSprintByIdUseCase,
        PatchSprintUseCase,
        PutSprintUseCase,
        DeleteSprintUseCase
    ]
})
export class SprintsModule { }
