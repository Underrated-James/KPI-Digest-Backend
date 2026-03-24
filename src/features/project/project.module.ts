import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Project } from './domain/entities/project.entity';
import { ProjectSchema } from './domain/schema/project-schema';
import { ProjectController } from './application/controllers/project.controller';
import { GetProjectsUseCase } from './application/api/use-cases/get-projects-use-case';
import { CreateProjectUseCase } from './application/api/use-cases/create-project-use-case';
import { GetProjectByIdUseCase } from './application/api/use-cases/get-project-by-id-use-case';
import { PatchProjectUseCase } from './application/api/use-cases/patch-project-use-case';
import { DeleteProjectUseCase } from './application/api/use-cases/delete-project-use-case';
import { PutProjectUseCase } from './application/api/use-cases/put-project-use-case';
import { ProjectMongooseRepository } from './application/services/project-impl-repository';


@Module({
    imports: [
        MongooseModule.forFeature([{ name: Project.name, schema: ProjectSchema }])
    ],
    controllers: [ProjectController],
    providers: [
        GetProjectsUseCase,
        CreateProjectUseCase,
        GetProjectByIdUseCase,
        PatchProjectUseCase,
        PutProjectUseCase,
        DeleteProjectUseCase,
        {
            provide: 'ProjectRepository',
            useClass: ProjectMongooseRepository
        }
    ],
    exports: [
        'ProjectRepository',
        GetProjectsUseCase,
        CreateProjectUseCase,
        GetProjectByIdUseCase,
        PatchProjectUseCase,
        PutProjectUseCase,
        DeleteProjectUseCase
    ]
})
export class ProjectModule { }
