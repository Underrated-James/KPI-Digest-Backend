import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Query,
  Put,
} from '@nestjs/common';
import { GetProjectsUseCase } from '../use-cases/get-projects-use-case';
import { CreateProjectUseCase } from '../use-cases/create-project-use-case';
import { GetProjectByIdUseCase } from '../use-cases/get-project-by-id-use-case';
import { PatchProjectUseCase } from '../use-cases/patch-project-use-case';
import { PutProjectUseCase } from '../use-cases/put-project-use-case';
import { DeleteProjectUseCase } from '../use-cases/delete-project-use-case';
import { RestoreProjectUseCase } from '../use-cases/restore-project-use-case';
import { HardDeleteProjectUseCase } from '../use-cases/hard-delete-project-use-case';
import { ProjectResponseDto } from '../api/dto/response/project-response-dto';
import { UserResponseDto } from 'src/features/users/application/api/dtos/response/user-response-dto';
import { ResponseMessage } from '../../../../common/decorators/response-message.decorator';
import { ParseMongoIdPipe } from '../../../../common/pipes/parse-mongo-id.pipe';
import { CreateProjectDto } from '../api/dto/request/create-project-dto';
import { PatchProjectDto } from '../api/dto/request/patch-project-dto';
import { PutProjectDto } from '../api/dto/request/put-project-dto';
import { GetProjectQueryDto } from '../api/dto/request/get-project-dto';
import {
  PROJECT_MODEL,
  PROJECT_RESPONSE_MESSAGES,
  PROJECT_REPOSITORY,
} from '../../domain/constants/project.constants';
import { type ProjectRepository } from '../../infrastracture/repositories/project.repository';

@Controller('projects')
export class ProjectController {
  constructor(
    private readonly createProjectUseCase: CreateProjectUseCase,
    private readonly getProjectsUseCase: GetProjectsUseCase,
    private readonly getProjectByIdUseCase: GetProjectByIdUseCase,
    private readonly patchProjectUseCase: PatchProjectUseCase,
    private readonly putProjectUseCase: PutProjectUseCase,
    private readonly deleteProjectUseCase: DeleteProjectUseCase,
    private readonly restoreProjectUseCase: RestoreProjectUseCase,
    private readonly hardDeleteProjectUseCase: HardDeleteProjectUseCase,
    @Inject(PROJECT_REPOSITORY)
    private readonly projectRepository: ProjectRepository,
  ) { }


  // Get All Projects (Paginated)
  @Get()
  @ResponseMessage(PROJECT_RESPONSE_MESSAGES.RETRIEVED_ALL)
  async findAll(
    @Query() getProjectQueryDto: GetProjectQueryDto
  ) {
    const projects = await this.getProjectsUseCase.execute(
      getProjectQueryDto.page,
      getProjectQueryDto.size,
      getProjectQueryDto.status,
      getProjectQueryDto.search,
    );
    return ProjectResponseDto.fromPaginatedResult(projects);
  }

  // Create a New Project
  @Post()
  @ResponseMessage(PROJECT_RESPONSE_MESSAGES.CREATED)
  async create(@Body() createProjectDto: CreateProjectDto) {
    const project = await this.createProjectUseCase.execute(createProjectDto);
    return ProjectResponseDto.fromEntity(project);
  }

  // Get a Project by ID
  @Get(':id')
  @ResponseMessage(PROJECT_RESPONSE_MESSAGES.RETRIEVED_ONE)
  async findOne(@Param('id', new ParseMongoIdPipe(PROJECT_MODEL)) id: string) {
    const project = await this.getProjectByIdUseCase.execute(id);
    return ProjectResponseDto.fromEntity(project);
  }

  @Get(':id/members')
  @ResponseMessage('Project members retrieved successfully')
  async getProjectMembers(
    @Param('id', new ParseMongoIdPipe(PROJECT_MODEL)) id: string,
  ) {
    const members = await this.projectRepository.getMembers(id);
    return UserResponseDto.fromEntities(members);
  }

  @Get(':id/members/developers')
  @ResponseMessage('Project developers retrieved successfully')
  async getProjectDevelopers(
    @Param('id', new ParseMongoIdPipe(PROJECT_MODEL)) id: string,
  ) {
    const developers = await this.projectRepository.getMembersByRole(id, 'DEVS');
    return UserResponseDto.fromEntities(developers);
  }

  @Get(':id/members/qa')
  @ResponseMessage('Project QA retrieved successfully')
  async getProjectQa(
    @Param('id', new ParseMongoIdPipe(PROJECT_MODEL)) id: string,
  ) {
    const qa = await this.projectRepository.getMembersByRole(id, 'QA');
    return UserResponseDto.fromEntities(qa);
  }

  // Patch User by ID
  @Patch(':id')
  @ResponseMessage(PROJECT_RESPONSE_MESSAGES.PATCHED)
  async patch(
    @Param('id', new ParseMongoIdPipe(PROJECT_MODEL)) id: string,
    @Body() patchProjectDto: PatchProjectDto
  ) {
    const project = await this.patchProjectUseCase.execute(id, patchProjectDto);
    return ProjectResponseDto.fromEntity(project);
  }

  @Put(':id')
  @ResponseMessage(PROJECT_RESPONSE_MESSAGES.PUT)
  async put(
    @Param('id', new ParseMongoIdPipe(PROJECT_MODEL)) id: string,
    @Body() putProjectDto: PutProjectDto
  ) {
    const project = await this.putProjectUseCase.execute(id, putProjectDto);
    return ProjectResponseDto.fromEntity(project);
  }

  @Delete(':id')
  @ResponseMessage(PROJECT_RESPONSE_MESSAGES.DELETED)
  async remove(@Param('id', new ParseMongoIdPipe(PROJECT_MODEL)) id: string) {
    await this.deleteProjectUseCase.execute(id);
  }

  // Patch Restore Project by ID
  @Patch(':id/restore')
  @ResponseMessage(PROJECT_RESPONSE_MESSAGES.RESTORED)
  async restore(
    @Param('id', new ParseMongoIdPipe(PROJECT_MODEL)) id: string) {
    await this.restoreProjectUseCase.execute(id);
  }

  // Hard Delete a Project by ID
  @Delete(':id/hard-delete')
  @ResponseMessage(PROJECT_RESPONSE_MESSAGES.HARD_DELETED)
  async hardDelete(
    @Param('id', new ParseMongoIdPipe(PROJECT_MODEL)) id: string) {
    await this.hardDeleteProjectUseCase.execute(id);
  }
}
