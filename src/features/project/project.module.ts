import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProjectSchema } from './infrastracture/models/project.model';
import { ProjectController } from './application/controllers/project.controller';
import { GetProjectsUseCase } from './application/use-cases/get-projects-use-case';
import { CreateProjectUseCase } from './application/use-cases/create-project-use-case';
import { GetProjectByIdUseCase } from './application/use-cases/get-project-by-id-use-case';
import { PatchProjectUseCase } from './application/use-cases/patch-project-use-case';
import { DeleteProjectUseCase } from './application/use-cases/delete-project-use-case';
import { RestoreProjectUseCase } from './application/use-cases/restore-project-use-case';
import { HardDeleteProjectUseCase } from './application/use-cases/hard-delete-project-use-case';
import { PutProjectUseCase } from './application/use-cases/put-project-use-case';
import { ProjectMongooseRepository } from './application/services/project-impl-repository';
import { PROJECT_REPOSITORY, PROJECT_MODEL } from './domain/constants/project.constants';


@Module({
    imports: [
        MongooseModule.forFeature([{ name: PROJECT_MODEL, schema: ProjectSchema }])
    ],
    controllers: [ProjectController],
    providers: [
        GetProjectsUseCase,
        CreateProjectUseCase,
        GetProjectByIdUseCase,
        PatchProjectUseCase,
        PutProjectUseCase,
        DeleteProjectUseCase,
        RestoreProjectUseCase,
        HardDeleteProjectUseCase,
        {
            provide: PROJECT_REPOSITORY,
            useClass: ProjectMongooseRepository
        }
    ],
    exports: [
        PROJECT_REPOSITORY,
        GetProjectsUseCase,
        CreateProjectUseCase,
        GetProjectByIdUseCase,
        PatchProjectUseCase,
        PutProjectUseCase,
        DeleteProjectUseCase,
        RestoreProjectUseCase,
        HardDeleteProjectUseCase,
    ]
})
export class ProjectModule { }
